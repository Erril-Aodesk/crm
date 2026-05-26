// bd-data.js — AODesk BD Portal v3

const SUPABASE_URL = 'https://ioizmqqujnypodawlmag.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvaXptcXF1am55cG9kYXdsbWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjU2NjQsImV4cCI6MjA5NTMwMTY2NH0.Uyp-D9LalhWs2J4vesZbEKsIQCDCWKWI9BKD9Zck_No';

// ── CONSTANTS ──
const PIPELINE_STAGES = ['Appointment Set','Meeting Done','Proposal Sent','Negotiation','Closed Won','Closed Lost'];
const STAGE_META = {
  'Appointment Set': {icon:'📅', color:'#1D4ED8', bg:'#DBEAFE'},
  'Meeting Done':    {icon:'✅', color:'#0F766E', bg:'#CCFBF1'},
  'Proposal Sent':   {icon:'📄', color:'#B45309', bg:'#FEF3C7'},
  'Negotiation':     {icon:'🤝', color:'#C2410C', bg:'#FFEDD5'},
  'Closed Won':      {icon:'🎉', color:'#15803D', bg:'#DCFCE7'},
  'Closed Lost':     {icon:'❌', color:'#BE123C', bg:'#FFE4E6'},
};
const CALL_OUTCOMES = ['Interested','Not Interested','Callback','No Answer','Wrong Number'];
const SOURCES = ['Referral','Cold Outreach','LinkedIn','Website Inquiry','Event / Expo','Database','Other'];
const INDUSTRIES = ['Finance & Accounting','Legal','Real Estate','Technology','Healthcare','Retail','Construction','Insurance','Education','Other'];
const MEETING_TYPES = ['Zoom','Phone','F2F'];

// ── DEMO DATA ──
const DEMO_LEADGEN = [
  {id:1,  company:'Nexgen Finance',      contact:'Mark Williams', email:'mark@nexgen.com.au',      phone:'+61 412 000 111', industry:'Finance & Accounting', source:'LinkedIn',       country:'Australia', notes:'CFO contact',          call_outcome:null,           call_notes:'',                    callback_date:null,              appointed:false, created_at:'2026-05-20T09:00:00Z'},
  {id:2,  company:'BlueSky Accounting',  contact:'Sarah Chen',    email:'sarah@bluesky.com.au',    phone:'+61 421 000 222', industry:'Finance & Accounting', source:'Cold Outreach',  country:'Australia', notes:'Owns 3 branches',      call_outcome:'Interested',   call_notes:'Needs 2 bookkeepers', callback_date:null,              appointed:true,  created_at:'2026-05-20T10:00:00Z'},
  {id:3,  company:'Pacific Realty',      contact:'Tom Hughes',    email:'tom@pacificrealty.com.au',phone:'+61 432 000 333', industry:'Real Estate',          source:'Database',       country:'Australia', notes:'Property mgmt firm',   call_outcome:'Callback',     call_notes:'Call back Thu 2pm',   callback_date:'2026-05-29T14:00:00+10:00', appointed:false, created_at:'2026-05-21T11:00:00Z'},
  {id:4,  company:'Ironclad Legal',      contact:'Priya Nair',    email:'priya@ironclad.com.au',   phone:'+61 445 000 444', industry:'Legal',                source:'LinkedIn',       country:'Australia', notes:'50-person firm',       call_outcome:'Interested',   call_notes:'Wants 3 paralegals',  callback_date:null,              appointed:true,  created_at:'2026-05-21T08:00:00Z'},
  {id:5,  company:'MedCore Health',      contact:'James Reilly',  email:'james@medcore.com.au',    phone:'+61 478 000 777', industry:'Healthcare',           source:'Cold Outreach',  country:'Australia', notes:'Medical admin needs',  call_outcome:'No Answer',    call_notes:'Try again Monday',    callback_date:'2026-06-02T09:00:00+10:00', appointed:false, created_at:'2026-05-22T09:00:00Z'},
  {id:6,  company:'TechNova Solutions',  contact:'Amy Park',      email:'amy@technova.com.au',     phone:'+61 489 000 888', industry:'Technology',           source:'LinkedIn',       country:'Australia', notes:'Startup 30 staff',     call_outcome:'Interested',   call_notes:'CEO very keen',       callback_date:null,              appointed:true,  created_at:'2026-05-22T10:00:00Z'},
  {id:7,  company:'Summit Insurance',    contact:'Claire Foster', email:'claire@summit.com.au',    phone:'+61 467 000 666', industry:'Insurance',            source:'Database',       country:'Australia', notes:'4 VA budget approved', call_outcome:'Callback',     call_notes:'Send info pack first',callback_date:'2026-05-30T10:00:00+10:00', appointed:false, created_at:'2026-05-22T10:00:00Z'},
  {id:8,  company:'Harbour Retail',      contact:'Lisa Wong',     email:'lisa@harbourretail.com.au',phone:'+61 400 111 222',industry:'Retail',               source:'Cold Outreach',  country:'Australia', notes:'5 store locations',    call_outcome:'Not Interested',call_notes:'Happy with current setup',callback_date:null,           appointed:false, created_at:'2026-05-23T09:00:00Z'},
  {id:9,  company:'Coastal Builders',    contact:'Dave Nguyen',   email:'dave@coastalbuild.com.au',phone:'+61 456 000 555', industry:'Construction',         source:'Referral',       country:'Australia', notes:'Referred by Tom H',    call_outcome:null,           call_notes:'',                    callback_date:null,              appointed:false, created_at:'2026-05-23T10:00:00Z'},
  {id:10, company:'Greenfield Education',contact:'Robert Tan',    email:'robert@greenfield.edu.au',phone:'+61 490 000 999', industry:'Education',            source:'Database',       country:'Australia', notes:'Private school group',  call_outcome:'No Answer',    call_notes:'Left voicemail',      callback_date:'2026-05-28T11:00:00+10:00', appointed:false, created_at:'2026-05-23T11:00:00Z'},
];

const DEMO_PIPELINE = [
  {id:101, leadgen_id:2,  company:'BlueSky Accounting', contact:'Sarah Chen',    email:'sarah@bluesky.com.au',    phone:'+61 421 000 222', industry:'Finance & Accounting', stage:'Appointment Set', valid:null,   meeting_type:'Zoom', meeting_date:'2026-05-27T10:00:00+10:00', zoom_link:'https://zoom.us/j/123456789', notes:'Needs 2 bookkeepers', bdm_notes:'Prefers mornings', created_by:'bdm@aodesk.com.au', created_at:'2026-05-22T10:00:00Z'},
  {id:102, leadgen_id:4,  company:'Ironclad Legal',     contact:'Priya Nair',    email:'priya@ironclad.com.au',   phone:'+61 445 000 444', industry:'Legal',                stage:'Appointment Set', valid:null,   meeting_type:'F2F',  meeting_date:'2026-05-29T09:00:00+10:00', zoom_link:null,                          notes:'3 paralegals needed', bdm_notes:'Decision maker is Priya', created_by:'bdm@aodesk.com.au', created_at:'2026-05-23T09:00:00Z'},
  {id:103, leadgen_id:6,  company:'TechNova Solutions', contact:'Amy Park',      email:'amy@technova.com.au',     phone:'+61 489 000 888', industry:'Technology',           stage:'Meeting Done',    valid:true,  meeting_type:'Zoom', meeting_date:'2026-05-26T09:00:00+10:00', zoom_link:'https://zoom.us/j/111222333', notes:'Dev support + 1 VA',  bdm_notes:'CEO very keen', created_by:'bdm@aodesk.com.au', created_at:'2026-05-23T10:00:00Z'},
  {id:104, leadgen_id:null,company:'Harbour Retail',   contact:'Lisa Wong',     email:'lisa@harbourretail.com.au',phone:'+61 400 111 222', industry:'Retail',               stage:'Proposal Sent',   valid:true,  meeting_type:'F2F',  meeting_date:'2026-05-28T13:00:00+10:00', zoom_link:null,                          notes:'5 VAs across 3 stores',bdm_notes:'Big account', created_by:'bdm@aodesk.com.au', created_at:'2026-05-24T09:00:00Z'},
];

// ── DEMO mode helpers ──
function isDemo(){ return sessionStorage.getItem('bd_token')==='demo_token'; }

function _lsGet(key, fallback){ try{ const r=localStorage.getItem(key); return r?JSON.parse(r):JSON.parse(JSON.stringify(fallback)); }catch(e){ return JSON.parse(JSON.stringify(fallback)); } }
function _lsSet(key,val){ localStorage.setItem(key,JSON.stringify(val)); }

// ── SUPABASE HELPER ──
async function sbFetch(path, method='GET', body=null){
  const token = sessionStorage.getItem('bd_token');
  const headers = { 'apikey':SUPABASE_KEY, 'Authorization':`Bearer ${token||SUPABASE_KEY}`, 'Content-Type':'application/json' };
  if(method==='POST'||method==='PATCH') headers['Prefer']='return=representation';
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{ method, headers, body:body?JSON.stringify(body):null });
  if(!res.ok){ const e=await res.json().catch(()=>({})); throw new Error(e.message||`Supabase ${res.status}`); }
  const txt=await res.text(); return txt?JSON.parse(txt):null;
}

// ── LEADGEN CRUD ──
async function getLeadgen(){
  if(isDemo()) return _lsGet('bd_leadgen', DEMO_LEADGEN);
  try{ return await sbFetch('bd_leadgen?select=*&order=created_at.desc')||[]; }
  catch(e){ console.warn(e.message); return _lsGet('bd_leadgen',DEMO_LEADGEN); }
}
async function addLeadgen(data){
  if(isDemo()){ const list=_lsGet('bd_leadgen',DEMO_LEADGEN); data.id=Date.now(); list.unshift(data); _lsSet('bd_leadgen',list); return data; }
  try{ const r=await sbFetch('bd_leadgen','POST',data); return Array.isArray(r)?r[0]:r; }
  catch(e){ console.error(e.message); const list=_lsGet('bd_leadgen',DEMO_LEADGEN); data.id=Date.now(); list.unshift(data); _lsSet('bd_leadgen',list); return data; }
}
async function updateLeadgen(id,patch){
  patch.updated_at=new Date().toISOString();
  if(isDemo()){ const list=_lsGet('bd_leadgen',DEMO_LEADGEN); const i=list.findIndex(l=>l.id==id); if(i>-1){list[i]={...list[i],...patch};_lsSet('bd_leadgen',list);return list[i];} return null; }
  try{ const r=await sbFetch(`bd_leadgen?id=eq.${id}`,'PATCH',patch); return Array.isArray(r)?r[0]:r; }
  catch(e){ console.error(e.message); }
}
async function deleteLeadgen(id){
  if(isDemo()){ const list=_lsGet('bd_leadgen',DEMO_LEADGEN).filter(l=>l.id!=id); _lsSet('bd_leadgen',list); return; }
  try{ await sbFetch(`bd_leadgen?id=eq.${id}`,'DELETE'); } catch(e){ console.error(e.message); }
}
async function bulkInsertLeadgen(rows){
  if(isDemo()){ const list=_lsGet('bd_leadgen',DEMO_LEADGEN); rows.forEach(r=>{r.id=Date.now()+Math.random();list.unshift(r);}); _lsSet('bd_leadgen',list); return rows; }
  try{ return await sbFetch('bd_leadgen','POST',rows); } catch(e){ console.error(e.message); }
}

// ── PIPELINE CRUD ──
async function getPipeline(){
  if(isDemo()) return _lsGet('bd_pipeline', DEMO_PIPELINE);
  try{ return await sbFetch('bd_pipeline?select=*&order=created_at.desc')||[]; }
  catch(e){ console.warn(e.message); return _lsGet('bd_pipeline',DEMO_PIPELINE); }
}
async function addPipeline(data){
  if(isDemo()){ const list=_lsGet('bd_pipeline',DEMO_PIPELINE); data.id=Date.now(); list.unshift(data); _lsSet('bd_pipeline',list); return data; }
  try{ const r=await sbFetch('bd_pipeline','POST',data); return Array.isArray(r)?r[0]:r; }
  catch(e){ console.error(e.message); const list=_lsGet('bd_pipeline',DEMO_PIPELINE); data.id=Date.now(); list.unshift(data); _lsSet('bd_pipeline',list); return data; }
}
async function updatePipeline(id,patch){
  patch.updated_at=new Date().toISOString();
  if(isDemo()){ const list=_lsGet('bd_pipeline',DEMO_PIPELINE); const i=list.findIndex(l=>l.id==id); if(i>-1){list[i]={...list[i],...patch};_lsSet('bd_pipeline',list);return list[i];} return null; }
  try{ const r=await sbFetch(`bd_pipeline?id=eq.${id}`,'PATCH',patch); return Array.isArray(r)?r[0]:r; }
  catch(e){ console.error(e.message); }
}
async function deletePipeline(id){
  if(isDemo()){ const list=_lsGet('bd_pipeline',DEMO_PIPELINE).filter(l=>l.id!=id); _lsSet('bd_pipeline',list); return; }
  try{ await sbFetch(`bd_pipeline?id=eq.${id}`,'DELETE'); } catch(e){ console.error(e.message); }
}

// ── HELPERS ──
function localDateStr(d){ if(!d)return ''; const dt=new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`; }
function fmtDate(d,short=false){ if(!d)return '—'; const dt=new Date(d); return short?dt.toLocaleDateString('en-AU',{day:'2-digit',month:'short'}):dt.toLocaleDateString('en-AU',{day:'2-digit',month:'short',year:'numeric'}); }
function fmtDateTime(d){ if(!d)return '—'; return new Date(d).toLocaleString('en-AU',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
function fmtTime(d){ if(!d)return ''; return new Date(d).toLocaleTimeString('en-AU',{hour:'2-digit',minute:'2-digit',hour12:true}); }
function stageBadge(stage){ const m=STAGE_META[stage]||{icon:'•',color:'#666',bg:'#eee'}; return `<span class="stage-badge" style="background:${m.bg};color:${m.color}">${m.icon} ${stage}</span>`; }
function outcomeBadge(o){ const c={Interested:'#15803D',Callback:'#B45309','Not Interested':'#BE123C','No Answer':'#6B7280','Wrong Number':'#6B7280'}; const bg={Interested:'#DCFCE7',Callback:'#FEF3C7','Not Interested':'#FFE4E6','No Answer':'#F3F4F6','Wrong Number':'#F3F4F6'}; return o?`<span class="stage-badge" style="background:${bg[o]||'#eee'};color:${c[o]||'#666'}">${o}</span>`:'<span style="font-size:12px;color:#9CA3AF">Not called</span>'; }
function mtIcon(t){ return t==='Zoom'?'🎥':t==='Phone'?'📞':t==='F2F'?'🤝':'—'; }
function authGuard(allowed){ const role=sessionStorage.getItem('bd_role'); if(!role){window.location.href='bd-login.html';return null;} if(allowed&&!allowed.includes(role)){window.location.href='bd-login.html';return null;} return role; }
function getUser(){ return JSON.parse(sessionStorage.getItem('bd_user')||'{}'); }
function logout(){ sessionStorage.clear(); window.location.href='bd-login.html'; }
function showToast(msg,type='success'){ const t=document.getElementById('toast'); if(!t)return; t.textContent=msg; t.className='toast show'+(type==='error'?' toast-err':''); clearTimeout(t._to); t._to=setTimeout(()=>t.classList.remove('show'),3200); }
function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }
function showLoading(msg='Loading...'){ let el=document.getElementById('gLoader'); if(!el){el=document.createElement('div');el.id='gLoader';el.style.cssText='position:fixed;inset:0;background:rgba(8,15,38,.55);backdrop-filter:blur(3px);z-index:9999;display:flex;align-items:center;justify-content:center;';el.innerHTML=`<div style="background:white;border-radius:14px;padding:22px 32px;text-align:center;font-family:DM Sans,sans-serif;"><div style="font-size:26px;margin-bottom:8px">⏳</div><div style="font-size:13px;color:#7B8DB0" id="gLoaderMsg">${msg}</div></div>`;document.body.appendChild(el);}else{document.getElementById('gLoaderMsg').textContent=msg;el.style.display='flex';} }
function hideLoading(){ const el=document.getElementById('gLoader'); if(el)el.style.display='none'; }

// ── SHARED CSS VARS (injected once) ──
const _css = `
:root{--navy:#080F26;--blue:#2352E8;--sky:#3B82F6;--gold:#EFA500;--teal:#0F766E;--white:#fff;--light:#EEF3FF;--muted:#7B8DB0;--bg:#F2F5FF;--card:#fff;--border:#E0E8F8;--text:#111827;}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);display:flex;min-height:100vh;}
.sidebar{width:232px;background:var(--navy);position:fixed;top:0;left:0;bottom:0;display:flex;flex-direction:column;z-index:100;overflow-y:auto;}
.sl{padding:22px 18px 14px;border-bottom:1px solid rgba(255,255,255,.06);}
.sl-mark{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:17px;color:white;margin-bottom:8px;}
.sl-name{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:white;}
.sl-role{font-size:10px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.07em;}
nav{flex:1;padding:12px 10px;}
.ng{font-size:9px;color:rgba(255,255,255,.2);letter-spacing:.1em;text-transform:uppercase;padding:12px 10px 4px;}
.ni{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:9px;color:rgba(255,255,255,.5);font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;text-decoration:none;}
.ni:hover{background:rgba(255,255,255,.06);color:white;}
.ni.active{color:white;}
.ni .ico{font-size:15px;width:20px;text-align:center;}
.sf{padding:14px 18px;border-top:1px solid rgba(255,255,255,.06);}
.uc{display:flex;align-items:center;gap:10px;}
.av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:700;font-size:12px;color:white;flex-shrink:0;}
.un{font-size:13px;color:white;font-weight:500;}
.ur{font-size:10px;color:rgba(255,255,255,.3);}
.lob{background:none;border:none;color:rgba(255,255,255,.25);cursor:pointer;font-size:15px;margin-left:auto;padding:4px;}
.lob:hover{color:rgba(255,255,255,.7);}
.main{margin-left:232px;flex:1;display:flex;flex-direction:column;}
.topbar{background:white;border-bottom:1px solid var(--border);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
.pt{font-family:'Syne',sans-serif;font-weight:700;font-size:17px;}
.btn{padding:8px 16px;border-radius:9px;font-size:13px;font-weight:500;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:6px;transition:all .15s;font-family:'DM Sans',sans-serif;}
.bp{background:var(--blue);color:white;box-shadow:0 2px 8px rgba(35,82,232,.3);}
.bp:hover{background:#1a41d6;}
.bo{background:white;color:var(--text);border:1.5px solid var(--border);}
.bo:hover{border-color:var(--blue);color:var(--blue);}
.bg{background:var(--gold);color:white;}
.bg:hover{background:#d49200;}
.bt{background:var(--teal);color:white;}
.bt:hover{background:#0b5e57;}
.bsm{padding:6px 12px;font-size:12px;}
.brd{background:#dc2626;color:white;}
.brd:hover{background:#b91c1c;}
.content{padding:22px 24px;flex:1;}
.sg{display:grid;gap:14px;margin-bottom:22px;}
.sc{background:white;border-radius:13px;padding:18px;border:1px solid var(--border);}
.sl2{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;}
.sv{font-family:'Syne',sans-serif;font-weight:800;font-size:26px;}
.tcard{background:white;border-radius:14px;border:1px solid var(--border);overflow:hidden;margin-bottom:20px;}
.thead2{padding:14px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:8px;}
.tc-title{font-family:'Syne',sans-serif;font-weight:700;font-size:15px;}
.tcontrols{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.srch{background:var(--light);border:1.5px solid var(--border);border-radius:9px;padding:7px 12px;font-size:13px;outline:none;width:190px;font-family:'DM Sans',sans-serif;}
.srch:focus{border-color:var(--blue);}
select.flt{background:var(--light);border:1.5px solid var(--border);border-radius:9px;padding:7px 10px;font-size:12px;outline:none;font-family:'DM Sans',sans-serif;cursor:pointer;}
table{width:100%;border-collapse:collapse;}
th{background:var(--light);padding:10px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;}
td{padding:11px 14px;font-size:13px;border-bottom:1px solid var(--border);vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:#FAFBFF;}
.stage-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap;}
.act-btn{padding:5px 10px;border-radius:7px;font-size:11px;font-weight:500;cursor:pointer;border:1.5px solid var(--border);background:white;color:var(--text);transition:all .15s;margin-right:3px;white-space:nowrap;}
.act-btn:hover{border-color:var(--blue);color:var(--blue);}
.act-btn.grn{border-color:#6EE7B7;color:#059669;}
.act-btn.grn:hover{background:#059669;color:white;border-color:#059669;}
.act-btn.red{border-color:#FCA5A5;color:#dc2626;}
.act-btn.red:hover{background:#dc2626;color:white;border-color:#dc2626;}
.act-btn.gold{border-color:#FCD34D;color:#B45309;}
.no-data{text-align:center;padding:40px;color:var(--muted);font-size:13px;}
.pg{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-top:1px solid var(--border);}
.pg-info{font-size:12px;color:var(--muted);}
.pg-btns{display:flex;gap:5px;}
.pg-btn{width:30px;height:30px;border-radius:7px;border:1.5px solid var(--border);background:white;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.pg-btn:hover,.pg-btn.cur{background:var(--blue);color:white;border-color:var(--blue);}
.ov{display:none;position:fixed;inset:0;background:rgba(8,15,38,.65);backdrop-filter:blur(4px);z-index:200;align-items:center;justify-content:center;}
.ov.show{display:flex;}
.modal{background:white;border-radius:18px;padding:30px;width:540px;max-width:95vw;max-height:90vh;overflow-y:auto;animation:mup .3s cubic-bezier(.16,1,.3,1);box-shadow:0 32px 64px rgba(0,0,0,.2);}
@keyframes mup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.mh{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.mt2{font-family:'Syne',sans-serif;font-weight:700;font-size:18px;}
.mx{background:none;border:none;font-size:24px;cursor:pointer;color:var(--muted);line-height:1;padding:0;}
.mx:hover{color:var(--text);}
.ms2{font-size:13px;color:var(--muted);margin-bottom:20px;}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.f{margin-bottom:0;}
.ff{grid-column:1/-1;}
label{display:block;font-size:11px;font-weight:600;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em;}
input,select,textarea{width:100%;background:var(--light);border:1.5px solid var(--border);border-radius:9px;padding:10px 13px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color .2s;}
input:focus,select:focus,textarea:focus{border-color:var(--blue);}
textarea{resize:vertical;min-height:75px;}
.ma{display:flex;gap:8px;justify-content:flex-end;margin-top:18px;}
.sep{height:1px;background:var(--border);margin:16px 0;}
.dl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;}
.dv{font-size:14px;font-weight:500;line-height:1.5;}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
.toast{position:fixed;bottom:22px;right:22px;background:var(--navy);color:white;padding:11px 18px;border-radius:11px;font-size:13px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:999;opacity:0;transform:translateY(8px);transition:all .3s;pointer-events:none;}
.toast.show{opacity:1;transform:translateY(0);}
.toast.toast-err{background:#7F1D1D;}
.import-zone{border:2px dashed var(--border);border-radius:11px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:14px;}
.import-zone:hover,.import-zone.drag{border-color:var(--blue);background:var(--light);}
.badge-pending{background:#FEF3C7;color:#B45309;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600;}
.badge-valid{background:#DCFCE7;color:#15803D;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600;}
.badge-invalid{background:#FFE4E6;color:#BE123C;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600;}
`;
if(!document.getElementById('_shared_css')){ const s=document.createElement('style');s.id='_shared_css';s.textContent=_css;document.head.appendChild(s); }