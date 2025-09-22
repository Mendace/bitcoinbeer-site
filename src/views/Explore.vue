<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead } from '@vueuse/head'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

useHead({ title: 'Bitcoin Beer — Esplora le community' })

/* ==== ENDPOINTS ==== */
const COMMUNITIES_URL = 'https://api.bitcoinbeer.events/data/communities.json'
const GROUPS_URL      = 'https://api.bitcoinbeer.events/data/group_data.json'
const API_COMMUNITIES = 'https://api.bitcoinbeer.events/api/community_gamification.php'
const API_KEY         = '0215efb408569f4590cc2108cae33689b4901475a994d2ec5be1e59af0fc231a'

/* ==== BADGE (come leaderboard) ==== */
const BADGE = {
  1:'/assets/badges/lv1.png', 2:'/assets/badges/lv2.png', 3:'/assets/badges/lv3.png',
  4:'/assets/badges/lv4.png', 5:'/assets/badges/lv5.png', 6:'/assets/badges/lv6.png'
}

/* ==== STATE ==== */
const loading = ref(true)
const errorMsg = ref('')
const search   = ref('')

let map, markersLayer
const rows = ref([])

/* ==== UTILITIES ==== */
const norm = (s)=> String(s||'').toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/bitcoinbeer|bitcoin/g,'')
  .replace(/[^\p{L}\p{N}\s-]/gu,'')
  .replace(/\s+/g,' ')
  .trim()

const firstCity = (s)=> String(s||'').split(',')[0].trim()
const dicebear  = (seed)=> `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(String(seed||'community'))}`
const lvl = (p)=>{ p=+p||0; if(p>=400)return 5; if(p>=300)return 4; if(p>=200)return 3; if(p>=100)return 2; return 1 }
function esc(s){
  return String(s ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
    .replaceAll("'",'&#39;')
}
function extractCitiesFromGroupName(name){
  const parts = String(name||'').split('-'), arr=[]
  for(const p of parts){
    const cleaned=p.replace(/Bitcoin(?:Beer)?\s*/i,'').trim()
    const city=cleaned.replace(/[^a-zA-ZÀ-ÿ\s]/g,'').trim()
    if(city) arr.push(city)
  }
  return arr
}

/* ==== DATA MERGE (base = communities.json; avatar/nome/punti = leaderboard) ==== */
async function fetchAll(){
  loading.value=true; errorMsg.value=''
  try{
    const [cRes,gRes,lRes] = await Promise.all([
      fetch(COMMUNITIES_URL, { cache:'no-store' }),
      fetch(GROUPS_URL,      { cache:'no-store' }),
      fetch(`${API_COMMUNITIES}?${new URLSearchParams({ action:'communities', limit:'500', api_key:API_KEY })}`, { cache:'no-store' })
    ])
    if(!cRes.ok) throw new Error('Errore communities.json')
    if(!gRes.ok) throw new Error('Errore group_data.json')
    if(!lRes.ok) throw new Error('Errore leaderboard community')

    const [communitiesData, groupsData, leaderboardData] =
      await Promise.all([cRes.json(), gRes.json(), lRes.json()])

    // leaderboard indicizzata su più chiavi
    const lbItems = Array.isArray(leaderboardData?.communities) ? leaderboardData.communities : []
    const idxLB = new Map()
    for(const c of lbItems){
      const keys = new Set([
        norm(c.city),
        norm(firstCity(c.city)),
        norm(c.name),
        norm((c.name||'').split('-')[0])
      ].filter(Boolean))
      keys.forEach(k => { if(!idxLB.has(k)) idxLB.set(k, c) })
    }

    // indicizzazione gruppi per città + per parole chiave nel nome
    const groups = Array.isArray(groupsData?.groups) ? groupsData.groups : []
    const groupsByCity = new Map()
    for(const g of groups){
      const cities = extractCitiesFromGroupName(g.group_name)
      for(const city of cities){
        const k = norm(city)
        const arr = groupsByCity.get(k) || []
        arr.push(g); groupsByCity.set(k, arr)
      }
    }
    // helper: trova gruppi per community con vari fallback
    function findGroupsFor(display, city){
      const keyCity = norm(city)
      const keyName = norm(display)
      const res = new Set()

      ;(groupsByCity.get(keyCity)||[]).forEach(x=>res.add(x))

      // fallback: substring match nel nome gruppo
      for(const g of groups){
        const gn = norm(g.group_name)
        if(gn.includes(keyName) || keyName.includes(gn)) res.add(g)
        if(keyCity && (gn.includes(keyCity) || keyCity.includes(gn))) res.add(g)
      }
      return Array.from(res)
    }

    // BASE = communities.json
    const out = []
    for(const cm of (communitiesData||[])){
      const city     = firstCity(cm.city)
      const keyCity  = norm(city)
      const lat = +cm.latitude, lng = +cm.longitude
      if(!Number.isFinite(lat)||!Number.isFinite(lng)) continue

      const lb = idxLB.get(keyCity) || idxLB.get(norm(cm.city)) || null

      const displayFull = lb?.name || lb?.city || city || 'Community'
      const points = +(lb?.points||0)
      const level  = Number.isFinite(+lb?.level) ? +lb.level : lvl(points)
      const badge  = BADGE[Math.max(1,Math.min(6,level||1))]
      const avatar = (lb?.avatar_url && String(lb.avatar_url).length>0) ? lb.avatar_url : dicebear(displayFull)

      const links = {
        telegram: lb?.telegram || cm.telegram || '',
        instagram: lb?.instagram || cm.instagram || '',
        x:        lb?.x        || cm.x        || '',
        mastodon: lb?.mastodon || cm.mastodon || '',
      }

      out.push({
        id: `community-${lb?.id ?? keyCity}`,
        name: displayFull,
        city: lb?.city || city,
        lat, lng,
        bio: cm.bio || '',
        points, level, badge, avatar, links,
        groups: findGroupsFor(displayFull, city)
      })
    }

    out.sort((a,b)=> (b.points-a.points) || a.name.localeCompare(b.name))
    rows.value = out

    await nextTick()
    drawMarkers()
  }catch(e){ errorMsg.value = e.message || String(e) }
  finally{ loading.value=false }
}

/* ==== MAPPA (box; marker tondo senza bordo) ==== */
function markerHTML(avatarUrl){
  return `
    <div style="width:40px;height:40px;border-radius:999px;overflow:hidden;box-shadow:0 6px 14px rgba(0,0,0,.45)">
      <img src="${avatarUrl}" alt="" style="width:100%;height:100%;object-fit:cover"/>
    </div>`
}
function popupHTML(c){
  const groups = (c.groups&&c.groups.length)
    ? `<div class="pg-title">Gruppo Telegram</div>${c.groups.map(g=>`
        <div class="pg">
          <div class="pg-name">${esc(g.group_name)}</div>
          <div class="pg-stats"><span><i class="fas fa-user-friends"></i> ${g.user_count ?? '—'}</span><span><i class="fas fa-comment-dots"></i> ${g.message_count ?? '—'}</span></div>
          ${Array.isArray(g.administrators)&&g.administrators.length?`<div class="pg-admins"><strong>Admin:</strong> ${g.administrators.map(a=>esc(a.first_name)).join(', ')}</div>`:''}
        </div>`).join('')}`
    : ''
  const socials = `
    <div class="social">
      ${c.links.telegram ? `<a href="${c.links.telegram}" target="_blank" title="Telegram"><i class="fab fa-telegram-plane"></i></a>` : ''}
      ${c.links.instagram ? `<a href="${c.links.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
      ${c.links.x ? `<a href="${c.links.x}" target="_blank" title="X"><i class="fab fa-x-twitter"></i></a>` : ''}
      ${c.links.mastodon ? `<a href="${c.links.mastodon}" target="_blank" title="Mastodon"><i class="fab fa-mastodon"></i></a>` : ''}
    </div>`
  return `
    <div class="bbpop">
      <div class="head">
        <img src="${c.avatar}" class="ava" alt=""/>
        <div>
          <div class="name">${esc(c.name)}</div>
          ${c.bio?`<div class="bio">${esc(c.bio)}</div>`:''}
        </div>
      </div>
      <div class="kpis">
        <div class="k"><div class="kl">Punti</div><div class="kv">${c.points}</div></div>
        <div class="k"><div class="kl">Livello</div><div class="kv">${c.level}</div></div>
        <div class="k k-b"><img src="${c.badge}" alt="badge"/><div class="kl">Badge</div></div>
      </div>
      ${groups}
      ${socials}
    </div>`
}

function drawMarkers(){
  if(!map||!markersLayer) return
  markersLayer.clearLayers()
  for(const c of filtered.value){
    const icon = L.divIcon({ className:'bbm', html:markerHTML(c.avatar), iconSize:[40,40], iconAnchor:[20,20], popupAnchor:[0,-22] })
    const m = L.marker([c.lat,c.lng], { icon })
    m.bindPopup(popupHTML(c), { className:'bbp', maxWidth:360 })
    markersLayer.addLayer(m)
  }
}

async function initMap(){
  map = L.map('map', {
    center:[41.9,12.5], zoom:5,
    layers:[L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{ attribution:'&copy; OpenStreetMap & CARTO', subdomains:'abcd', maxZoom:19 })],
    zoomControl:true
  })
  markersLayer = L.layerGroup().addTo(map)
}

/* ==== LISTA/FILTRO ==== */
const filtered = computed(()=>{
  const q = search.value.trim().toLowerCase()
  if(!q) return rows.value
  return rows.value.filter(c => (c.name||'').toLowerCase().includes(q) || (c.city||'').toLowerCase().includes(q))
})
function go(item){
  if(!map) return
  map.setView([item.lat,item.lng], 11, { animate:true })
  setTimeout(()=> L.popup({ className:'bbp', maxWidth:360 }).setLatLng([item.lat,item.lng]).setContent(popupHTML(item)).openOn(map), 100)
}

/* ==== LIFECYCLE ==== */
onMounted(async ()=>{
  await nextTick()
  await initMap()
  await fetchAll()
})
</script>

<template>
  <!-- SPAZIO per la navbar -->
  <div class="explore-wrap">
    <div class="container">
      <header class="hdr">
        <h1>Esplora le community</h1>
        <div class="search">
          <i class="fas fa-search"></i>
          <input v-model="search" type="search" placeholder="Cerca città o community…" aria-label="Cerca"/>
          <span class="count" :title="`Community mostrate`">{{ filtered.length }}</span>
        </div>
      </header>

      <!-- CARD: desktop = 2 colonne; mobile = lista orizzontale + mappa sotto -->
      <div class="card">
        <aside class="list">
          <div v-if="errorMsg" class="list__info error"><i class="fas fa-triangle-exclamation"></i> {{ errorMsg }}</div>
          <div v-if="loading" class="list__info"><i class="fas fa-spinner fa-spin"></i> Caricamento…</div>

          <button v-for="c in filtered" :key="c.id" class="row" @click="go(c)">
            <img :src="c.avatar" :alt="c.name" class="row__avatar" />
            <div class="row__info">
              <div class="row__name">{{ c.name }}</div>
              <div class="row__meta">
                <img :src="c.badge" alt="badge" class="row__badge"/>
                <span class="row__points">{{ c.points }} pt</span>
                <span class="row__level">Lv {{ c.level }}</span>
              </div>
            </div>
          </button>

          <div v-if="!loading && !filtered.length" class="list__info">Nessuna community</div>
        </aside>

        <main class="mapbox">
          <div id="map" class="map"></div>
        </main>
      </div>
    </div>
  </div>
</template>

<style>
/* ===== Offset NAVBAR ===== */
:root{
  --nav-h: 78px;   /* alza/abbassa se la tua navbar è diversa */
  --page-pad: 16px;
  --header-h: 56px;
}

/* pagina sotto la navbar */
.explore-wrap{
  padding-top: calc(var(--nav-h) + 14px);
  background:#0b0b0b; min-height:100vh; color:#fff;
}
.container{ max-width:1200px; margin:0 auto; padding:var(--page-pad); }

/* Header */
.hdr{
  height: var(--header-h);
  display:flex; align-items:center; justify-content:space-between;
  gap:12px; margin-bottom:12px;
}
.hdr h1{ font-size:1.4rem; font-weight:800; margin:0; }
.search{ display:flex; align-items:center; gap:10px; }
.search input{
  width:min(480px, 70vw); padding:10px 12px; border-radius:10px;
  border:1px solid rgba(255,255,255,.18); background:rgba(255,255,255,.06); color:#fff; outline:none;
}
.count{ font-weight:700; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.16); padding:6px 10px; border-radius:999px; }

/* Card contenitore = ALTEZZA FISSA: lista e mappa uguali */
.card{
  height: calc(100vh - var(--nav-h) - var(--page-pad)*2 - var(--header-h) - 20px);
  min-height: 540px;
  display:grid; grid-template-columns: 340px 1fr; gap:16px;
  background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12);
  border-radius:16px; padding:12px; backdrop-filter: blur(6px);
  box-shadow: 0 18px 40px rgba(0,0,0,.35);
}

/* Scrollbar dark elegante (WebKit) */
.list::-webkit-scrollbar{ width:10px; height:10px; }
.list::-webkit-scrollbar-track{ background:rgba(255,255,255,.04); border-radius:8px; }
.list::-webkit-scrollbar-thumb{
  background:linear-gradient(180deg, rgba(255,255,255,.25), rgba(255,255,255,.15));
  border:2px solid rgba(0,0,0,.25); border-radius:8px;
}
.list{ scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.35) rgba(255,255,255,.08); }

/* Lista */
.list{
  height: 100%;
  overflow:auto;
  border-radius:12px; border:1px solid rgba(255,255,255,.12);
  background:rgba(0,0,0,.4); padding:8px;
}
.row{
  width:100%; text-align:left; display:flex; gap:10px; align-items:center;
  background:rgba(255,255,255,.05); border:1px solid transparent; border-radius:10px;
  padding:8px; color:#fff;
}
.row + .row{ margin-top:8px; }
.row:hover{ border-color:rgba(255,255,255,.2); background:rgba(255,255,255,.08); cursor:pointer; }
.row__avatar{ width:32px; height:32px; border-radius:999px; object-fit:cover; }
.row__info{ flex:1; min-width:0; }
.row__name{ font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.row__meta{ display:flex; align-items:center; gap:10px; margin-top:2px; font-size:.94rem; color:#e8e8e8; }
.row__badge{ width:18px; height:18px; } /* + grande */
.row__points{ opacity:.95; }
.row__level{ color:#ffd166; font-weight:800; }
.list__info{ padding:14px; text-align:center; color:#d1d5db; }
.list__info.error{ color:#fca5a5; }

/* Mappa = riempie tutta la colonna destra */
.mapbox{
  height: 100%;
  border-radius:12px; border:1px solid rgba(255,255,255,.12);
  overflow:hidden; background:rgba(0,0,0,.35);
}
.map{ width:100%; height:100%; }

/* Leaflet popup */
.bbp .leaflet-popup-content-wrapper{ background:rgba(17,17,17,.96); border:1px solid rgba(255,255,255,.12); color:#fff; border-radius:14px; backdrop-filter: blur(8px); }
.bbp .leaflet-popup-tip{ background:rgba(17,17,17,.96); border:1px solid rgba(255,255,255,.12); }
.bbpop{ min-width:260px; display:flex; flex-direction:column; gap:10px; }
.bbpop .head{ display:flex; gap:10px; align-items:center; }
.bbpop .ava{ width:36px; height:36px; border-radius:999px; object-fit:cover; }
.bbpop .name{ font-weight:800; font-size:1.02rem; }
.bbpop .bio{ font-size:.9rem; color:#d1d5db; margin-top:2px; }
.bbpop .kpis{ display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.bbpop .k{ padding:8px; border-radius:10px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); text-align:center; }
.bbpop .kl{ color:#cfcfcf; font-size:0.85rem; text-transform:uppercase; letter-spacing:.06em; }
.bbpop .kv{ font-size:1.05rem; font-weight:800; margin-top:1px; }
.bbpop .k-b { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.bbpop .k-b img{ width:40px; height:40px; margin-bottom: 4px; }
.bbpop .k-b .kl {
  font-size: 0.85rem;
  text-align: center;
}
.pg-title{ font-weight:800; font-size:.92rem; color:#e5e7eb; margin-top:6px; }
.pg{ padding:8px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); margin-top:6px; }
.pg-name{ font-weight:700; margin-bottom:4px; }
.pg-stats{ display:flex; gap:12px; font-size:.9rem; color:#e5e5e5; }
.pg-admins{ margin-top:4px; font-size:.9rem; color:#d1d5db; }
.social{ display:flex; gap:12px; margin-top:6px; }
.social a{ color:#fff; opacity:.9; }
.social a:hover{ color:#ffd166; opacity:1; }

/* ===== MOBILE: lista orizzontale a swipe + mappa sotto ===== */
@media (max-width: 900px){
  .card{
    grid-template-columns: 1fr;
    height: calc(100vh - var(--nav-h) - var(--page-pad)*2 - var(--header-h) - 16px);
    min-height: 520px;
  }
  .list{
    display:flex; gap:10px; padding:10px;
    overflow-x:auto; overflow-y:hidden; height:auto; /* non occupa tutta l'altezza */
    scroll-snap-type: x proximity;
  }
  .row{
    flex: 0 0 85vw; /* card larghe per swipe comodo */
    scroll-snap-align: start;
  }
  .mapbox{
    height: 55vh; /* mappa sempre visibile */
    min-height: 340px;
  }

  /* scrollbar orizzontale chic su mobile */
  .list::-webkit-scrollbar{ height:8px; }
  .list::-webkit-scrollbar-thumb{
    background:linear-gradient(90deg, rgba(255,255,255,.3), rgba(255,255,255,.18));
    border:2px solid rgba(0,0,0,.25); border-radius:8px;
  }
}
</style>
