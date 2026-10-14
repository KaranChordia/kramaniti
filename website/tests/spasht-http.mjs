import assert from 'node:assert/strict';
const origin=process.env.SPASHT_TEST_ORIGIN ?? 'http://127.0.0.1:3017';
for(const old of ['clarity-square','clarity-circle']) {
 const r=await fetch(`${origin}/${old}/?view=tasks&project=kept`,{redirect:'manual'});
 assert.equal(r.status,308);const target=new URL(r.headers.get('location'),origin);assert.match(target.pathname,/^\/spasht\/?$/);assert.equal(target.searchParams.get('project'),'kept');assert.equal(target.searchParams.get('view'),'tasks');
 const a=await fetch(`${origin}/api/${old}/assistant/`,{method:'POST',headers:{'content-type':'application/json'},body:'{}',redirect:'manual'});assert.equal(a.status,401);assert.equal(a.headers.get('location'),null);
}
const html=await (await fetch(`${origin}/spasht/`)).text();assert.ok(html.includes('canonical" href="https://www.kramaniti.com/spasht/'));assert.ok(!html.includes('Clarity Square'));
const sitemap=await(await fetch(`${origin}/sitemap.xml`)).text();assert.ok(sitemap.includes('/spasht/'));assert.ok(!sitemap.includes('/clarity-square/'));
const llms=await(await fetch(`${origin}/llms.txt`)).text();assert.ok(llms.includes('[Spasht]'));
console.log('PASS: both old page redirects preserve query, legacy POST APIs preserve method, canonical, sitemap and llms');
