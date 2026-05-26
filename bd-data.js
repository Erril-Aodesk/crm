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

// ── LEADS CRUD (Supabase) ──
async function getLeads() {
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
  try {
    const data = await sbFetch('bd_leads', 'POST', lead);
    return Array.isArray(data) ? data[0] : data;
  } catch (e) {
    console.error('addLead error:', e.message);
    // localStorage fallback
    const leads = JSON.parse(localStorage.getItem('bd_leads') || '[]');
    lead.id = Date.now();
    leads.unshift(lead);
    localStorage.setItem('bd_leads', JSON.stringify(leads));
    return lead;
  }
}

async function updateLead(id, patch) {
  try {
    const data = await sbFetch(`bd_leads?id=eq.${id}`, 'PATCH', {
      ...patch,
      updated_at: new Date().toISOString()
    });
    return Array.isArray(data) ? data[0] : data;
  } catch (e) {
    console.error('updateLead error:', e.message);
    // localStorage fallback
    const leads = JSON.parse(localStorage.getItem('bd_leads') || '[]');
    const i = leads.findIndex(l => l.id == id);
    if (i > -1) { leads[i] = { ...leads[i], ...patch, updated_at: new Date().toISOString() }; localStorage.setItem('bd_leads', JSON.stringify(leads)); return leads[i]; }
  }
}

async function deleteLead(id) {
  try {
    await sbFetch(`bd_leads?id=eq.${id}`, 'DELETE');
  } catch (e) {
    console.error('deleteLead error:', e.message);
    const leads = JSON.parse(localStorage.getItem('bd_leads') || '[]').filter(l => l.id != id);
    localStorage.setItem('bd_leads', JSON.stringify(leads));
  }
}

async function bulkInsertLeads(leadsArray) {
  try {
    const data = await sbFetch('bd_leads', 'POST', leadsArray);
    return data;
  } catch (e) {
    console.error('bulkInsert error:', e.message);
    // localStorage fallback
    const leads = JSON.parse(localStorage.getItem('bd_leads') || '[]');
    leadsArray.forEach(l => { l.id = Date.now() + Math.random(); leads.unshift(l); });
    localStorage.setItem('bd_leads', JSON.stringify(leads));
    return leadsArray;
  }
}

// ── HELPERS ──
function fmtDate(d, short = false) {
  if (!d) return '—';
  const dt = new Date(d);
  return short
    ? dt.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })
    : dt.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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