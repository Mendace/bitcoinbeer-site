<template>
  <!-- Navbar fissa -->
  <nav
    class="fixed inset-x-0 top-0 z-50 bg-black/60 backdrop-blur-md text-white transition-all px-4 sm:px-6"
    :class="isScrolled ? 'py-2' : 'py-6'"
  >
    <div class="max-w-screen-xl mx-auto flex items-center justify-between">
      <!-- Sinistra: Logo e menu desktop -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center space-x-3">
          <img src="/logos/marker.webp" class="h-8 w-auto" alt="Logo BitcoinBeer" />
        </router-link>
        <div class="h-6 w-px bg-white/60 mx-4" />
        <ul class="hidden md:flex items-center space-x-6">
          <li v-for="link in links" :key="link.to">
            <router-link :to="link.to" class="hover:underline text-white" :class="{ 'font-semibold': isActive(link.to) }">
              {{ $t(link.labelKey) }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Destra: lingua desktop, avatar/login, hamburger mobile -->
      <div class="flex items-center space-x-4">
        <!-- Lingua desktop -->
        <select
          v-model="$i18n.locale"
          class="hidden md:block bg-transparent border border-white rounded px-2 py-1 focus:outline-none text-white"
        >
          <option value="it">IT</option>
          <option value="en">EN</option>
        </select>

        <!-- Avatar / Login -->
        <div class="relative">
          <!-- Se loggati -->
          <button v-if="isLogged" @click="toggleDropdown" class="p-1 focus:outline-none">
            <img :src="profile.avatar || defaultAvatar" class="h-8 w-8 rounded-full ring-2 ring-white/10" alt="Avatar" />
          </button>

          <!-- Se non loggati -->
          <router-link
            v-else
            to="/login"
            class="p-2 text-white hover:text-orange-500 transition-colors"
          >
            <i class="fas fa-user text-xl" />
          </router-link>

          <!-- Dropdown profilo: burgundy metal -->
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl overflow-hidden bb-burgundy-panel z-50"
          >
            <!-- header utente -->
            <div class="px-4 py-4 flex items-center gap-3">
              <img :src="profile.avatar || defaultAvatar" class="h-12 w-12 rounded-full object-cover ring-2 ring-white/10" />
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-semibold truncate">{{ profile.username || 'Utente' }}</span>
                  <!-- badge (PNG) -->
                  <img
                    v-if="badgeUrl"
                    :src="badgeUrl"
                    alt="badge"
                    class="h-6 w-6 object-contain select-none"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div class="text-xs text-gray-300/90">
                  Livello <span class="font-medium">{{ level }}</span>
                </div>
              </div>
            </div>

            <div class="h-px bg-white/10"></div>

            <!-- Link -->
            <ul class="py-2 text-sm">
              <li>
                <router-link
                  to="/CompleteProfile"
                  class="block px-4 py-2 hover:bg-white/10"
                  @click="closeDropdown"
                >
                  {{ $t('auth.profile') }}
                </router-link>
              </li>
              <li>
                <button
                  @click="logout"
                  class="w-full text-left block px-4 py-2 hover:bg-white/10"
                >
                  {{ $t('auth.signOut') }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Hamburger mobile -->
        <button @click="toggleMobileMenu" class="md:hidden p-2 border border-white rounded">
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile menu -->
  <transition name="fade">
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md space-y-6 px-4">
      <router-link
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        @click="closeMobileMenu"
        class="text-2xl text-white hover:underline"
      >
        {{ $t(link.labelKey) }}
      </router-link>

      <!-- Cambio lingua mobile -->
      <div class="flex space-x-4 mt-4">
        <button @click="$i18n.locale = 'it'; closeMobileMenu()" class="text-white hover:underline">IT</button>
        <button @click="$i18n.locale = 'en'; closeMobileMenu()" class="text-white hover:underline">EN</button>
      </div>

      <button @click="closeMobileMenu" class="mt-4 text-white border border-white rounded px-4 py-2">X</button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProfile } from '@/composables/useProfile'

const { t } = useI18n()
const { profile, defaultAvatar, loadProfile, token } = useProfile()
const isLogged = computed(() => !!profile.value?.id)

// links
const links = [
  { to: '/', labelKey: 'navigation.home' },
  { to: '/start', labelKey: 'navigation.start' },
  { to: '/explore', labelKey: 'navigation.explore' },
  { to: '/all-events', labelKey: 'navigation.calendar' },
  { to: '/leaderboard', labelKey: 'navigation.leaderboard' },
  { to: '/newsletter', labelKey: 'navigation.newsletter' }
]

/* ====== livello + badge ====== */
const API_TICKETS = 'https://api.bitcoinbeer.events/api/user_tickets.php'
const ticketsCount = ref(0)

async function refreshTicketsCount() {
  if (!token.value) return
  try {
    const res = await fetch(API_TICKETS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.value })
    })
    const json = await res.json()
    if (json?.success) ticketsCount.value = (json.data?.tickets || []).length
  } catch (e) {
    // silenzioso
  }
}

const level = computed(() => Math.floor(ticketsCount.value / 10) + 1)

// Badge per livello corrente (ogni 10 ticket)
const BADGE_BY_LEVEL = {
  1: '/assets/badges/lv1.png',
  2: '/assets/badges/lv2.png',
  3: '/assets/badges/lv3.png',
  4: '/assets/badges/lv4.png',
  5: '/assets/badges/lv5.png',
  6: '/assets/badges/lv6.png',
}
const badgeUrl = computed(() => BADGE_BY_LEVEL[Math.min(6, Math.max(1, level.value))] || null)

/* ====== dropdown / auth ====== */
const showDropdown = ref(false)
function toggleDropdown() {
  if (token.value && !profile.value?.id) loadProfile()
  if (token.value && ticketsCount.value === 0) refreshTicketsCount()
  showDropdown.value = !showDropdown.value
}
function closeDropdown() { showDropdown.value = false }

const router = useRouter()
function logout() {
  localStorage.removeItem('user_token')
  token.value = ''
  showDropdown.value = false
  router.push('/')
}

/* ====== mobile menu ====== */
const mobileMenuOpen = ref(false)
function toggleMobileMenu() { mobileMenuOpen.value = !mobileMenuOpen.value }
function closeMobileMenu() { mobileMenuOpen.value = false }

/* ====== helpers ====== */
const route = useRoute()
function isActive(path) { return route.path === path }

/* ====== navbar shrink ====== */
const isScrolled = ref(false)
function onScroll() { isScrolled.value = window.scrollY > 10 }
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  if (isLogged.value) {
    loadProfile()
    refreshTicketsCount()
  }
  // Soft refresh: quando torni alla tab o la pagina torna visibile
  window.addEventListener('focus', refreshTicketsCount)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshTicketsCount()
  })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('focus', refreshTicketsCount)
  document.removeEventListener('visibilitychange', () => {})
})

// Soft refresh: al cambio rotta (es. ritorno da pagamento su una route del sito)
watch(() => route.fullPath, () => {
  if (isLogged.value) refreshTicketsCount()
})
</script>

<style scoped>
/* transizione overlay mobile */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* pannello burgundy “metallico” */
.bb-burgundy-panel {
  color: #f5f5f7;
  background:
    radial-gradient(120% 120% at 10% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%),
    linear-gradient(135deg, #300016 0%, #5a0026 40%, #0b0b0d 100%);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    0 10px 30px rgba(0,0,0,0.45);
}
</style>
