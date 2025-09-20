<template>
  <section class="min-h-screen pt-28 pb-16 bg-gradient-to-b from-black via-zinc-900 to-black text-white">
    <div class="max-w-5xl mx-auto px-4">
      <header class="mb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">{{ modeTitle }}</h1>
        <p class="text-gray-300 mt-2">{{ modeSubtitle }}</p>
      </header>

      <div class="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm">
        <button
          v-for="opt in modes"
          :key="opt.key"
          @click="setMode(opt.key)"
          :class="[
            'px-4 py-1.5 rounded-full border transition',
            mode===opt.key ? 'border-white bg-white/15 text-white' : 'border-white/20 text-white/70 hover:border-white/40'
          ]"
        >{{ opt.label }}</button>
      </div>

      <div v-if="topThree.length" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          v-for="(u,idx) in topThree"
          :key="u.key"
          class="relative rounded-2xl p-5 text-center bg-white/5 border border-white/10 backdrop-blur-md shadow-xl transition"
          :class="u.isMe ? 'border-amber-400 ring-2 ring-amber-300/70 shadow-[0_0_25px_rgba(251,191,36,0.45)]' : ''"
        >
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">
            <span v-if="idx===0">🥇</span><span v-else-if="idx===1">🥈</span><span v-else>🥉</span>
          </div>
          <img :src="u.avatar" :alt="u.displayMasked" class="w-16 h-16 rounded-full mx-auto ring-2 ring-white/20 mb-3" />
          <div
            class="font-semibold truncate cursor-pointer"
            :class="u.isMe ? 'text-amber-400' : ''"
            :title="u.isMe ? u.displayFull : u.displayMasked"
            @mouseenter="onHoverName(u)"
            @mouseleave="onLeaveName(u)"
            @click="openDetails(u)"
          >
            {{ revealKey === u.key ? u.displayFull : u.displayMasked }}
          </div>
          <div class="text-sm text-gray-400">{{ u.points }} {{ mode.value === 'communities' ? 'punti' : 'punti' }}</div>
          <div class="flex items-center justify-center gap-2 mt-3">
            <img :src="u.badge" alt="badge" class="h-8 w-8" />
            <span class="text-sm">Livello {{ u.level }}</span>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <div class="grid grid-cols-12 px-4 py-2 text-xs uppercase tracking-wide text-gray-400 border-b border-white/10">
          <div class="col-span-1">#</div>
          <div class="col-span-6 md:col-span-7">{{ columnLabel }}</div>
          <div class="col-span-2 text-right">{{ pointsLabel }}</div>
          <div class="col-span-3 md:col-span-2 text-right">Livello</div>
        </div>
        <div
          v-for="(u,idx) in rest"
          :key="u.key"
          class="grid grid-cols-12 items-center px-4 py-3 border-b border-white/5 hover:bg-white/5 transition"
          :class="u.isMe ? 'border border-amber-400/70 bg-amber-100/5 shadow-[0_0_18px_rgba(251,191,36,0.25)] relative z-10' : ''"
        >
          <div class="col-span-1 text-sm text-gray-400">{{ idx + 4 }}</div>
          <div class="col-span-6 md:col-span-7 flex items-center gap-3 min-w-0">
            <img :src="u.avatar" :alt="u.displayMasked" class="w-8 h-8 rounded-full ring-2 ring-white/10" />
            <span
              class="truncate cursor-pointer"
              :class="u.isMe ? 'text-amber-400 font-semibold' : ''"
              :title="u.isMe ? u.displayFull : u.displayMasked"
              @mouseenter="onHoverName(u)"
              @mouseleave="onLeaveName(u)"
              @click="openDetails(u)"
            >{{ revealKey === u.key ? u.displayFull : u.displayMasked }}</span>
          </div>
          <div class="col-span-2 text-right font-semibold">{{ u.points }}</div>
          <div class="col-span-3 md:col-span-2 text-right flex items-center justify-end gap-2">
            <img :src="u.badge" alt="badge" class="h-6 w-6" />
            <span class="text-sm">{{ u.level }}</span>
          </div>
        </div>
        <div v-if="!loading && !users.length" class="p-6 text-center text-gray-400">Nessun dato</div>
        <div v-if="loading" class="p-6 text-center text-gray-400">Caricamento…</div>
        <div v-if="error" class="p-4 text-center text-red-300">{{ error }}</div>
      </div>
    </div>
  </section>

  <div v-if="toast" class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-amber-200 px-3 py-2 rounded-lg text-sm shadow-lg z-50">
    {{ toast }}
  </div>

  <div v-if="selectedUser" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" @click.self="closeDetails">
    <div class="max-w-md w-full rounded-2xl border border-white/10 bg-zinc-900 text-white shadow-2xl overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h3 class="text-lg font-semibold">{{ selectedUser.type === 'community' ? 'Dettagli community' : 'Dettagli giocatore' }}</h3>
        <button class="text-white/70 hover:text-white" @click="closeDetails"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="px-5 py-6 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <img :src="selectedUser.avatar" :alt="selectedUser.displayFull" class="w-12 h-12 rounded-full ring-2 ring-white/10" />
          <div>
            <div class="text-sm text-gray-400 uppercase tracking-wide">{{ selectedUser.type === 'community' ? 'Community' : 'Nome' }}</div>
            <div class="text-lg font-semibold">{{ (selectedUser.isMe || selectedUser.type === 'community') ? selectedUser.displayFull : selectedUser.displayMasked }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <template v-if="selectedUser.type === 'user'">
            <div v-if="selectedUser.isMe && selectedUser.username" class="rounded-xl border border-white/10 bg-white/5 p-3">
              <div class="text-xs uppercase text-gray-400">Username</div>
              <div class="text-sm font-semibold mt-1">{{ selectedUser.username }}</div>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <div class="text-xs uppercase text-gray-400">Livello</div>
              <div class="text-lg font-bold text-amber-300 mt-1">{{ selectedUser.level }}</div>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/5 p-3 col-span-2">
              <div class="text-xs uppercase text-gray-400">Punti</div>
              <div class="text-sm font-semibold mt-1">{{ selectedUser.points }}</div>
            </div>
          </template>
          <template v-else>
            <div class="rounded-xl border border-white/10 bg-white/5 p-3 col-span-2">
              <div class="text-xs uppercase text-gray-400">Punti (ticket)</div>
              <div class="text-lg font-semibold mt-1">{{ selectedUser.points }}</div>
            </div>
          </template>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
          <img :src="selectedUser.badge" alt="badge" class="h-10 w-10" />
          <div>
            <div class="text-xs uppercase text-gray-400">{{ selectedUser.type === 'community' ? 'Badge community' : 'Badge' }}</div>
            <div class="text-sm font-semibold">Livello {{ selectedUser.level }}</div>
          </div>
        </div>
        <div v-if="selectedUser.type === 'community' && selectedUser.links" class="flex flex-wrap gap-3 pt-2">
          <a v-for="(url, key) in selectedUser.links" :key="key" v-if="url" :href="url" target="_blank" rel="noopener" class="text-sm text-amber-300 hover:text-amber-200 underline">{{ key }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProfile } from '@/composables/useProfile'

const API_USERS = 'https://api.bitcoinbeer.events/api/gamification.php'
const API_COMMUNITIES = 'https://api.bitcoinbeer.events/api/community_gamification.php'
const API_KEY = '0215efb408569f4590cc2108cae33689b4901475a994d2ec5be1e59af0fc231a'

const modes = [
  { key: 'users', label: 'Leaderboard utenti' },
  { key: 'communities', label: 'Leaderboard community' }
]
const mode = ref('users')

const loading = ref(false)
const error = ref('')
const users = ref([])
const { profile } = useProfile()
const revealKey = ref(null)
const toast = ref('')
let toastTimer
const selectedUser = ref(null)

const BADGE_BY_LEVEL = { 1:'/assets/badges/lv1.png', 2:'/assets/badges/lv2.png', 3:'/assets/badges/lv3.png', 4:'/assets/badges/lv4.png', 5:'/assets/badges/lv5.png', 6:'/assets/badges/lv6.png' }

function levelFromUser(p){ p=+p||0; if(p>=40)return 5; if(p>=30)return 4; if(p>=20)return 3; if(p>=10)return 2; if(p>=1)return 1; return 0; }
function levelFromCommunity(p){ p=+p||0; if(p>=400)return 5; if(p>=300)return 4; if(p>=200)return 3; if(p>=100)return 2; return 1; }

function displayFor(row, me){
  const email=row.email||''; let base=row.display_name||row.name||row.username||(email.split('@')[0]||'guest')
  if(me && normEmail(email)===normEmail(me.email) && me.username) base=me.username
  return base
}
function maskName(v){ const n=String(v??''); if(!n.length) return ''; if(n.length<=7) return '*'.repeat(n.length); const vis=n.slice(0,n.length-7); return vis+'*'.repeat(7) }
function normEmail(em){ try{const s=String(em||'').trim().toLowerCase(); const [loc,dom]=s.split('@'); if(!loc||!dom) return s; if(dom==='gmail.com'||dom==='googlemail.com'){return `${loc.split('+')[0].replaceAll('.','')}@${dom}`} return `${loc}@${dom}`}catch{return String(em||'').toLowerCase()} }
function avatarFor(row){ const seed = displayFor(row) || row.city || 'community'; return `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(seed)}` }

const modeTitle = computed(()=> mode.value==='users' ? 'Leaderboard utenti' : 'Leaderboard community')
const modeSubtitle = computed(()=> mode.value==='users' ? 'Classifica livelli e punti (con moltiplicatori)' : 'Punti community = 1 per ticket (senza moltiplicatori)')
const columnLabel = computed(()=> mode.value==='users' ? 'Utente' : 'Community')
const pointsLabel = computed(()=> 'Punti')
const topThree = computed(()=> users.value.slice(0,3))
const rest = computed(()=> users.value.slice(3))

function setMode(key){ if(mode.value===key) return; mode.value=key; revealKey.value=null; selectedUser.value=null; load() }

async function load(){
  loading.value=true; error.value=''
  try { if (mode.value==='users') await loadUsers(); else await loadCommunities(); }
  catch(e){ error.value=e.message||String(e) }
  finally { loading.value=false }
}

async function loadUsers(){
  const params=new URLSearchParams({ action:'leaderboard', limit:'500', api_key:API_KEY })
  const meEmail=(profile?.value?.email||'').trim(); if(meEmail) params.set('include_email', meEmail)
  const res=await fetch(`${API_USERS}?${params.toString()}`,{cache:'no-store'})
  if(!res.ok) throw new Error('Errore caricamento leaderboard utenti')
  const data=await res.json(); const list=Array.isArray(data)?data:[]
  const me=profile?.value||null
  const mapped=list.map((r,idx)=>{
    const email=r.email||''; const displayFull=displayFor(r,me); const level=Math.max(0,Math.min(6, Number(r.level ?? levelFromUser(r.points))||0))
    return {
      key:`${email}-${idx}`, type:'user', email, username:r.username||'',
      displayFull, displayMasked:maskName(displayFull),
      points:Number(r.points||0), level,
      badge:BADGE_BY_LEVEL[Math.max(1,Math.min(6,level||1))],
      avatar:avatarFor({...r,display_name:displayFull}),
      isMe: !!(me && normEmail(email)===normEmail(me.email)),
      links:null
    }
  })
  mapped.sort((a,b)=> (b.points-a.points) || a.displayFull.localeCompare(b.displayFull))
  users.value=mapped; revealKey.value=null
}

async function loadCommunities(){
  const params=new URLSearchParams({ action:'communities', limit:'500', api_key:API_KEY })
  const res=await fetch(`${API_COMMUNITIES}?${params.toString()}`,{cache:'no-store'})
  if(!res.ok) throw new Error(`Errore API community: ${res.status} ${res.statusText}`)
  const data=await res.json(); const items=Array.isArray(data.communities)?data.communities:[]
  const list=items.map((c)=>{
    const id=c.id; const displayFull=c.name||c.city||`Community ${id}`
    const points=Number(c.points||0); const level=Number.isFinite(+c.level)?+c.level:levelFromCommunity(points)
    const avatar = c.avatar_url && String(c.avatar_url).length>0 ? c.avatar_url : avatarFor({display_name:displayFull})
    return {
      key:`community-${id}`, type:'community', communityId:id, email:'', username:'',
      displayFull, displayMasked:displayFull, points, level,
      badge:BADGE_BY_LEVEL[Math.max(1,Math.min(6,level||1))],
      avatar, isMe:false,
      links:{ telegram:c.telegram||'', instagram:c.instagram||'', x:c.x||'', mastodon:c.mastodon||'' }
    }
  })
  list.sort((a,b)=> (b.points-a.points) || a.displayFull.localeCompare(b.displayFull))
  users.value=list; revealKey.value=null
}

function onHoverName(user){ if(!user?.isMe) return; revealKey.value=user.key; toast.value='Nome completo visibile solo a te'; clearTimeout(toastTimer) }
function onLeaveName(user){ if(!user?.isMe) return; revealKey.value=null; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{toast.value=''},1400) }
function openDetails(user){ selectedUser.value={...user} }
function closeDetails(){ selectedUser.value=null }

onMounted(load)
onUnmounted(()=> clearTimeout(toastTimer))
</script>

<style scoped>
</style>
