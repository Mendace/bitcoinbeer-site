<template>
  <section class="bg-black text-white py-12 w-full">
    <div class="container mx-auto px-4">
      <!-- Titolo -->
      <h2 class="text-3xl font-bold mb-16 text-center">
        {{ $t('events.upcomingEvents') }}
      </h2>

      <!-- Lista eventi (max 3) -->
      <div class="flex flex-col space-y-12">
        <div
          v-for="event in eventsWithAttendees"
          :key="event.id"
          class="gradient-border rounded-2xl"
        >
          <!-- Card interna -->
          <div
            class="bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6"
          >
            <!-- Locandina -->
            <div v-if="event.locandina" class="flex-shrink-0 w-full md:w-80">
              <img
                :src="event.locandina"
                alt="Locandina"
                class="w-full h-auto object-contain rounded-lg"
              />
            </div>

            <!-- Contenuto -->
            <div class="flex-1 flex flex-col gap-4">
              <!-- Meta -->
              <div>
                <p class="text-xs font-semibold tracking-widest uppercase text-white/60">
                  {{ getDay(event.event_date) }} {{ getMonth(event.event_date, true) }}
                </p>
                <p class="text-xs tracking-widest uppercase font-semibold text-white/60">
                  {{ formatTime(event.event_date) }} — {{ formatEndTime(event.event_date) }}
                </p>
                <h3 class="text-lg md:text-xl font-bold mt-1">
                  {{ event.title }}
                </h3>

                <!-- Dettagli -->
                <div class="space-y-1 text-sm mt-3">
                  <p v-if="event.venue" class="flex items-center gap-2">
                    <i class="fas fa-map-marker-alt text-orange-500"></i>
                    {{ event.venue }}
                  </p>
                  <p v-if="event.address" class="flex items-center gap-2">
                    <i class="fas fa-location-arrow text-orange-500"></i>
                    {{ event.address }}
                  </p>
                  <p v-if="event.guest" class="flex items-center gap-2">
                    <i class="fas fa-user text-orange-500"></i>
                    {{ event.guest }}
                  </p>
                </div>
              </div>

              <!-- Note opzionali -->
              <p v-if="event.notes" class="text-sm italic text-white/70 leading-relaxed">
                {{ event.notes }}
              </p>

              <!-- Share & “Acquista” (-> pagina dettagli) -->
              <div class="flex items-center gap-4 mt-4">
                <!-- Condividi -->
                <button
                  @click="openShareModal(event)"
                  class="share-btn flex items-center justify-center"
                >
                  <i class="fas fa-share-alt"></i>
                </button>

                <!-- Vai alla pagina dettaglio evento -->
                <router-link
                  :to="{ name: 'EventDetailPage', params: { id: event.id }, query: { src: 'home-upcoming' } }"
                  class="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition text-xs md:text-sm font-semibold rounded-full py-2 px-4"
                >
                  <i class="fas fa-ticket-alt"></i>
                  {{ $t('events.buy') }}
                </router-link>
              </div>

              <!-- Partecipanti -->
              <div
                class="mt-6 flex items-center gap-4"
                :class="{ 'justify-center': !isDesktop, 'justify-end': isDesktop }"
              >
                <span class="font-semibold">Partecipanti</span>
                <div class="flex items-center -space-x-3">
                  <!-- badge +N -->
                  <div
                    v-if="event.attendees.length > 5"
                    class="relative w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-xs font-semibold ring-2 ring-white"
                    :style="{ zIndex: event.attendees.length + 1 }"
                  >
                    +{{ event.attendees.length - 5 }}
                  </div>
                  <!-- avatar -->
                  <template v-for="(att, idx) in event.attendees.slice(0, 5)" :key="idx">
                    <span
                      class="relative bg-white rounded-full p-[1px] ring-2 ring-black/70"
                      :style="{ zIndex: idx }"
                    >
                      <img
                        :src="att.avatar"
                        :alt="att.name"
                        :title="att.name"
                        class="w-6 h-6 rounded-full object-cover"
                      />
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vedi tutti -->
      <div class="flex justify-center mt-12">
        <router-link
          to="/all-events"
          class="relative inline-block py-3 px-8 font-bold text-white border border-white rounded-full overflow-hidden group focus:outline-none focus:ring-4 focus:ring-orange-500"
        >
          <span
            class="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"
          ></span>
          <span class="relative z-10">
            {{ $t('events.seeAllEvents') }}
          </span>
        </router-link>
      </div>

      <!-- Share modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="modal-content relative w-full max-w-md">
          <button @click="closeShareModal" class="close-button absolute top-2 right-2">
            <i class="fas fa-times"></i>
          </button>
          <h3 class="text-xl font-semibold mb-4">
            {{ $t('events.share') }} "{{ selectedEvent.title }}"
          </h3>
          <div class="flex justify-around text-3xl text-white/80">
            <a :href="shareLinks.twitter(selectedEvent)" target="_blank" rel="noopener">
              <i class="fab fa-twitter-square"></i>
            </a>
            <a :href="shareLinks.telegram(selectedEvent)" target="_blank" rel="noopener">
              <i class="fab fa-telegram"></i>
            </a>
            <a :href="shareLinks.whatsapp(selectedEvent)" target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i>
            </a>
            <a :href="shareLinks.facebook(selectedEvent)" target="_blank" rel="noopener">
              <i class="fab fa-facebook-square"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: { category: { type: String, required: false, default: '' } },
  data() {
    return {
      events: [],
      eventsWithAttendees: [],
      showModal: false,
      selectedEvent: null,
      isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
      // fetch diretto su endpoint pubblico per compatibilità
    };
  },
  computed: {
    shareLinks() {
      return {
        twitter: (ev) =>
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            ev.title
          )}&url=${encodeURIComponent(
            location.origin + this.$router.resolve({ name: 'EventDetailPage', params: { id: ev.id } }).href
          )}`,
        telegram: (ev) =>
          `https://t.me/share/url?url=${encodeURIComponent(
            location.origin + this.$router.resolve({ name: 'EventDetailPage', params: { id: ev.id } }).href
          )}&text=${encodeURIComponent(ev.title)}`,
        whatsapp: (ev) =>
          `https://api.whatsapp.com/send?text=${encodeURIComponent(
            ev.title
          )}%20${encodeURIComponent(
            location.origin + this.$router.resolve({ name: 'EventDetailPage', params: { id: ev.id } }).href
          )}`,
        facebook: (ev) =>
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            location.origin + this.$router.resolve({ name: 'EventDetailPage', params: { id: ev.id } }).href
          )}`,
      };
    },
  },
  async created() {
    await this.fetchEvents();
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", () => {
        this.isDesktop = window.innerWidth >= 768;
      });
    }
  },
  methods: {
    /** scarica eventi pubblicati e filtra per categoria */
    async fetchEvents() {
      const res = await fetch("https://api.bitcoinbeer.events/api/read_events.php", {
        headers: {
          "X-API-KEY": "0215efb408569f4590cc2108cae33689b4901475a994d2ec5be1e59af0fc231a",
        },
        cache: "no-store",
      });
      const all = await res.json();
      this.events = all
        .filter((e) => !this.category || e.category === this.category)
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
        .slice(0, 3);

      this.eventsWithAttendees = await Promise.all(
        this.events.map(async (ev) => ({
          ...ev,
          attendees: ev.public_url_token
            ? await this.fetchAttendees(ev.public_url_token)
            : [],
        }))
      );
    },

    /** ottiene lista partecipanti */
    async fetchAttendees(token) {
      const url = `https://api.bitcoinbeer.events/api/attendees.php?token=${token}&api_key=0215efb408569f4590cc2108cae33689b4901475a994d2ec5be1e59af0fc231a`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("fetchAttendees failed");
      const list = await res.json();
      return list.map((u) => {
        const first = (u.buyer_name || '').split(" ")[0] || 'Guest';
        return {
          name: first,
          avatar: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(first)}`,
        };
      });
    },

    openShareModal(ev) {
      this.selectedEvent = ev;
      this.showModal = true;
    },
    closeShareModal() {
      this.showModal = false;
      this.selectedEvent = null;
    },

    /* helper formattazione date */
    formatTime(dt) {
      const d = new Date((dt || "").toString().replace(" ", "T"));
      return isNaN(d)
        ? "--:--"
        : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },
    formatEndTime(dt) {
      const d = new Date((dt || "").toString().replace(" ", "T"));
      if (isNaN(d)) return "--:--";
      d.setHours(d.getHours() + 2);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },
    getDay(dt) {
      const d = new Date((dt || "").toString().replace(" ", "T"));
      return isNaN(d) ? "--" : d.getDate();
    },
    getMonth(dt, full = false) {
      const d = new Date((dt || "").toString().replace(" ", "T"));
      if (isNaN(d)) return "---";
      const short = ["GEN","FEB","MAR","APR","MAG","GIU","LUG","AGO","SET","OTT","NOV","DIC"];
      const long  = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
      return full ? long[d.getMonth()] : short[d.getMonth()];
    },
  },
};
</script>

<style scoped>
.gradient-border:hover {
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.8),
    0 0 32px rgba(255, 140, 0, 0.8);
}

/* modal overrides */
.modal-content {
  background: rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  padding: 2rem;
  color: #fff;
  text-align: center;
  backdrop-filter: blur(15px);
}
.close-button {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}
.close-button:hover {
  color: #ccc;
}

/* share button */
.share-btn {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0);
  color: #fff;
  transition: background 0.3s, box-shadow 0.3s;
  overflow: hidden;
}
.share-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.4),
    transparent 70%
  );
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s, transform 0.3s;
}
.share-btn i {
  position: relative;
  font-size: 1.1rem;
  transition: transform 0.3s, color 0.3s;
}
.share-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}
.share-btn:hover::before {
  opacity: 1;
  transform: scale(1.3);
}
.share-btn:hover i {
  transform: rotate(20deg) scale(1.1);
  color: #60a5fa;
}
</style>
