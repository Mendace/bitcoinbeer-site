<!-- src/components/NavbarMega.vue -->
<template>
  <!-- NAVBAR SEMPRE NERA -->
  <nav
    class="fixed inset-x-0 top-0 z-50 bg-black text-white border-b border-white/5"
    :class="isScrolled ? 'py-2' : 'py-3'"
    role="navigation"
    aria-label="Main"
  >
    <div class="mx-auto max-w-screen-2xl px-4 sm:px-6">
      <div class="flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3">
          <img src="/logos/marker.webp" class="h-8 w-auto" alt="BitcoinBeer" />
          <span class="hidden sm:block text-sm font-medium tracking-wide text-white/85">Bitcoin Beer</span>
        </router-link>

        <div class="flex items-center gap-3">
          <button
            v-if="isLogged"
            @click="openMenu"
            class="hidden sm:block focus:outline-none"
            aria-label="Open account menu"
          >
            <img :src="profile.avatar || defaultAvatar" class="h-8 w-8 rounded-full ring-2 ring-white/10 object-cover" alt="Avatar" />
          </button>

          <button
            @click="openMenu"
            class="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 hover:bg-white/10 active:scale-[0.98] transition"
            :aria-expanded="menuOpen ? 'true' : 'false'"
            aria-controls="bb-megamenu"
            aria-label="Open menu"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-width="2" d="M4 7h16M4 12h16M10 17h10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- spacer -->
  <div style="height:64px"></div>

  <!-- OVERLAY -->
  <transition name="bb-fade">
    <div v-if="menuOpen" id="bb-megamenu" class="fixed inset-0 z-[60] flex" @keydown.esc.prevent.stop="closeMenu">
      <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="closeMenu" />

      <div
        class="relative mx-auto my-auto w-[min(1080px,92vw)] md:max-h-[88vh] overflow-hidden md:rounded-2xl md:border md:border-white/10 md:bg-[#0a0a0b]
               h-[100vh] md:h-auto bg-[#0a0a0b] border-0 rounded-none flex flex-col"
        role="dialog" aria-modal="true"
      >
        <div class="flex-1 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-12">
            <!-- SINISTRA -->
            <div class="md:col-span-7 p-5 sm:p-7">
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-base sm:text-lg font-semibold tracking-wide text-white">{{ t('navigation.menu') }}</h2>
                <button @click="closeMenu" class="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-white hover:bg-white/10" aria-label="Close menu">✕</button>
              </div>

              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <li v-for="item in bigLinks" :key="item.to">
                  <router-link
                    :to="item.to"
                    @click="closeMenu"
                    class="group block rounded-xl border border-white/10 bg-[#111214] p-4 hover:bg-[#15161a] transition"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-base font-semibold text-white">{{ item.label }}</span>
                      <i class="fas fa-arrow-right text-white/40 group-hover:translate-x-1 transition"></i>
                    </div>
                    <p class="mt-1 text-sm text-white/70">{{ item.desc }}</p>
                  </router-link>
                </li>
              </ul>

              <div class="mt-5 flex flex-wrap items-center gap-3">
                <!-- LANG -->
                <div class="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111214] px-2 py-1">
                  <span class="text-xs text-white/60">Lang</span>
                  <button @click="setLang('it')" class="text-xs px-2 py-1 rounded hover:bg-white/10 text-white" :class="locale === 'it' ? 'bg-white/10' : ''">IT</button>
                  <button @click="setLang('en')" class="text-xs px-2 py-1 rounded hover:bg-white/10 text-white" :class="locale === 'en' ? 'bg-white/10' : ''">EN</button>
                </div>

                <!-- LOGIN / PROFILO -->
                <router-link v-if="!isLogged" to="/login" @click="closeMenu" class="text-sm rounded-lg border border-white/10 bg-[#111214] px-3 py-1.5 hover:bg-[#15161a] text-white">
                  {{ t('auth.signIn') }}
                </router-link>

                <router-link v-else to="/CompleteProfile" @click="closeMenu" class="flex items-center gap-2 text-sm rounded-lg border border-white/10 bg-[#111214] px-3 py-1.5 hover:bg-[#15161a] text-white">
                  <img :src="profile.avatar || defaultAvatar" class="h-6 w-6 rounded-full object-cover" alt="">
                  <span class="truncate max-w-[12ch]">{{ profile.username || t('auth.user') }}</span>
                  <img v-if="badgeUrl" :src="badgeUrl" class="h-5 w-5" alt="badge" />
                  <span class="text-white/60">Lv {{ level }}</span>
                </router-link>

                <button v-if="isLogged" @click="performLogout" class="text-sm rounded-lg border border-white/10 bg-[#111214] px-3 py-1.5 hover:bg-[#15161a] text-white">
                  {{ t('auth.signOut') }}
                </button>
              </div>
            </div>

            <!-- DESTRA -->
            <div class="md:col-span-5 relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent">
              <div class="relative p-6 sm:p-7 h-full flex flex-col">
                <div class="flex items-center gap-3">
                  <img src="/logos/marker.webp" class="h-8 w-auto" alt="BB" />
                  <h3 class="text-base font-semibold text-white">Bitcoin Beer</h3>
                </div>

                <p class="mt-2 text-sm text-white/80">
                  {{ t('navigation.tagline') }}
                </p>

                <!-- CTA Newsletter -->
                <div class="mt-4">
                  <router-link
                    to="/newsletter"
                    @click="closeMenu"
                    class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 transition px-4 py-2 text-sm text-white"
                  >
                    <i class="fas fa-envelope"></i>
                    {{ t('navigation.ctaNewsletter') }}
                  </router-link>
                </div>

                <!-- Foto -->
                <div class="mt-4">
                  <img
                    src="https://cdn.bitcoinbeer.events/meetup/DSC01623.JPG"
                    alt="Meetup"
                    class="w-full h-36 md:h-40 object-cover rounded-xl border border-white/10"
                    loading="lazy" decoding="async"
                  />
                </div>

                <!-- Azioni -->
                <div class="mt-4 flex flex-wrap gap-3">
                  <a href="mailto:hello@bitcoinbeer.events" class="rounded-xl border border-white/10 bg-[#111214] hover:bg-[#15161a] transition px-4 py-2 text-sm text-white">
                    {{ t('navigation.contactUs') }}
                  </a>
                  <router-link to="/proponi-meetup" @click="closeMenu" class="rounded-xl border border-white/10 bg-[#111214] hover:bg-[#15161a] transition px-4 py-2 text-sm text-white">
                    {{ t('navigation.proposeMeetup') }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div> <!-- /scroll area -->
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProfile } from '@/composables/useProfile'

/* i18n reattivo */
const { t, locale: i18nLocale } = useI18n()
const locale = ref(i18nLocale.value)
function setLang(l) {
  if (!l) return
  i18nLocale.value = l      // <- cambia davvero la lingua
  locale.value = l          // <- evidenziazione dei bottoni
}

/* Router / route */
const router = useRouter()
const route = useRoute()

/* Auth/Profile */
const { profile, defaultAvatar, loadProfile, token } = useProfile()
const isLogged = computed(() => !!profile.value?.id)

/* Tickets -> Level/Badge */
const API_TICKETS = 'https://api.bitcoinbeer.events/api/user_tickets.php'
const ticketsCount = ref(0)
async function refreshTicketsCount() {
  if (!token.value) return
  try {
    const res = await fetch(API_TICKETS, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token: token.value }) })
    const json = await res.json()
    if (json?.success) ticketsCount.value = (json.data?.tickets || []).length
  } catch {}
}
const level = computed(() => Math.floor(ticketsCount.value / 10) + 1)
const BADGE_BY_LEVEL = { 1:'/assets/badges/lv1.png', 2:'/assets/badges/lv2.png', 3:'/assets/badges/lv3.png', 4:'/assets/badges/lv4.png', 5:'/assets/badges/lv5.png', 6:'/assets/badges/lv6.png' }
const badgeUrl = computed(() => BADGE_BY_LEVEL[Math.min(6, Math.max(1, level.value))] || null)

/* Navbar shrink */
const isScrolled = ref(false)
function onScroll() { isScrolled.value = window.scrollY > 10 }

/* Mega menu */
const menuOpen = ref(false)
function openMenu() {
  menuOpen.value = true
  if (token.value && !profile.value?.id) loadProfile()
  if (token.value && ticketsCount.value === 0) refreshTicketsCount()
  document.documentElement.style.overflow = 'hidden'
}
function closeMenu() {
  menuOpen.value = false
  document.documentElement.style.overflow = ''
}
function performLogout() {
  localStorage.removeItem('user_token')
  token.value = ''
  closeMenu()
  router.push('/')
}

/* Link sinistra (reattivi alla lingua) */
const bigLinks = computed(() => ([
  { to: '/',            label: t('navigation.home'),       desc: t('navigation.homeDesc') },
  { to: '/start',       label: t('navigation.start'),      desc: t('navigation.startDesc') },
  { to: '/explore',     label: t('navigation.explore'),    desc: t('navigation.exploreDesc') },
  { to: '/all-events',  label: t('navigation.calendar'),   desc: t('navigation.calendarDesc') },
  { to: '/leaderboard', label: t('navigation.leaderboard'),desc: t('navigation.leaderboardDesc') },
  { to: '/gallery',     label: t('navigation.gallery'),    desc: t('navigation.galleryDesc') },
]))

/* Lifecycle */
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen.value) closeMenu() })
  if (isLogged.value) { loadProfile(); refreshTicketsCount() }
  window.addEventListener('focus', refreshTicketsCount)
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refreshTicketsCount() })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('focus', refreshTicketsCount)
})
watch(() => route.fullPath, () => { if (menuOpen.value) closeMenu(); if (isLogged.value) refreshTicketsCount() })
</script>

<style scoped>
.bb-fade-enter-active, .bb-fade-leave-active { transition: opacity .18s ease; }
.bb-fade-enter-from, .bb-fade-leave-to { opacity: 0; }
</style>
