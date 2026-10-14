import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createOAuthAccessToken, verifyOAuthAccessToken, createOAuthCode, verifyOAuthCode} from '../spasht-chatgpt-app/src/tokens.ts';
process.env.OAUTH_TOKEN_SECRET='controlled-test-secret-not-a-real-credential';
const payload={iss:'https://manager.example.invalid',aud:'https://manager.example.invalid/mcp',scope:'spasht.read',sub:'fixture',email:'fixture@example.invalid',supabaseAccessToken:'fixture-only'};
test('new and legacy encrypted OAuth tokens remain valid without rotating the signing secret',async()=>{
 const token=createOAuthAccessToken(payload,300);assert.ok(token.startsWith('spasht1.'));assert.equal((await verifyOAuthAccessToken(token)).sub,'fixture');assert.equal((await verifyOAuthAccessToken(token.replace(/^spasht1\./,'ccm1.'))).sub,'fixture');
 await assert.rejects(verifyOAuthAccessToken(createOAuthAccessToken(payload,-1)),/expired/);
});
test('in-flight legacy authorization codes remain consumable',()=>{
 const code=createOAuthCode({clientId:'fixture',redirectUri:'https://example.invalid',resource:payload.aud,scope:'clarity_square.read',codeChallenge:'fixture',codeChallengeMethod:'S256',supabaseAccessToken:'fixture',userId:'fixture',email:'fixture@example.invalid'});
 assert.ok(code.startsWith('spashtc1.'));assert.equal(verifyOAuthCode(code.replace(/^spashtc1\./,'ccmc1.')).userId,'fixture');
});
