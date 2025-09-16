<template>
  <div class="w-full max-w-3xl mx-auto px-4 mt-24">
    <div v-if="showProgress" class="relative bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 mb-10">
      
      <!-- Avatar centered -->
      <div class="flex justify-center mb-4">
        <img
          :src="profile.avatar || defaultAvatar"
          class="w-28 h-28 rounded-full object-cover border-4"
          :class="levelBorderColor"
        />
      </div>

      <!-- Username + Badge -->
      <h1
        class="text-2xl md:text-3xl font-bold text-pink-400 text-center mb-1 flex items-center justify-center gap-2"
      >
        {{ profile.username || 'Utente' }}

        <!-- badge immagine -->
        <img
          v-if="badgeUrl"
          :src="badgeUrl"
          alt="badge"
          class="h-6 w-6 rounded-full object-cover ring-2 ring-white/20"
          loading="lazy"
          decoding="async"
        />
        <!-- fallback emoji -->
        <span v-else v-html="badgeIcon"></span>
      </h1>

      <!-- Membership date -->
      <p class="text-center text-gray-400 text-sm mb-4">
        Membro da {{ formatMonthYear(profile.created_at) }}
      </p>

      <!-- Barra livello -->
      <div class="mt-4">
        <div class="flex justify-center items-center gap-2 mb-2">
          <img
            v-if="badgeUrl"
            :src="badgeUrl"
            alt="badge"
            class="h-6 w-6 rounded-full object-cover ring-2 ring-white/20"
            loading="lazy"
            decoding="async"
          />
          <span v-else v-html="badgeIcon" class="text-2xl"></span>
          <span class="text-base font-semibold">Livello {{ level }}</span>
        </div>

        <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            class="h-3 rounded-full transition-all duration-500"
            :style="{
              width: progressPercent + '%',
              background: 'linear-gradient(to right, #4a001f, #b3003c)'
            }"
          ></div>
        </div>

        <p class="text-center text-xs text-gray-400 mt-1">
          {{ totalPoints }} punti ({{ pointsInLevel }}/{{ pointsPerLevel }} per il prossimo livello)
        </p>
      </div>
    </div>

    <!-- Riconoscimenti (gamification) -->
    <div v-if="specialBadges.length" class="mt-4 flex flex-wrap gap-2 justify-center">
      <span v-for="b in specialBadges" :key="b.key" class="badge-chip">
        <span v-if="b.key==='explorer'">🧭</span>
        <span v-else-if="b.key==='veteran'">🏅</span>
        <span v-else-if="b.key==='pioneer'">🚩</span>
        <span v-else>🎖️</span>
        <span class="font-medium">{{ b.label }}</span>
      </span>
    </div>

    <!-- Referral rimosso -->
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProfile } from '@/composables/useProfile'

const props = defineProps({
  tickets: { type: Array, default: () => [] },
  showProgress: { type: Boolean, default: false }
})

const { profile, defaultAvatar, formatMonthYear, gamification, loadProfile, loadGamification } = useProfile()

// punti = numero ticket
const totalPoints = computed(() => props.tickets.length)

// livello: 1 al primo ticket, poi +1 ogni 10 ticket
const level = computed(() => Math.floor(totalPoints.value / 10) + 1)
const pointsPerLevel = 10
const pointsInLevel = computed(() => totalPoints.value % pointsPerLevel)
const progressPercent = computed(() => (pointsInLevel.value / pointsPerLevel) * 100)

// mappa livello corrente → PNG esistenti in public/assets/badges
const BADGE_BY_LEVEL = {
  1: '/assets/badges/lv1.png',
  2: '/assets/badges/lv2.png',
  3: '/assets/badges/lv3.png',
  4: '/assets/badges/lv4.png',
  5: '/assets/badges/lv5.png',
  6: '/assets/badges/lv6.png',
}

// scegli il badge in base al livello corrente (ogni 10 ticket)
const badgeUrl = computed(() => BADGE_BY_LEVEL[Math.min(6, Math.max(1, level.value))] || null)

// fallback emoji se manca jpg
const badgeIcon = computed(() => {
  if (level.value >= 50) return '🏆'
  if (level.value >= 40) return '🐋'
  if (level.value >= 30) return '👨‍💻'
  if (level.value >= 20) return '🦍'
  if (level.value >= 10) return '🧭'
  return '⭐'
})

// colori cerchio avatar in base al livello
const levelBorderColor = computed(() => {
  if (level.value >= 50) return 'border-yellow-500'
  if (level.value >= 40) return 'border-blue-500'
  if (level.value >= 30) return 'border-green-500'
  if (level.value >= 20) return 'border-red-500'
  if (level.value >= 10) return 'border-pink-500'
  return 'border-purple-600'
})

// Special badges from gamification (Explorer, Veteran, Pioneer)
const specialBadges = computed(() => {
  const list = (gamification.value && Array.isArray(gamification.value.badges)) ? gamification.value.badges : []
  return list.map(b => ({
    key: b.key || 'badge',
    label: b.label || 'Badge',
    desc: b.desc || '',
    cities: Array.isArray(b.cities) ? b.cities : []
  }))
})

// Referral box
const referral = computed(() => (gamification.value && gamification.value.referral) ? gamification.value.referral : {})
const referralCode = computed(() => referral.value.code || '')
const referralInvites = computed(() => Number(referral.value.invites || 0))
const referralLink = computed(() => {
  const raw = referral.value.share_url || ''
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  try {
    return (window?.location?.origin || '') + raw
  } catch {
    return raw
  }
})

async function copyReferral() {
  const toCopy = referralLink.value || referralCode.value
  if (!toCopy) return
  try { await navigator.clipboard.writeText(toCopy) } catch {}
}

onMounted(() => {
  // assicura che il profilo sia caricato (che a sua volta carica la gamification)
  loadProfile?.()
})

function retryGamification() {
  const email = (profile.value?.email || '').trim()
  if (email && typeof loadGamification === 'function') {
    loadGamification(email)
  } else {
    loadProfile?.()
  }
}
</script>

<style scoped>
.badge-chip {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .35rem .6rem;
  border-radius: 9999px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.18);
  font-size: .85rem;
}
.referral-card {
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: .75rem;
  padding: .75rem 1rem;
}
.referral-btn {
  border: 1px solid rgba(255,255,255,.25);
  border-radius: .5rem;
  padding: .35rem .6rem;
}
</style>
