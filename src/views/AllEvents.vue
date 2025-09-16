<template>
  <!-- Calendario eventi in lista espandibile -->
  <section class="min-h-screen pt-28 pb-16 bg-gradient-to-b from-black via-zinc-900 to-black text-white font-inter">
    <div class="container mx-auto px-4">
      <!-- Titolo / descrizione -->
      <header class="text-center mb-14 max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">
          {{ $t('eventspage.title') }}
        </h1>
        <p class="text-lg md:text-xl text-gray-300">
          {{ $t('eventspage.description') }}
        </p>
      </header>

      <!-- Lista eventi raggruppata per mese -->
      <div
        v-for="({ key, items, colorClass }, idx) in groupedEventsArray"
        :key="key"
        class="space-y-6 mb-14"
      >
        <!-- Intestazione mese con colore dinamico -->
        <h2 :class="['text-2xl font-semibold italic', colorClass.replace('bg-', 'text-')]">
          {{ key }}
        </h2>

        <!-- Card evento -->
        <div
          v-for="event in items"
          :key="event.id"
          class="flex flex-col md:flex-row rounded-lg overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 transition-colors"
        >
          <!-- Barra data -->
          <div
            class="flex flex-col items-center justify-center w-full md:w-20 py-4 text-white md:block md:flex-none"
            :class="colorClass"
          >
            <span class="uppercase text-xs tracking-wide">
              {{ getWeekday(event) }}
            </span>
            <span class="text-3xl font-extrabold leading-none">
              {{ getDay(event) }}
            </span>
          </div>

          <!-- Contenuto card -->
          <div class="flex-1 p-4 md:p-6 flex flex-col gap-4">
            <!-- Sezione toggle: immagine + titolo -->
            <button
              class="w-full flex flex-col md:flex-row gap-4 text-left focus:outline-none"
              @click="toggle(event.id)"
            >
              <img
                :src="event.locandina"
                alt="locandina evento"
                class="w-full h-48 object-cover rounded-md md:w-64 md:h-36 md:flex-shrink-0"
              />

              <div class="flex-1 flex justify-between items-start md:items-center">
                <div>
                  <h3 class="text-lg md:text-xl font-bold mb-1">
                    {{ event.title }}
                  </h3>
                  <p class="text-gray-400 text-sm" v-if="event.subtitle">
                    {{ event.subtitle }}
                  </p>
                </div>

                <svg
                  :class="['w-5 h-5 mt-2 md:mt-0 transform transition-transform text-gray-300', isOpen(event.id) ? 'rotate-180' : 'rotate-0']"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            <!-- Dettagli espansi -->
            <transition name="fade">
              <div v-if="isOpen(event.id)" class="space-y-4">
                <p
                  class="text-gray-300 text-sm leading-relaxed whitespace-pre-line"
                  v-html="sanitize(event.description)"
                />
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span v-if="event.time"><strong class="text-gray-200">{{ $t('eventspage.time') }}:</strong> {{ formatTime(event.time) }}</span>
                  <span v-if="event.place"><strong class="text-gray-200">{{ $t('eventspage.place') }}:</strong> {{ event.place }}</span>
                </div>
              </div>
            </transition>

            <!-- Azioni sempre visibili -->
            <div class="flex gap-4 mt-auto">
              <!-- BUY button -> pagina dettagli -->
              <router-link
                :to="{ name: 'EventDetailPage', params: { id: event.id }, query: { src: 'events-calendar' } }"
                class="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-full text-sm font-semibold"
              >
                {{ $t('eventspage.buy') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'EventsCalendar',
  data() {
    return {
      events: [],
      openedIds: new Set(),
      monthColors: ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-rose-600'],
    }
  },
  computed: {
    groupedEventsArray() {
      const formatter = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' })
      const groups = {}
      this.events.forEach((ev) => {
        const d = this.extractDate(ev)
        const key = d ? formatter.format(d) : this.$t('eventspage.unknown')
        if (!groups[key]) groups[key] = []
        groups[key].push(ev)
      })
      return Object.entries(groups).map(([key, items], idx) => ({
        key,
        items,
        colorClass: this.monthColors[idx % this.monthColors.length],
      }))
    },
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await fetch('https://api.bitcoinbeer.events/get_events.php')
        const data = await response.json()
        this.events = data.events || []
      } catch (err) {
        console.error('Errore nel caricamento degli eventi:', err)
      }
    },
    sanitize(html) {
      if (!html) return ''
      const div = document.createElement('div')
      div.innerHTML = String(html)
      // rimuovi script e style
      div.querySelectorAll('script, style').forEach(el => el.remove())
      // rimuovi event handlers e javascript: URLs
      div.querySelectorAll('*').forEach(el => {
        ;[...el.attributes].forEach(attr => {
          const n = attr.name.toLowerCase()
          const v = String(attr.value || '').trim().toLowerCase()
          if (n.startsWith('on') || (['href','src'].includes(n) && v.startsWith('javascript:'))) {
            el.removeAttribute(attr.name)
          }
        })
      })
      return div.innerHTML
    },
    extractDate(ev) {
      const raw = ev.date || ev.event_date || ev.eventDate || ev.datetime || ev.event_datetime || ''
      if (!raw) return null
      const iso = raw.includes(' ') ? raw.replace(' ', 'T') : raw
      const d = new Date(iso)
      return isNaN(d.getTime()) ? null : d
    },
    getDay(ev) {
      const d = this.extractDate(ev)
      return d ? d.getDate() : '—'
    },
    getWeekday(ev) {
      const d = this.extractDate(ev)
      return d ? d.toLocaleDateString('it-IT', { weekday: 'short' }) : '❓'
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      if (/^\d{1,2}:\d{2}$/.test(timeStr)) return timeStr
      if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr.slice(0, 5)
      return timeStr
    },
    toggle(id) {
      this.openedIds.has(id) ? this.openedIds.delete(id) : this.openedIds.add(id)
    },
    isOpen(id) {
      return this.openedIds.has(id)
    },
  },
  async created() {
    await this.fetchEvents()
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
