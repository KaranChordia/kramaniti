import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readCompatibleStorage, clearCompatibleStorage, legacyWorkspaceKeys, legacyHandoffKeys, workspaceStorageKey, handoffStorageKey, normalizeThreadId, normalizeProjectPayload, actionClaimNamespace} from '../src/lib/spasht/compatibility.ts';
const storage=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};};
test('both previous browser namespaces migrate without dropping saved content or backups',()=>{
 for(const old of legacyWorkspaceKeys){const store=storage();const record=JSON.stringify({activeMenu:'square',assistantMessages:[{id:'kept',content:'Private idea'}],savedContext:{headline:'Keep'}});store.setItem(old,record);assert.equal(readCompatibleStorage(store,workspaceStorageKey,legacyWorkspaceKeys),record);assert.equal(store.getItem(workspaceStorageKey),record);assert.equal(store.getItem(old),record);clearCompatibleStorage(store,workspaceStorageKey,legacyWorkspaceKeys);assert.equal(store.getItem(old),null);}
});
test('canonical data wins; corrupt values recover from valid legacy state',()=>{
 const store=storage();store.setItem(workspaceStorageKey,'{');store.setItem(legacyWorkspaceKeys[0],'[]');store.setItem(legacyWorkspaceKeys[1],'{"step":"context"}');assert.equal(readCompatibleStorage(store,workspaceStorageKey,legacyWorkspaceKeys),'{"step":"context"}');store.setItem(workspaceStorageKey,'{"step":"intent"}');assert.equal(readCompatibleStorage(store,workspaceStorageKey,legacyWorkspaceKeys),'{"step":"intent"}');
});
test('handoffs remain consumable and clear every old key after consumption',()=>{
 const store=storage();store.setItem(legacyHandoffKeys[0],'{"version":1,"projectId":"saved"}');assert.ok(readCompatibleStorage(store,handoffStorageKey,legacyHandoffKeys));clearCompatibleStorage(store,handoffStorageKey,legacyHandoffKeys);assert.equal(readCompatibleStorage(store,handoffStorageKey,legacyHandoffKeys),null);
});
test('receipt namespace and saved thread identity remain stable',()=>{
 assert.equal(createHash('sha256').update(actionClaimNamespace+'message').digest('hex'),createHash('sha256').update('clarity-square:action-claim:message').digest('hex'));
 assert.equal(normalizeThreadId('square-thread-default'),normalizeThreadId('circle-thread-default'));
 assert.equal(normalizeThreadId('square-thread-123'),'square-thread-123');
 assert.deepEqual(normalizeProjectPayload({squareProject:{projectId:'kept'}}).spashtProject,{projectId:'kept'});
 assert.deepEqual(normalizeProjectPayload({squareProject:{projectId:'old'},spashtProject:{projectId:'current'}}).spashtProject,{projectId:'current'});
});
