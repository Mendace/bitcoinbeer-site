<template>
  <div class="mt-24">
    <!-- ↑ mt-24 per stare sotto la navbar -->
    <div class="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-16">
      <!-- ↑ mb-16 per più spazio dalla sezione sotto -->

      <!-- Avatar -->
      <div class="flex justify-center mb-4">
        <img
          :src="profile.avatar || defaultAvatar"
          class="w-28 h-28 rounded-full object-cover border-4"
          :class="levelBorderColor"
        />
      </div>

      <!-- Username + posizione leaderboard -->
      <div class="flex flex-col items-center gap-2 mb-1">
        <h1 class="text-2xl md:text-3xl font-bold text-pink-400 text-center">
          {{ profile.username || 'Utente' }}
        </h1>
        <div v-if="rank !== null && rankTotal !== null" class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-white/10 border border-white/20">
            <span class="opacity-80">Posizione</span>
            <strong class="text-white">#{{ rank }}</strong>
            <span class="opacity-60">su {{ rankTotal }}</span>
          </span>
        </div>
      </div>

      <!-- Membership date -->
      <p class="text-center text-gray-400 text-sm mb-6">
        Membro da {{ formatMonthYear(profile.created_at) }}
      </p>

      <!-- Barra livello + badge grande -->
      <div class="mt-2">
        <div class="flex justify-center items-center gap-3 mb-3">
          <!-- badge immagine UNA SOLA VOLTA, grande, senza ring né bordo -->
          <img
            v-if="badgeUrl"
            :src="badgeUrl"
            alt="badge"
            class="h-12 w-12 object-contain rounded-none select-none"
            loading="lazy"
            decoding="async"
          />
          <span v-else v-html="badgeIcon" class="text-3xl"></span>

          <span class="text-base md:text-lg font-semibold">Livello {{ level }}</span>
        </div>

        <!-- progress bar -->
        <div class="w-full bg-gray-700/90 rounded-full h-3 overflow-hidden">
          <div
            class="h-3 rounded-full transition-all duration-500"
            :style="{
              width: progressPercent + '%',
              background: 'linear-gradient(to right, #4a001f, #b3003c)'
            }"
          />
        </div>

        <p class="text-center text-xs text-gray-400 mt-2">
          {{ totalPoints }} punti ({{ pointsInLevel }}/{{ pointsPerLevel }} per il prossimo livello)
        </p>
      </div>

      <!-- Riconoscimenti (gamification) - opzionale; referral rimosso -->
      <div v-if="gamificationBadges.length" class="mt-5 flex flex-wrap gap-2 justify-center">
        <span v-for="b in gamificationBadges" :key="b.key" class="bb-badge-chip">
          <span v-if="b.key==='explorer'">🧭</span>
          <span v-else-if="b.key==='veteran'">🏅</span>
          <span v-else-if="b.key==='pioneer'">🚩</span>
          <span v-else>🎖️</span>
          <span class="font-medium">{{ b.label }}</span>
        </span>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfile } from '@/composables/useProfile'

const props = defineProps({
  tickets: { type: Array, default: () => [] }
})

const { profile, defaultAvatar, formatMonthYear, gamification } = useProfile()

// Fallback locale per mostrare la posizione anche se il backend non la invia
const API = 'https://api.bitcoinbeer.events/api'
const API_KEY = '0215efb408569f4590cc2108cae33689b4901475a994d2ec5be1e59af0fc231a'
const localRank = ref(null)
const localTotal = ref(null)
const norm = (em) => {
  try {
    const s = String(em || '').trim().toLowerCase()
    const [loc, dom] = s.split('@')
    if (!loc || !dom) return s
    if (dom === 'gmail.com' || dom === 'googlemail.com') {
      const main = loc.split('+')[0].replaceAll('.', '')
      return `${main}@${dom}`
    }
    return `${loc}@${dom}`
  } catch { return String(em || '').toLowerCase() }
}

onMounted(async () => {
  if (gamification?.value?.rank != null && gamification?.value?.total != null) return
  const email = profile.value?.email || ''
  if (!email) return
  try {
    const url = `${API}/gamification.php?action=leaderboard&limit=500&api_key=${API_KEY}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return
    const list = await res.json()
    const target = norm(email)
    const idx = Array.isArray(list) ? list.findIndex(r => norm(r.email) === target) : -1
    if (idx >= 0) { localRank.value = idx + 1; localTotal.value = list.length }
  } catch {}
})

// Rank corrente in leaderboard (preferisci backend; fallback locale)
const rank = computed(() => (gamification?.value?.rank ?? localRank.value))
const rankTotal = computed(() => (gamification?.value?.total ?? localTotal.value))

/* ---- punteggio/level ---- */
const totalPoints    = computed(() => props.tickets.length)
const level          = computed(() => Math.floor(totalPoints.value / 10) + 1)
const pointsPerLevel = 10
const pointsInLevel  = computed(() => totalPoints.value % pointsPerLevel)
const progressPercent= computed(() => (pointsInLevel.value / pointsPerLevel) * 100)

/* ---- badge PNG mappati per livello ---- */
const BADGE_BY_LEVEL = {
  1: '/assets/badges/lv1.png',
  2: '/assets/badges/lv2.png',
  3: '/assets/badges/lv3.png',
  4: '/assets/badges/lv4.png',
  5: '/assets/badges/lv5.png',
  6: '/assets/badges/lv6.png',
}
const badgeUrl = computed(() => BADGE_BY_LEVEL[Math.min(6, Math.max(1, level.value))] || null)
const badgeIcon = computed(() => {
  if (level.value >= 50) return '🏆'
  if (level.value >= 40) return '🐋'
  if (level.value >= 30) return '👨‍💻'
  if (level.value >= 20) return '🦍'
  if (level.value >= 10) return '🧭'
  return '⭐'
})

/* ---- bordo avatar per livello ---- */
const levelBorderColor = computed(() => {
  if (level.value >= 50) return 'border-yellow-500'
  if (level.value >= 40) return 'border-blue-500'
  if (level.value >= 30) return 'border-green-500'
  if (level.value >= 20) return 'border-red-500'
  if (level.value >= 10) return 'border-pink-500'
  return 'border-purple-600'
})

// Gamification safe reads
const gamificationBadges = computed(() => {
  const list = gamification?.value?.badges
  return Array.isArray(list)
    ? list.map(b => ({ key: b.key || b.label || 'badge', label: b.label || 'Badge' }))
    : []
})
// Referral completamente rimosso

</script>

<style scoped>
.bb-badge-chip {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .35rem .6rem;
  border-radius: 9999px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.18);
  font-size: .85rem;
}
/* referral styles rimossi */
</style>
