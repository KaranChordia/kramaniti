import type { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";
import { URL } from "node:url";
import { AuthError, signInForOAuth } from "./supabase.js";
import { createOAuthAccessToken, createOAuthCode, pkceS256, verifyOAuthCode } from "./tokens.js";

const SCOPES = ["clarity_square.read", "clarity_square.write"];
const DEFAULT_CLIENT_ID = "chatgpt-default-client";
const DEFAULT_REDIRECT_URI = "https://chatgpt.com/connector_platform_oauth_redirect";
const NO_PKCE_CHALLENGE = "no-pkce";

type Body = Record<string, string | string[]>;

function originFromRequest(req: IncomingMessage) {
  const configured = process.env.APP_ORIGIN || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (configured) {
    return configured.startsWith("http") ? configured : `https://${configured}`;
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:8010";
  const protocol = req.headers["x-forwarded-proto"] || (String(host).includes("localhost") ? "http" : "https");
  return `${protocol}://${Array.isArray(host) ? host[0] : host}`;
}

function originFromHeaders(headers: Headers) {
  const configured = process.env.APP_ORIGIN || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (configured) {
    return configured.startsWith("http") ? configured : `https://${configured}`;
  }

  const host = headers.get("x-forwarded-host") || headers.get("host") || "localhost:8010";
  const protocol = headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

function mcpResource(req: IncomingMessage) {
  return `${originFromRequest(req)}/mcp`;
}

function mcpResourceFromHeaders(headers: Headers) {
  return `${originFromHeaders(headers)}/mcp`;
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function sendHtml(res: ServerResponse, status: number, html: string) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
}

function redirect(res: ServerResponse, url: string) {
  res.statusCode = 302;
  res.setHeader("Location", url);
  res.end();
}

function escapeHtml(value: string | undefined | null) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function readRawBody(req: IncomingMessage) {
  const existing = (req as IncomingMessage & { body?: unknown }).body;
  if (typeof existing === "string") return existing;
  if (existing && typeof existing === "object") return JSON.stringify(existing);

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readBody(req: IncomingMessage): Promise<Body> {
  const raw = await readRawBody(req);
  const contentType = req.headers["content-type"] || "";
  if (String(contentType).includes("application/json")) {
    return JSON.parse(raw || "{}") as Body;
  }
  return Object.fromEntries(new URLSearchParams(raw)) as Body;
}

function authorizationServerMetadata(req: IncomingMessage) {
  const origin = originFromRequest(req);
  return {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/oauth/token`,
    registration_endpoint: `${origin}/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    token_endpoint_auth_methods_supported: ["none"],
    code_challenge_methods_supported: ["S256"],
    scopes_supported: SCOPES,
    client_id_metadata_document_supported: true,
  };
}

export function protectedResourceMetadata(req: IncomingMessage) {
  const origin = originFromRequest(req);
  return {
    resource: mcpResource(req),
    authorization_servers: [origin],
    bearer_methods_supported: ["header"],
    scopes_supported: SCOPES,
  };
}

export function wwwAuthenticateHeader(req: IncomingMessage, scope = "clarity_square.read") {
  const resource = mcpResource(req);
  const metadata = `${originFromRequest(req)}/.well-known/oauth-protected-resource`;
  return `Bearer resource_metadata="${metadata}", resource="${resource}", scope="${scope}"`;
}

export function wwwAuthenticateHeaderFromHeaders(headers: Headers, scope = "clarity_square.read") {
  const origin = originFromHeaders(headers);
  const metadata = `${origin}/.well-known/oauth-protected-resource`;
  return `Bearer resource_metadata="${metadata}", resource="${mcpResourceFromHeaders(headers)}", scope="${scope}"`;
}

function authorizePage(params: URLSearchParams, error = "") {
  const hidden = Array.from(params.entries())
    .map(([key, value]) => `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(value)}" />`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Connect Clarity Square</title>
    <style>
      :root { color-scheme: light dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f2e9; color: #141414; }
      main { width: min(430px, calc(100vw - 32px)); background: #fffaf0; border: 1px solid #dfd3bf; border-radius: 10px; padding: 28px; box-shadow: 0 18px 60px rgba(20,20,20,.14); }
      h1 { margin: 0 0 8px; font-size: 24px; line-height: 1.15; }
      p { margin: 0 0 22px; color: #57534b; line-height: 1.5; }
      label { display: grid; gap: 8px; margin: 14px 0; font-size: 13px; font-weight: 700; color: #2c2924; }
      input { width: 100%; box-sizing: border-box; border: 1px solid #c9bca8; border-radius: 8px; padding: 12px 13px; font: inherit; background: #fff; color: #141414; }
      button { width: 100%; margin-top: 12px; border: 0; border-radius: 8px; padding: 13px 16px; font: inherit; font-weight: 800; color: #fff; background: #141414; cursor: pointer; }
      .error { margin-bottom: 16px; color: #9f1d1d; font-weight: 700; }
      .note { margin-top: 18px; font-size: 12px; color: #6f685f; }
      @media (prefers-color-scheme: dark) {
        body { background: #171512; color: #f8f2e8; }
        main { background: #211f1a; border-color: #3b352d; }
        p, .note { color: #bdb4a6; }
        label { color: #f8f2e8; }
        input { background: #15130f; color: #f8f2e8; border-color: #554b3f; }
        button { background: #d5a100; color: #171512; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Connect Clarity Square</h1>
      <p>Sign in with your Clarity Square username or email. ChatGPT will only receive access scoped to this manager app.</p>
      ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
      <form method="post" action="/oauth/authorize">
        ${hidden}
        <label>
          Username or email
          <input name="login" autocomplete="username" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autocomplete="current-password" required />
        </label>
        <button type="submit">Connect account</button>
      </form>
      <div class="note">No service-role key is used. Supabase RLS still controls which Clarity Square rows are visible.</div>
    </main>
  </body>
</html>`;
}

function validateAuthorizeParams(params: URLSearchParams) {
  const responseType = params.get("response_type") || "code";
  const clientId = params.get("client_id") || DEFAULT_CLIENT_ID;
  const redirectUri = params.get("redirect_uri") || process.env.DEFAULT_REDIRECT_URI || DEFAULT_REDIRECT_URI;
  const codeChallenge = params.get("code_challenge") || NO_PKCE_CHALLENGE;
  const codeChallengeMethod = params.get("code_challenge_method") || "S256";

  if (responseType !== "code") throw new Error("Only authorization code flow is supported.");
  if (codeChallengeMethod !== "S256") throw new Error("Only S256 PKCE is supported.");

  params.set("response_type", "code");
  params.set("client_id", clientId);
  params.set("redirect_uri", redirectUri);
  params.set("code_challenge", codeChallenge);
  params.set("code_challenge_method", "S256");

  return { clientId, redirectUri, codeChallenge, codeChallengeMethod };
}

export async function handleOAuth(req: IncomingMessage, res: ServerResponse) {
  const requestUrl = new URL(req.url || "/", originFromRequest(req));

  if (requestUrl.pathname === "/.well-known/oauth-protected-resource") {
    return sendJson(res, 200, protectedResourceMetadata(req));
  }

  if (
    requestUrl.pathname === "/.well-known/oauth-authorization-server" ||
    requestUrl.pathname === "/.well-known/openid-configuration"
  ) {
    return sendJson(res, 200, authorizationServerMetadata(req));
  }

  if (requestUrl.pathname === "/oauth/register" && req.method === "POST") {
    const body = await readBody(req);
    const redirectUris = Array.isArray(body.redirect_uris) ? body.redirect_uris : [];
    return sendJson(res, 201, {
      client_id: body.client_name
        ? `chatgpt-${Buffer.from(String(body.client_name)).toString("base64url").slice(0, 24)}`
        : `chatgpt-${cryptoSafeRandom()}`,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code"],
      response_types: ["code"],
      redirect_uris: redirectUris,
      scope: SCOPES.join(" "),
    });
  }

  if (requestUrl.pathname === "/oauth/authorize" && req.method === "GET") {
    try {
      validateAuthorizeParams(requestUrl.searchParams);
      return sendHtml(res, 200, authorizePage(requestUrl.searchParams));
    } catch (error) {
      return sendHtml(res, 400, authorizePage(requestUrl.searchParams, error instanceof Error ? error.message : "Invalid authorization request."));
    }
  }

  if (requestUrl.pathname === "/oauth/authorize" && req.method === "POST") {
    const body = await readBody(req);
    const params = new URLSearchParams(body as Record<string, string>);
    try {
      const { clientId, redirectUri, codeChallenge } = validateAuthorizeParams(params);
      const resource = params.get("resource") || mcpResource(req);
      const scope = params.get("scope") || "clarity_square.read clarity_square.write";
      const login = String(body.login || "");
      const password = String(body.password || "");

      const session = await signInForOAuth(login, password);
      const code = createOAuthCode({
        clientId,
        redirectUri,
        resource,
        scope,
        codeChallenge,
        codeChallengeMethod: "S256",
        supabaseAccessToken: session.accessToken,
        userId: session.userId,
        email: session.email,
      });

      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set("code", code);
      const state = params.get("state");
      if (state) callbackUrl.searchParams.set("state", state);
      return redirect(res, callbackUrl.toString());
    } catch (error) {
      const message = error instanceof AuthError || error instanceof Error ? error.message : "Sign-in failed.";
      return sendHtml(res, 401, authorizePage(params, message));
    }
  }

  if (requestUrl.pathname === "/oauth/token" && req.method === "POST") {
    try {
      const body = await readBody(req);
      if (body.grant_type !== "authorization_code") {
        return sendJson(res, 400, { error: "unsupported_grant_type" });
      }

      const code = String(body.code || "");
      const verifier = String(body.code_verifier || "");
      if (!code) return sendJson(res, 400, { error: "invalid_request" });

      const payload = verifyOAuthCode(code);
      if (body.client_id && String(body.client_id) !== payload.clientId) return sendJson(res, 400, { error: "invalid_grant" });
      if (body.redirect_uri && String(body.redirect_uri) !== payload.redirectUri) return sendJson(res, 400, { error: "invalid_grant" });
      if (payload.codeChallenge !== NO_PKCE_CHALLENGE && pkceS256(verifier) !== payload.codeChallenge) {
        return sendJson(res, 400, { error: "invalid_grant" });
      }

      const expiresIn = 3600;
      const accessToken = createOAuthAccessToken(
        {
          iss: originFromRequest(req),
          aud: payload.resource,
          scope: payload.scope,
          sub: payload.userId,
          email: payload.email,
          supabaseAccessToken: payload.supabaseAccessToken,
        },
        expiresIn
      );

      return sendJson(res, 200, {
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: expiresIn,
        scope: payload.scope,
      });
    } catch {
      return sendJson(res, 400, { error: "invalid_grant" });
    }
  }

  return sendJson(res, 404, { error: "not_found" });
}

function cryptoSafeRandom() {
  return crypto.randomBytes(12).toString("base64url");
}
