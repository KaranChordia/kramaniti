import crypto from "node:crypto";

const TOKEN_PREFIX = "ccm1";
const CODE_PREFIX = "ccmc1";

type EncryptedPayload = {
  iv: string;
  tag: string;
  data: string;
};

export type OAuthCodePayload = {
  type: "authorization_code";
  clientId: string;
  redirectUri: string;
  resource: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: "S256";
  supabaseAccessToken: string;
  userId: string;
  email: string;
  expiresAt: number;
};

export type OAuthAccessPayload = {
  type: "access_token";
  iss: string;
  aud: string;
  scope: string;
  sub: string;
  email: string;
  supabaseAccessToken: string;
  exp: number;
  iat: number;
};

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function getSecretKey() {
  const secret = process.env.OAUTH_TOKEN_SECRET || process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("OAUTH_TOKEN_SECRET must be configured with at least 32 characters.");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

function encrypt(prefix: string, payload: Record<string, unknown>) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getSecretKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const envelope: EncryptedPayload = {
    iv: base64url(iv),
    tag: base64url(cipher.getAuthTag()),
    data: base64url(encrypted),
  };
  return `${prefix}.${base64url(JSON.stringify(envelope))}`;
}

function decrypt<T>(token: string, prefix: string): T {
  if (!token.startsWith(`${prefix}.`)) {
    throw new Error("Token prefix is invalid.");
  }

  const encodedEnvelope = token.slice(prefix.length + 1);
  const envelope = JSON.parse(Buffer.from(encodedEnvelope, "base64url").toString("utf8")) as EncryptedPayload;
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getSecretKey(),
    Buffer.from(envelope.iv, "base64url")
  );
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64url"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(envelope.data, "base64url")),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf8")) as T;
}

export function createOAuthCode(payload: Omit<OAuthCodePayload, "type" | "expiresAt">) {
  return encrypt(CODE_PREFIX, {
    ...payload,
    type: "authorization_code",
    expiresAt: Math.floor(Date.now() / 1000) + 300,
  });
}

export function verifyOAuthCode(code: string): OAuthCodePayload {
  const payload = decrypt<OAuthCodePayload>(code, CODE_PREFIX);
  if (payload.type !== "authorization_code") throw new Error("Authorization code is invalid.");
  if (payload.expiresAt < Math.floor(Date.now() / 1000)) throw new Error("Authorization code expired.");
  return payload;
}

export function createOAuthAccessToken(payload: Omit<OAuthAccessPayload, "type" | "iat" | "exp">, expiresInSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  return encrypt(TOKEN_PREFIX, {
    ...payload,
    type: "access_token",
    iat: now,
    exp: now + expiresInSeconds,
  });
}

export async function verifyOAuthAccessToken(token: string): Promise<OAuthAccessPayload> {
  const payload = decrypt<OAuthAccessPayload>(token, TOKEN_PREFIX);
  if (payload.type !== "access_token") throw new Error("Access token is invalid.");
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Access token expired.");
  return payload;
}

export function pkceS256(verifier: string) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}
