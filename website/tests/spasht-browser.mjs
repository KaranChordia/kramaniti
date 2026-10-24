// Controlled browser integration; no requests or email deliveries reach live services.
// Run with SPASHT_PLAYWRIGHT_MODULE=/absolute/path/to/playwright node tests/spasht-browser.mjs
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, next) {
 if(specifier === './compatibility') return next(new URL('./compatibility.ts', context.parentURL).href, context);
 return next(specifier, context);
}});
const {workspaceRevision,actionClaimId}=await import('../src/lib/spasht/workspace.ts');
const require=createRequire(import.meta.url);
const { chromium }=require(process.env.SPASHT_PLAYWRIGHT_MODULE ?? 'playwright');
const origin=process.env.SPASHT_TEST_ORIGIN ?? 'http://127.0.0.1:3000';
const output=process.env.SPASHT_QA_OUTPUT ?? '/tmp/kramaniti-spasht-qa';
await mkdir(output,{recursive:true});
const owner='f731acb1-28a6-4433-bd8c-1d46c5a881a1';
const projectId='f731acb1-28a6-4433-bd8c-1d46c5a882a1';
let serial=0;
const id=()=>`b731acb1-28a6-4433-bd8c-${String(++serial).padStart(12,'0')}`;
const stamp='2026-10-12T00:00:00.000Z';
const user={id:owner,email:'fixture@example.invalid',aud:'authenticated',role:'authenticated',user_metadata:{username:'fixture'},app_metadata:{provider:'email'},created_at:stamp};
const token=[{alg:'HS256',typ:'JWT'},{sub:owner,exp:Math.floor(Date.now()/1000)+3600},'fixture'].map(part=>Buffer.from(typeof part==='string'?part:JSON.stringify(part)).toString('base64url')).join('.');
const session={access_token:token,refresh_token:'fixture-refresh',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,token_type:'bearer',user};
const project={id:projectId,user_id:owner,folder_id:null,track:'founder',title:'Fixture project',context:'Fixture private business context',project_instruction:'Review a useful workflow',audience:null,blocker:null,outcome:null,summary:'Fixture summary',questions:[],actions:[],status:'active',created_at:stamp,updated_at:stamp};
const task={id:'f731acb1-28a6-4433-bd8c-1d46c5a883a1',user_id:owner,project_id:projectId,title:'Fixture task',detail:'First test action',source:'user',status:'open',sort_order:0,created_at:stamp,updated_at:stamp};
const memory={id:'f731acb1-28a6-4433-bd8c-1d46c5a884a1',user_id:owner,project_id:projectId,title:'Fixture preference',content:'Keep replies concise',memory_type:'preference',source:'user',status:'active',created_at:stamp,updated_at:stamp};
const db={projects:[project],project_tasks:[task],assistant_memories:[memory],profiles:[{user_id:owner,email:user.email,username:'fixture',preferred_track:'founder',assistant_settings:{},created_at:stamp,updated_at:stamp}],project_folders:[],project_reports:[],context_entries:[],assistant_messages:[],product_events:[]};
let failTable=null;let failRead=null;let operations=[];
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await context.addInitScript(({session})=>{if(!localStorage.getItem('clarity-qa-seeded')){localStorage.setItem('sb-bpvbnxqtfwrsmrpvcepc-auth-token',JSON.stringify(session));localStorage.setItem('clarity-qa-seeded','true');}},{session});
await context.routeWebSocket('**/supabase.co/**', socket => socket.close());
await context.route('**/supabase.co/**',route=>route.abort());
await context.route('https://bpvbnxqtfwrsmrpvcepc.supabase.co/**',async route=>{
 const request=route.request(),url=new URL(request.url()),method=request.method();
 const send=(data,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
 if(url.pathname.startsWith('/auth/v1')){
  if(url.pathname.endsWith('/logout')) return route.fulfill({status:204});
  if(url.pathname.endsWith('/user')) return send(user);
  if(url.pathname.endsWith('/token')) return send(session);
  if(url.pathname.endsWith('/signup')) return send({user,session:null});
  return send({});
 }
 if(!url.pathname.startsWith('/rest/v1/')) return send({});
 const table=url.pathname.split('/').pop();
 if(!(table in db)) throw new Error(`Unexpected table ${table}`);
 if((method==='GET'&&failRead===table)||(method!=='GET'&&failTable===table)) return send({code:'TEST_FAILURE',message:'Controlled save failure'},500);
 const filters=[...url.searchParams].filter(([key])=>!['select','order','limit'].includes(key));
 const matches=row=>filters.every(([key,value])=>value.startsWith('eq.')?String(row[key])===value.slice(3):value.startsWith('neq.')?String(row[key])!==value.slice(4):true);
 let rows=db[table].filter(matches);
 if(method==='GET'&&url.searchParams.has('order')) { const orders=url.searchParams.get('order').split(','); rows.sort((a,b)=>{for(const order of orders){const [field,direction]=order.split('.');const comparison=String(a[field]??'').localeCompare(String(b[field]??''));if(comparison)return direction==='desc'?-comparison:comparison;}return 0;}); }
 if(method==='POST'){
  const input=request.postDataJSON();const incoming=Array.isArray(input)?input:[input];
  if(incoming.some(row=>row.id&&db[table].some(existing=>existing.id===row.id))) return send({code:'23505',message:'Duplicate claim'},409);
  rows=incoming.map(row=>{ const timestamp=new Date(Date.parse(stamp)+(++serial)*1000).toISOString();return {id:id(),user_id:owner,status:table==='project_tasks'?'open':'active',created_at:timestamp,updated_at:timestamp,...row}; });db[table].push(...rows);operations.push({table,method,count:rows.length});
 } else if(method==='PATCH'){
  const patch=request.postDataJSON();rows=rows.map(row=>Object.assign(row,patch,{updated_at:`2026-10-12T00:00:${String(++serial%60).padStart(2,'0')}.000Z`}));operations.push({table,method,count:rows.length});
 } else if(method==='DELETE') {db[table]=db[table].filter(row=>!matches(row));operations.push({table,method,count:rows.length});}
 const single=request.headers()['accept']?.includes('vnd.pgrst.object');
 if(single&&rows.length!==1) return send({code:'PGRST116',message:'No returned row'},406);
 return send(single?rows[0]:rows);
});
let providerRequests=0;
await context.route('**/api/spasht/assistant',route=>{
 providerRequests++;
 const body=route.request().postDataJSON();assert.ok(route.request().headers().authorization?.startsWith('Bearer '));
 const message=body.messages?.at(-1)?.content??'';
 const payload={response:'Let’s clarify the first useful move.',source:'local',workspaceRevision:workspaceRevision({projects:db.projects,folders:db.project_folders,tasks:db.project_tasks,memories:db.assistant_memories})};
 if(message.startsWith('Create a project from this idea:')) payload.projectDraft={title:'My first real project',track:'builder',context:message.split('Create a project from this idea:')[1].trim(),audience:'',blocker:'',outcome:''};
 else if(/create.*(task|step)/i.test(message)) payload.taskDrafts=[{title:message.includes('fresh')?'Fresh reviewed action':'Assistant reviewed next action',detail:'Check a concrete user need'}];
 return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(payload)});
});
const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
const mainNav=()=>page.getByRole('navigation',{name:'Spasht sections',exact:true});
const open=async name=>{await mainNav().getByRole('button',{name,exact:true}).click();};
try {
 await page.goto(`${origin}/clarity-square/`,{waitUntil:'networkidle'});
 assert.equal(new URL(page.url()).pathname,'/spasht/');
 await page.getByRole('heading',{name:'What would you like to make clearer?',exact:true}).waitFor();
 await page.getByLabel('Recent projects').getByRole('button').first().waitFor();
 assert.deepEqual(await mainNav().getByRole('button').allTextContents(),['Home','Projects']);
 await page.screenshot({path:`${output}/simple-home-1440.png`});
 await page.getByLabel('Recent projects').getByRole('button').first().click();
 await page.getByRole('heading',{name:'Fixture project',exact:true}).waitFor();assert.ok(page.url().includes(`project=${projectId}`));
 const conversationTab=page.getByRole('tab',{name:'Conversation',exact:true});
 await conversationTab.focus();await page.keyboard.press('ArrowRight');
 assert.equal(await page.getByRole('tab',{name:'Next steps',exact:true}).getAttribute('aria-selected'),'true');
 assert.equal(await page.evaluate(()=>document.activeElement?.id),'project-tab-steps');
 await page.keyboard.press('End');assert.equal(await page.getByRole('tab',{name:'Details',exact:true}).getAttribute('aria-selected'),'true');
 await page.keyboard.press('Home');assert.equal(await conversationTab.getAttribute('aria-selected'),'true');
 await page.getByRole('tab',{name:'Next steps',exact:true}).click();
 const taskButton=page.getByRole('checkbox',{name:'Fixture task',exact:true});
 failTable='project_tasks';await taskButton.click();await page.getByRole('alert').filter({hasText:'Task change was not saved'}).waitFor();assert.equal(db.project_tasks[0].status,'open');
 failTable=null;await taskButton.click();await page.getByRole('status').filter({hasText:'Task completed and saved'}).waitFor();assert.equal(db.project_tasks[0].status,'done');
 await page.reload({waitUntil:'networkidle'});await page.getByRole('heading',{name:'Fixture project',exact:true}).waitFor();assert.equal(await page.getByRole('tab',{name:'Next steps',exact:true}).getAttribute('aria-selected'),'true');
 await page.getByText('Completed steps',{exact:true}).click();await page.getByRole('checkbox',{name:'Fixture task',exact:true}).waitFor();
 await page.getByRole('tab',{name:'Details',exact:true}).click();await page.getByLabel('Project summary',{exact:true}).fill('A clearer description of the real project');await page.getByRole('button',{name:'Save details',exact:true}).click();await page.getByRole('status').filter({hasText:'Project details saved.'}).waitFor();assert.equal(db.projects[0].context,'A clearer description of the real project');
 await page.getByText('Project options',{exact:true}).click();await page.getByRole('button',{name:'What’s remembered',exact:true}).click();await page.getByRole('button',{name:'Edit memory',exact:true}).click();
 await page.getByLabel('Memory text').fill('Use one concrete next action');await page.getByRole('button',{name:'Save memory',exact:true}).click();await page.getByLabel('Assistant memories').getByText('Use one concrete next action',{exact:true}).waitFor();assert.equal(db.assistant_memories[0].content,'Use one concrete next action');
 await page.goBack();await page.getByRole('heading',{name:'Fixture project',exact:true}).waitFor();await page.getByRole('tab',{name:'Conversation',exact:true}).click();
 await page.getByLabel('Project message',{exact:true}).fill('Create a task for my project');await page.getByRole('button',{name:'Send project message',exact:true}).click();await page.getByText('Review proposed changes',{exact:true}).waitFor();
 const originals=db.assistant_messages.filter(row=>row.metadata?.pending_action);assert.equal(originals.length,1);
 await page.reload({waitUntil:'networkidle'});await page.getByText('Review proposed changes',{exact:true}).waitFor();
 db.project_tasks[0].updated_at='2026-10-12T01:00:00.000Z';const before=db.project_tasks.length;
 await page.getByRole('button',{name:'Save changes',exact:true}).click();await page.getByRole('alert').filter({hasText:'changed since this draft'}).waitFor();assert.equal(db.project_tasks.length,before);
 await page.getByLabel('Project message',{exact:true}).fill('Create one fresh task');await page.getByRole('button',{name:'Send project message',exact:true}).click();await page.getByText('Fresh reviewed action',{exact:false}).waitFor();await page.getByRole('button',{name:'Save changes',exact:true}).last().click();await page.getByText('Changes saved',{exact:true}).waitFor();assert.equal(db.project_tasks.length,before+1);
 const latest=db.assistant_messages.filter(row=>row.metadata?.pending_action).at(-1);const claimId=await actionClaimId(latest.id);assert.ok(db.assistant_messages.some(row=>row.id===claimId));
 await page.reload({waitUntil:'networkidle'});await page.getByText('Changes saved',{exact:true}).waitFor();assert.equal(db.project_tasks.length,before+1);
 await page.screenshot({path:`${output}/simple-project-1440.png`});
 // Failed snapshot reads never send stale context to the assistant.
 failRead='project_tasks';const requestsBefore=providerRequests;await page.getByLabel('Project message',{exact:true}).fill('Help me choose the next action');await page.getByRole('button',{name:'Send project message',exact:true}).click();await page.getByRole('region',{name:'Projects',exact:true}).getByRole('alert').waitFor();assert.equal(providerRequests,requestsBefore);failRead=null;
 await page.getByRole('button',{name:'Retry',exact:true}).click();
 // Archive is reversible and preserves related records.
 const keptTasks=db.project_tasks.length,keptMessages=db.assistant_messages.length;
 await page.getByText('Project options',{exact:true}).click();await page.getByRole('button',{name:'Archive project',exact:true}).click();await page.getByRole('heading',{name:'Your projects',exact:true}).waitFor();assert.equal(db.projects[0].status,'archived');assert.equal(db.project_tasks.length,keptTasks);assert.equal(db.assistant_messages.length,keptMessages);
 await page.getByText('Archived projects',{exact:true}).click();await page.getByRole('button',{name:'Restore',exact:true}).click();await page.getByRole('status').filter({hasText:'Project restored.'}).waitFor();assert.equal(db.projects[0].status,'active');
 // One Home conversation becomes a reviewed project; no mandatory roles or folders.
 await open('Home');await page.getByLabel('Your idea',{exact:true}).fill('I want to validate a local service with five interviews.');await page.getByRole('button',{name:'Send your idea',exact:true}).click();await page.getByRole('button',{name:'Save as a project',exact:true}).waitFor();await page.getByRole('button',{name:'Save as a project',exact:true}).click();await page.getByText('New project: My first real project',{exact:true}).waitFor();await page.getByRole('button',{name:'Save changes',exact:true}).click();await page.getByText('Changes saved',{exact:true}).waitFor();
 const created=db.projects.find(row=>row.title==='My first real project');assert.ok(created);assert.equal(created.context,'I want to validate a local service with five interviews.');assert.equal(created.folder_id,null);assert.equal(db.project_folders.length,0);
 await page.getByRole('button',{name:'Open project',exact:true}).click();await page.getByRole('heading',{name:'My first real project',exact:true}).waitFor();assert.ok(page.url().includes(created.id));assert.equal(await page.getByRole('tab',{name:'Conversation',exact:true}).getAttribute('aria-selected'),'true');

 console.log('Core workspace journeys passed');
 // Restored supporting features remain behind one secondary entry.
 const tools=async()=>{if(!(await page.getByRole('textbox',{name:'Find a tool',exact:true}).isVisible())) await page.getByRole('button',{name:'Tools',exact:true}).click();await page.getByRole('textbox',{name:'Find a tool',exact:true}).waitFor();};
 const tool=async(name)=>{await tools();await page.getByRole('button',{name:new RegExp('^'+name)}).click();assert.equal(await page.getByRole('textbox',{name:'Find a tool',exact:true}).count(),0);};
 const restored=[
  ['Guided path','path',()=>page.getByRole('region',{name:'Choose your path',exact:true})],
  ['Clarity brief','context',()=>page.getByRole('heading',{name:'Your Clarity Brief',exact:true})],
  ['Progress loops','loops',()=>page.getByRole('heading',{name:'Loops',exact:true})],
  ['All tasks','tasks',()=>page.getByRole('heading',{name:'Tasks',exact:true})],
  ['Workspace assistant','assistant',()=>page.getByRole('region',{name:'Spasht Assistant',exact:true})],
  ['Project organiser','files',()=>page.getByRole('region',{name:'Projects',exact:true})],
  ['Workspace overview','overview',()=>page.getByRole('heading',{name:'Workspace overview',exact:true,level:1})],
  ['Remembered information','privacy',()=>page.getByRole('heading',{name:'Memory',exact:true})],
  ['Community examples','community',()=>page.getByRole('region',{name:'Spasht threads',exact:true})],
 ];
 await tools();await page.screenshot({path:`${output}/tool-station-1440.png`});
 for(const [label,view,visible] of restored){
  await tool(label);await visible().waitFor();
  await page.waitForFunction(()=>document.querySelector('#workspace-tools h2')===document.activeElement);
  assert.equal(new URL(page.url()).searchParams.get('view'),view);
  assert.equal(new URL(page.url()).searchParams.get('project'),created.id);
  await page.reload({waitUntil:'networkidle'});await visible().waitFor();
  await page.getByRole('button',{name:'All tools',exact:true}).click();await page.getByRole('textbox',{name:'Find a tool',exact:true}).waitFor();
  assert.equal(await page.getByRole('region',{name:'Workspace tools',exact:true}).getByRole('button',{pressed:true}).count(),1);
 }
 await page.screenshot({path:`${output}/tools-desktop-1440.png`});
 // Palette search, truthful empty state, keyboard focus and return context.
 await tools();const search=page.getByRole('textbox',{name:'Find a tool',exact:true});await search.fill('not-a-real-tool');await page.getByText('No tool matches', {exact:false}).waitFor();
 await page.getByRole('button',{name:'Show all tools',exact:true}).click();assert.equal(await search.inputValue(),'');
 await search.fill('folder');assert.equal(await page.getByRole('region',{name:'Work tools',exact:true}).getByRole('button').count(),1);
 await search.fill('memory');assert.equal(await page.getByRole('button',{name:'Remembered information',exact:true}).count(),1);
 await page.getByRole('button',{name:'Clear tool search',exact:true}).click();
 await search.press('Escape');assert.equal(await search.count(),0);assert.equal(await page.getByRole('button',{name:'All tools',exact:true}).evaluate(el=>el===document.activeElement),true);
 await page.getByRole('button',{name:'Exit tools',exact:true}).click();await page.getByRole('heading',{name:'My first real project',exact:true}).waitFor();
 await tools();assert.equal(await search.evaluate(el=>el===document.activeElement),true);
 assert.equal(await page.locator('#workspace-tool-palette').evaluate(el=>getComputedStyle(el).animationName),'none');
 await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});await page.screenshot({path:`${output}/tool-station-light-preference.png`});await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
 await page.getByRole('button',{name:'Exit tools',exact:true}).click();
 await tool('All tasks');
 const headerTools=page.getByRole('button',{name:'Tools',exact:true});
 for(let toggle=0;toggle<6;toggle++)await headerTools.click();
 assert.equal(await search.count(),0);assert.equal(await page.getByRole('region',{name:'Workspace tools',exact:true}).count(),1);
 await tools();await page.getByRole('button',{name:/^Workspace assistant/}).click();
 const assistantDraft=page.getByPlaceholder('Ask, create, or save context...',{exact:true});
 await assistantDraft.fill('Keep this unfinished thought');await tool('All tasks');await tool('Workspace assistant');assert.equal(await assistantDraft.inputValue(),'Keep this unfinished thought');await assistantDraft.fill('');
 // Five distinct loop states, with source gathering before a reviewed action.
 await tool('Progress loops');
 const picker=page.getByRole('complementary',{name:'Choose a loop',exact:true});
 assert.equal(await picker.getByRole('button').count(),5);
 await picker.getByRole('button',{name:/Project Loop/}).click();
 await page.getByRole('button',{name:'Scan Projects',exact:true}).click();
 await page.getByLabel('Project Loop scan overview',{exact:true}).waitFor();
 await page.screenshot({path:`${output}/restored-progress-loops.png`});
 await page.getByRole('button',{name:'Back to My first real project',exact:true}).click();
 await page.getByRole('heading',{name:'My first real project',exact:true}).waitFor();
 // Cross-project task controls still report confirmed writes.
 await tool('All tasks');
 const fixtureTask=page.getByRole('button',{name:/^Fixture task/});
 await fixtureTask.click();await page.getByRole('status').filter({hasText:'Task reopened and saved'}).waitFor();assert.equal(db.project_tasks[0].status,'open');
 await fixtureTask.click();await page.getByRole('status').filter({hasText:'Task completed and saved'}).waitFor();assert.equal(db.project_tasks[0].status,'done');
 // Folder organisation is an explicit action; reload retains the selected project view.
 await tool('Project organiser');
 await page.getByRole('button',{name:/^New [Ff]older$/}).click();
 await page.getByPlaceholder('Folder name',{exact:true}).fill('Reviewed workspace');
 await page.getByPlaceholder('Folder name',{exact:true}).press('Enter');
 await page.getByRole('status').filter({hasText:'Folder created'}).waitFor();assert.ok(db.project_folders.some(folder=>folder.name==='Reviewed workspace'));
 await page.getByRole('region',{name:'Projects',exact:true}).getByRole('button',{name:/^All/}).first().click();
 await page.getByRole('list',{name:'Project list',exact:true}).getByRole('button',{name:/My first real project/}).click();
 await page.reload({waitUntil:'networkidle'});await page.getByRole('region',{name:'Project reports',exact:true}).waitFor();
 assert.equal(new URL(page.url()).searchParams.get('view'),'files');assert.equal(new URL(page.url()).searchParams.get('project'),created.id);
 // Community actions are deliberately local, never a shared write.
 await tool('Community examples');
 await page.getByText('Local preview. Threads and reactions stay in this session.',{exact:false}).waitFor();
 const postsBefore=db.projects.length;
 await page.getByLabel('Title',{exact:true}).fill('An example founder question');
 await page.getByLabel('Context',{exact:true}).fill('A synthetic problem to explore together without sharing member data.');
 await page.getByLabel('I understand this is a local preview, not a post shared with other members.',{exact:false}).check();
 await page.getByRole('button',{name:/Add example (problem|response)/}).click();
 await page.getByText('An example founder question',{exact:true}).waitFor();assert.equal(db.projects.length,postsBefore);
 // Return restores the focused workspace; the primary navigation remains unchanged.
 await page.getByRole('button',{name:'Back to My first real project',exact:true}).click();
 await page.getByRole('tab',{name:'Details',exact:true}).click();
 await page.getByText('Project options',{exact:true}).click();await page.getByRole('button',{name:'Open progress loops',exact:true}).click();
 await page.getByRole('heading',{name:'Loops',exact:true}).waitFor();
 assert.equal(new URL(page.url()).searchParams.get('tab'),'details');
 await page.reload({waitUntil:'networkidle'});await page.getByRole('heading',{name:'Loops',exact:true}).waitFor();
 await page.getByRole('button',{name:'Back to My first real project',exact:true}).click();
 await page.getByRole('tab',{name:'Details',exact:true}).waitFor();assert.equal(await page.getByRole('tab',{name:'Details',exact:true}).getAttribute('aria-selected'),'true');
 await page.getByRole('tab',{name:'Conversation',exact:true}).click();
 for(const width of [820,747,390,320]){
  console.log(`Checking responsive tools at ${width}`);
  await page.setViewportSize({width,height:844});await tools();
  const brandBounds=await page.getByRole('button',{name:'Open Spasht home',exact:true}).boundingBox();const toolsBounds=await page.getByRole('button',{name:'Tools',exact:true}).boundingBox();assert.ok(brandBounds.x+brandBounds.width<=toolsBounds.x,`Header controls overlap at ${width}`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const bottom=page.getByRole('navigation',{name:'Primary Spasht navigation',exact:true});assert.ok(await bottom.isVisible()||await page.getByRole('navigation',{name:'Spasht sections',exact:true}).isVisible(),`Primary navigation missing at ${width}`);if(await bottom.isVisible())assert.deepEqual(await bottom.getByRole('button').allTextContents(),['Home','Projects']);
  await page.screenshot({path:`${output}/tools-${width}.png`});
  for(const [label,,visible] of restored){
   await tools();await page.getByRole('button',{name:new RegExp('^'+label)}).click();await visible().waitFor();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow in ${label} at ${width}`);
   assert.equal(await page.locator('.spasht-stage').evaluate(element=>element.scrollWidth>element.clientWidth+1),false,`Clipped content in ${label} at ${width}`);
  }
  await page.getByRole('button',{name:'Back to My first real project',exact:true}).click();
 }
 await page.setViewportSize({width:1440,height:900});
 await page.getByLabel('Account menu').click();await page.getByRole('button',{name:'Account overview',exact:true}).click();await page.getByRole('region',{name:'Profile',exact:true}).waitFor();
 await page.getByLabel('Account menu').click();await page.getByRole('button',{name:'Account & preferences',exact:true}).click();
 await page.getByText('Assistant preferences',{exact:true}).click();await page.getByRole('combobox',{name:'Review rhythm',exact:true}).selectOption('paused');
 await page.getByRole('button',{name:'Save preference',exact:true}).click();await page.getByRole('status').filter({hasText:'Assistant preference saved'}).waitFor();
 assert.equal(db.profiles[0].assistant_settings.digestRhythm,'paused');
 await page.reload({waitUntil:'networkidle'});await page.getByText('Assistant preferences',{exact:true}).click();assert.equal(await page.getByRole('combobox',{name:'Review rhythm',exact:true}).inputValue(),'paused');
 await page.getByRole('button',{name:'Back to My first real project',exact:true}).click();

 // Same two destinations, visible conversation input and no overflow on small screens.
 for(const width of [820,390,320]) {
  await page.setViewportSize({width,height:844});await page.reload({waitUntil:'networkidle'});await page.getByRole('heading',{name:'My first real project',exact:true}).waitFor();
  const mobile=page.getByRole('navigation',{name:'Primary Spasht navigation',exact:true});if(await mobile.isVisible()) assert.deepEqual(await mobile.getByRole('button').allTextContents(),['Home','Projects']);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`${output}/simple-project-${width}.png`});
 }
 await page.getByLabel('Account menu').click();await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('heading',{name:'Make room for your next clear move.',exact:true}).waitFor();assert.ok(!(await page.locator('main').innerText()).includes('My first real project'));
 await page.reload({waitUntil:'networkidle'});assert.ok(!(await page.locator('main').innerText()).includes('My first real project'));
 assert.equal(await page.getByLabel('Username',{exact:true}).count(),0);
 await page.getByLabel('Email',{exact:true}).fill(user.email);await page.getByLabel('Password',{exact:true}).fill('fixture-password');await page.getByRole('button',{name:'Create account',exact:true}).last().click();await page.getByRole('button',{name:'Resend confirmation',exact:true}).waitFor();await page.getByRole('button',{name:'Resend confirmation',exact:true}).click();await page.getByText('If this account needs confirmation, a new link is on its way.').waitFor();
 await page.goto(`${origin}/spasht/?recovery-fixture=1#access_token=${token}&refresh_token=fixture-refresh&expires_in=3600&token_type=bearer&type=recovery`,{waitUntil:'networkidle'});await page.getByLabel('New password',{exact:true}).waitFor();await page.getByLabel('New password',{exact:true}).fill('new-fixture-password');await page.getByRole('button',{name:'Update password',exact:true}).click();await page.getByRole('status').filter({hasText:'Password updated.'}).waitFor();
 assert.deepEqual(errors,[]);
 const report={passed:true,checks:['two primary destinations','canonical project opening','keyboard project tabs','native back and reload','failed saves preserve state','task completion persists','editable project details','memory editing','draft reload','stale draft rejection','one-time approval','failed snapshot blocks provider','archive and restore without data loss','idea to reviewed project','no automatic folders','responsive workspace','sign-out clears private state','email/password signup','confirmation retry','password recovery','all former feature areas reachable','tool URLs reload','five loops and actual project scan','cross-project task updates','explicit folder creation','project organiser URL continuity','local community preview','project-tab return continuity','secondary mobile tools','account overview','saved review preference','palette search and empty state','Escape and focus return','draft survives tool switching','Exit returns to selected project','rapid toggles leave one surface','system light preference','reduced motion'],operations:operations.length};
 await writeFile(`${output}/verification.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
} catch(error) { await page.screenshot({path:`${output}/failure.png`}); throw error; }
finally {await browser.close();}
