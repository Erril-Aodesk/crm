// bd-data.js — AODesk BD Portal | Supabase-connected

// ── CONFIG ──
const SUPABASE_URL = 'https://ioizmqqujnypodawlmag.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvaXptcXF1am55cG9kYXdsbWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjU2NjQsImV4cCI6MjA5NTMwMTY2NH0.Uyp-D9LalhWs2J4vesZbEKsIQCDCWKWI9BKD9Zck_No';

// ── CONSTANTS ──
const STAGES = ['New Lead','Appointment Set','Meeting Done','Proposal Sent','Negotiation','Closed Won','Closed Lost'];
const STAGE_META = {
  'New Lead':        {cls:'s-new',  icon:'🌱', color:'#4338CA', bg:'#EEF2FF'},
  'Appointment Set': {cls:'s-appt', icon:'📅', color:'#1D4ED8', bg:'#DBEAFE'},
  'Meeting Done':    {cls:'s-meet', icon:'✅', color:'#0F766E', bg:'#CCFBF1'},
  'Proposal Sent':   {cls:'s-prop', icon:'📄', color:'#B45309', bg:'#FEF3C7'},
  'Negotiation':     {cls:'s-neg',  icon:'🤝', color:'#C2410C', bg:'#FFEDD5'},
  'Closed Won':      {cls:'s-won',  icon:'🎉', color:'#15803D', bg:'#DCFCE7'},
  'Closed Lost':     {cls:'s-lost', icon:'❌', color:'#BE123C', bg:'#FFE4E6'},
};
const CONFIRMED_STAGES = ['Appointment Set','Meeting Done','Proposal Sent','Negotiation','Closed Won'];
const SOURCES     = ['Referral','Cold Outreach','LinkedIn','Website Inquiry','Event / Expo','Other'];
const MEETING_TYPES = ['Zoom','Phone','F2F'];
const INDUSTRIES  = ['Finance & Accounting','Legal','Real Estate','Technology','Healthcare','Retail','Construction','Insurance','Education','Other'];

// ── DEMO LEADS (dates set to May/June 2026) ──
const DEMO_LEADS = [
  {id:1,  company:'Nexgen Finance Group',    contact:'Mark Williams', email:'mark@nexgen.com.au',      phone:'+61 412 000 111', source:'Referral',       industry:'Finance & Accounting', stage:'New Lead',        meeting_type:null,   meeting_date:null,                        notes:'Interested in 2 VA roles.',           zoom_link:null, created_by:'it@aodesk.com.au',  created_at:'2026-05-01T09:00:00Z', updated_at:'2026-05-01T09:00:00Z', bdm_notes:''},
  {id:2,  company:'BlueSky Accounting',      contact:'Sarah Chen',    email:'sarah@bluesky.com.au',    phone:'+61 421 000 222', source:'LinkedIn',        industry:'Finance & Accounting', stage:'Appointment Set', meeting_type:'Zoom',  meeting_date:'2026-05-27T10:00:00+10:00', notes:'Needs bookkeeper + admin.',           zoom_link:'https://zoom.us/j/123456789', created_by:'bdm@aodesk.com.au', created_at:'2026-05-05T10:00:00Z', updated_at:'2026-05-18T10:00:00Z', bdm_notes:'Prefers morning slots.'},
  {id:3,  company:'Pacific Realty Partners', contact:'Tom Hughes',    email:'tom@pacificrealty.com.au',phone:'+61 432 000 333', source:'Cold Outreach',   industry:'Real Estate',          stage:'Meeting Done',    meeting_type:'Zoom',  meeting_date:'2026-05-28T14:00:00+10:00', notes:'Needs 1 admin + 1 property mgmt VA.',zoom_link:'https://zoom.us/j/987654321', created_by:'it@aodesk.com.au',  created_at:'2026-05-08T11:00:00Z', updated_at:'2026-05-28T14:00:00Z', bdm_notes:'Very positive.'},
  {id:4,  company:'Ironclad Legal',          contact:'Priya Nair',    email:'priya@ironclad.com.au',   phone:'+61 445 000 444', source:'Website Inquiry', industry:'Legal',                stage:'Proposal Sent',   meeting_type:'F2F',   meeting_date:'2026-05-29T09:00:00+10:00', notes:'Proposal for 3 paralegals sent.',     zoom_link:null, created_by:'it@aodesk.com.au',  created_at:'2026-05-10T08:00:00Z', updated_at:'2026-05-29T09:00:00Z', bdm_notes:'Follow up Friday.'},
  {id:5,  company:'Coastal Builders',        contact:'Dave Nguyen',   email:'dave@coastalbuild.com.au',phone:'+61 456 000 555', source:'Referral',        industry:'Construction',         stage:'Closed Won',      meeting_type:'Zoom',  meeting_date:'2026-05-26T11:00:00+10:00', notes:'Signed 3-month agreement.',           zoom_link:null, created_by:'bdm@aodesk.com.au', created_at:'2026-05-12T09:00:00Z', updated_at:'2026-05-26T11:00:00Z', bdm_notes:'Great client.'},
  {id:6,  company:'Summit Insurance',        contact:'Claire Foster', email:'claire@summit.com.au',    phone:'+61 467 000 666', source:'Event / Expo',    industry:'Insurance',            stage:'Negotiation',     meeting_type:'Phone', meeting_date:'2026-05-27T15:00:00+10:00', notes:'Discussing pricing for 4 VAs.',       zoom_link:null, created_by:'it@aodesk.com.au',  created_at:'2026-05-14T10:00:00Z', updated_at:'2026-05-27T15:00:00Z', bdm_notes:'Price sensitive.'},
  {id:7,  company:'MedCore Health',          contact:'James Reilly',  email:'james@medcore.com.au',    phone:'+61 478 000 777', source:'Referral',        industry:'Healthcare',           stage:'New Lead',        meeting_type:null,   meeting_date:null,                        notes:'Looking for 3 medical admin VAs.',    zoom_link:null, created_by:'it@aodesk.com.au',  created_at:'2026-05-15T09:00:00Z', updated_at:'2026-05-15T09:00:00Z', bdm_notes:''},
  {id:8,  company:'TechNova Solutions',      contact:'Amy Park',      email:'amy@technova.com.au',     phone:'+61 489 000 888', source:'LinkedIn',        industry:'Technology',           stage:'Appointment Set', meeting_type:'Zoom',  meeting_date:'2026-05-28T09:00:00+10:00', notes:'Needs dev support + 1 VA.',           zoom_link:'https://zoom.us/j/111222333', created_by:'bdm@aodesk.com.au', created_at:'2026-05-16T10:00:00Z', updated_at:'2026-05-28T10:00:00Z', bdm_notes:'Tech-savvy client.'},
  {id:9,  company:'Greenfield Education',    contact:'Robert Tan',    email:'robert@greenfield.edu.au',phone:'+61 490 000 999', source:'Cold Outreach',   industry:'Education',            stage:'Closed Lost',     meeting_type:'Phone', meeting_date:'2026-05-22T10:00:00+10:00', notes:'Budget constraints. May revisit Q3.', zoom_link:null, created_by:'it@aodesk.com.au',  created_at:'2026-05-17T09:00:00Z', updated_at:'2026-05-22T09:00:00Z', bdm_notes:'Keep warm.'},
  {id:10, company:'Harbour Retail Group',    contact:'Lisa Wong',     email:'lisa@harbourretail.com.au',phone:'+61 400 111 222',source:'Referral',        industry:'Retail',               stage:'Meeting Done',    meeting_type:'F2F',   meeting_date:'2026-05-29T13:00:00+10:00', notes:'Interested in 5 VAs across 3 stores.',zoom_link:null, created_by:'bdm@aodesk.com.au', created_at:'2026-05-18T09:00:00Z', updated_at:'2026-05-29T13:00:00Z', bdm_notes:'Big account potential.'},
];

// ── SUPABASE API HELPER ──
async function sbFetch(path, method = 'GET', body = null, extra = {}) {
  const token = sessionStorage.getItem('bd_token');
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${token || SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...extra
  };
  if (method === 'POST') headers['Prefer'] = 'return=representation';
  if (method === 'PATCH') headers['Prefer'] = 'return=representation';

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Supabase error: ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── AUTH ──
async function sbLogin(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Login failed');
  return data;
}

// ── LEADS CRUD (Supabase with demo fallback) ──
async function getLeads() {
  // Demo mode — use localStorage with pre-loaded demo data
  if(sessionStorage.getItem('bd_token') === 'demo_token') {
    const raw = localStorage.getItem('bd_leads');
    // Always reload fresh demo data if nothing stored yet
    if(!raw) {
      const fresh = JSON.parse(JSON.stringify(DEMO_LEADS));
      localStorage.setItem('bd_leads', JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(raw);
  }
  try {
    const data = await sbFetch('bd_leads?select=*&order=created_at.desc');
    return data || [];
  } catch (e) {
    console.warn('Supabase fetch failed, using localStorage fallback:', e.message);
    const raw = localStorage.getItem('bd_leads');
    return raw ? JSON.parse(raw) : [];
  }
}

async function addLead(lead) {
  if(sessionStorage.getItem('bd_token') === 'demo_token') {
    const leads = JSON.parse(localStorage.getItem('bd_leads')||'[]');
    lead.id = Date.now(); leads.unshift(lead);
    localStorage.setItem('bd_leads', JSON.stringify(leads)); return lead;
  }
  try {
    const data = await sbFetch('bd_leads', 'POST', lead);
    return Array.isArray(data) ? data[0] : data;
  } catch (e) {
    console.error('addLead error:', e.message);
    const leads = JSON.parse(localStorage.getItem('bd_leads') || '[]');
    lead.id = Date.now(); leads.unshift(lead);
    localStorage.setItem('bd_leads', JSON.stringify(leads)); return lead;
  }
}

async function updateLead(id, patch) {
  if(sessionStorage.getItem('bd_token') === 'demo_token') {
    const leads = JSON.parse(localStorage.getItem('bd_leads')||'[]');
    const i = leads.findIndex(l=>l.id==id);
    if(i>-1){leads[i]={...leads[i],...patch,updated_at:new Date().toISOString()};localStorage.setItem('bd_leads',JSON.stringify(leads));return leads[i];}
    return null;
  }
  try {
    const data = await sbFetch(`bd_leads?id=eq.${id}`, 'PATCH', { ...patch, updated_at: new Date().toISOString() });
    return Array.isArray(data) ? data[0] : data;
  } catch (e) {
    console.error('updateLead error:', e.message);
    const leads = JSON.parse(localStorage.getItem('bd_leads') || '[]');
    const i = leads.findIndex(l => l.id == id);
    if (i > -1) { leads[i] = { ...leads[i], ...patch, updated_at: new Date().toISOString() }; localStorage.setItem('bd_leads', JSON.stringify(leads)); return leads[i]; }
  }
}

async function deleteLead(id) {
  if(sessionStorage.getItem('bd_token') === 'demo_token') {
    const leads = JSON.parse(localStorage.getItem('bd_leads')||'[]').filter(l=>l.id!=id);
    localStorage.setItem('bd_leads', JSON.stringify(leads)); return;
  }
  try {
    await sbFetch(`bd_leads?id=eq.${id}`, 'DELETE');
  } catch (e) {
    console.error('deleteLead error:', e.message);
    const leads = JSON.parse(localStorage.getItem('bd_leads') || '[]').filter(l => l.id != id);
    localStorage.setItem('bd_leads', JSON.stringify(leads));
  }
}

async function bulkInsertLeads(leadsArray) {
  if(sessionStorage.getItem('bd_token') === 'demo_token') {
    const leads = JSON.parse(localStorage.getItem('bd_leads')||'[]');
    leadsArray.forEach(l=>{l.id=Date.now()+Math.random();leads.unshift(l);});
    localStorage.setItem('bd_leads',JSON.stringify(leads)); return leadsArray;
  }
  try {
    const data = await sbFetch('bd_leads', 'POST', leadsArray);
    return data;
  } catch (e) {
    console.error('bulkInsert error:', e.message);
    const leads = JSON.parse(localStorage.getItem('bd_leads') || '[]');
    leadsArray.forEach(l => { l.id = Date.now() + Math.random(); leads.unshift(l); });
    localStorage.setItem('bd_leads', JSON.stringify(leads)); return leadsArray;
  }
}

// ── HELPERS ──
function fmtDate(d, short = false) {
  if (!d) return '—';
  // Parse and display in local timezone to avoid UTC date shift
  const dt = new Date(d);
  return short
    ? dt.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
    : dt.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}
function fmtDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
}
function stageBadge(stage) {
  const m = STAGE_META[stage] || { icon: '•', color: '#666', bg: '#eee' };
  return `<span class="stage-badge" style="background:${m.bg};color:${m.color}">${m.icon} ${stage}</span>`;
}
function mtIcon(t) { return t === 'Zoom' ? '🎥' : t === 'Phone' ? '📞' : t === 'F2F' ? '🤝' : '—'; }
function initials(name) { return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }

function authGuard(allowed) {
  const role = sessionStorage.getItem('bd_role');
  if (!role) { window.location.href = 'bd-login.html'; return null; }
  if (allowed && !allowed.includes(role)) { window.location.href = 'bd-login.html'; return null; }
  return role;
}
function getUser() { return JSON.parse(sessionStorage.getItem('bd_user') || '{}'); }
function logout() { sessionStorage.clear(); window.location.href = 'bd-login.html'; }

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + (type === 'error' ? 'toast-err' : '');
  clearTimeout(t._to);
  t._to = setTimeout(() => t.classList.remove('show'), 3200);
}
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

// ── LOADING SPINNER ──
function showLoading(msg = 'Loading...') {
  let el = document.getElementById('globalLoader');
  if (!el) {
    el = document.createElement('div');
    el.id = 'globalLoader';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(8,15,38,.5);backdrop-filter:blur(3px);z-index:9999;display:flex;align-items:center;justify-content:center;';
    el.innerHTML = `<div style="background:white;border-radius:14px;padding:24px 32px;text-align:center;font-family:DM Sans,sans-serif;">
      <div style="font-size:28px;margin-bottom:8px">⏳</div>
      <div style="font-size:14px;color:#7B8DB0" id="loaderMsg">${msg}</div>
    </div>`;
    document.body.appendChild(el);
  } else {
    document.getElementById('loaderMsg').textContent = msg;
    el.style.display = 'flex';
  }
}
function hideLoading() {
  const el = document.getElementById('globalLoader');
  if (el) el.style.display = 'none';
}