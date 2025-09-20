<template>
  <div class="bg-black text-white min-h-screen">
    <!-- HERO al posto della banda arancione -->
    <section class="relative w-full h-[52vh] sm:h-[58vh] overflow-hidden pt-24">
      <transition name="fade" mode="out-in">
        <img :key="heroCurrent" :src="heroCurrent" alt="hero"
             class="absolute inset-0 w-full h-full object-cover object-center"/>
      </transition>
      <div class="absolute inset-0 bg-black/55"></div>


      <div class="absolute bottom-0 left-0 h-[2px] bg-white/90" :style="{ width: heroProgress + '%' }"></div>
    </section>

    <!-- Locandina -->
    <div class="relative max-w-4xl mx-auto px-4 -mt-16 z-10 loca">
      <img :src="event?.locandina" alt="Locandina"
           class="w-full h-auto object-cover rounded-lg shadow-lg hover:shadow-xl transition-transform duration-500 hover:scale-105"/>
    </div>

    <!-- Descrizione -->
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold mb-4">Descrizione</h2>
      <p class="text-lg leading-relaxed whitespace-pre-line text-gray-300">
        {{ event?.description || "Descrizione non disponibile" }}
      </p>
    </div>

    <!-- Mappa -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-4">Location</h2>
      <div id="map" class="w-full h-80 rounded-lg shadow-md"></div>
    </div>

    <!-- Info -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">Informazioni</h2>
      <ul class="space-y-4 text-gray-400">
        <li v-if="event?.guest" class="flex items-center">
          <i class="fas fa-user mr-2 text-orange-500 mr-3"></i>
          <span><strong>Ospite:</strong> <span class="text-white">{{ event.guest }}</span></span>
        </li>
        <li v-if="event?.venue" class="flex items-center">
          <i class="fas fa-map-marker-alt text-orange-500 mr-3"></i>
          <span><strong>Venue:</strong> <span class="text-white">{{ event.venue }}</span></span>
        </li>
        <li class="flex items-center">
          <i class="fas fa-calendar-alt text-orange-500 mr-3"></i>
          <span><strong>Data e ora:</strong> <span class="text-white">{{ formatDateTime(event?.event_date) }}</span></span>
        </li>
        <li v-if="event?.address" class="flex items-center">
          <i class="fas fa-location-arrow text-orange-500 mr-3"></i>
          <span><strong>Indirizzo:</strong> <span class="text-white">{{ event.address }}</span></span>
        </li>
        <li v-if="hasTickets && displayPrice > 0" class="flex items-center">
          <i class="fas fa-euro-sign text-orange-500 mr-3"></i>
          <span><strong>Prezzo:</strong> <span class="text-white">{{ formattedPrice }} €</span></span>
        </li>
        <li v-else-if="hasTickets" class="flex items-center">
          <i class="fas fa-ticket-alt text-green-400 mr-3"></i>
          <span class="text-white font-semibold">Evento gratuito</span>
        </li>
      </ul>
    </div>

    <!-- Acquista / Ottieni -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-4">Acquista Ticket</h2>

      <div v-if="error" class="mb-4 rounded-lg border border-red-500/40 bg-red-900/30 text-red-200 px-4 py-3">
        {{ error }}
      </div>
      <div v-if="notice" class="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-900/30 text-emerald-200 px-4 py-3">
        {{ notice }}
      </div>

      <!-- quantità -->
      <div class="flex items-center gap-3 mb-3">
        <span class="text-gray-300">Quantità:</span>
        <div class="inline-flex items-center border border-white/30 rounded-full overflow-hidden">
          <button class="px-3 py-1 hover:bg-white/10"
                  @click="qty = Math.max(1, qty-1)"
                  :disabled="available <= 0">–</button>
          <span class="px-4">{{ qty }}</span>
          <button class="px-3 py-1 hover:bg-white/10"
                  @click="qty = Math.min(available, qty+1)"
                  :disabled="qty >= available">+</button>
        </div>
        <span class="text-xs text-gray-400">
          Disponibili: {{ availableLabel }}
        </span>
      </div>

      <!-- note & terms -->
      <div class="space-y-3 text-sm">
        <label class="inline-flex items-start gap-2 select-none cursor-pointer">
          <input type="checkbox" v-model="noteFlag" class="mt-1">
            <span v-if="event?.notes" class="block text-gray-400 italic mt-1">
              Note: {{ event.notes }}
            </span>
        </label>
        <br></br>
        <label class="inline-flex items-center gap-2 select-none cursor-pointer">
          <input type="checkbox" v-model="accepted" />
          <span class="text-gray-300">
            Accetto i <router-link to="/terms" class="underline">termini e condizioni</router-link>.
          </span>
        </label>
      </div>

      <!-- pulsanti -->
      <div class="flex gap-3 mt-5 flex-wrap">
        <!-- GRATUITO -->
        <button v-if="isFree"
                :disabled="loading || !accepted || available <= 0"
                @click="handleFree"
                class="disabled:opacity-50 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 font-semibold
                       bg-gradient-to-r from-emerald-600 to-emerald-400 text-black hover:brightness-110 transition">
          <i class="fas fa-gift"></i> Ottieni
        </button>

        <!-- A PAGAMENTO -->
        <template v-else>
          <button :disabled="loading || !accepted || available <= 0"
                  @click="handleBuy('btcpay')"
                  class="disabled:opacity-50 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 font-semibold
                         bg-gradient-to-r from-amber-700 to-amber-500 hover:opacity-90 transition">
            <i class="fas fa-bolt"></i> Bitcoin / Lightning (BTCPay)
          </button>

          <button :disabled="loading || !accepted || available <= 0"
                  @click="handleBuy('paypal')"
                  class="disabled:opacity-50 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 font-semibold
                         bg-gradient-to-r from-[#00457C] to-[#009CDE] hover:opacity-90 transition">
            <i class="fab fa-paypal"></i> PayPal.me
          </button>
        </template>
      </div>

      <p class="text-sm text-gray-400 mt-3">
        Devi essere loggato. Se non hai email nel profilo, te la chiediamo lì.
      </p>
    </div>

    <!-- Partecipanti -->
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold mb-6">Partecipanti</h2>
      <div class="flex items-center justify-center">
        <div class="flex items-center -space-x-3">
          <div v-if="attendees.length > 5"
               class="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-xs font-semibold ring-2 ring-white"
               :style="{ zIndex: attendees.length + 1 }">
            +{{ attendees.length - 5 }}
          </div>
          <template v-for="(att, idx) in attendees.slice(0, 5)" :key="att.name">
            <span class="relative bg-white rounded-full p-[1px] ring-2 ring-black/70" :style="{ zIndex: idx }">
              <img :src="att.avatar" :alt="att.name" :title="att.name" class="w-10 h-10 rounded-full object-cover"/>
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "EventDetailPage",
  props: ["id"],
  data() {
    return {
      event: null,
      attendees: [],
      loading: false,
      error: "",
      notice: "",
      qty: 1,
      accepted: false,
      noteFlag: false,

      // disponibilità
      available: 1,

      // hero
      heroImages: [
      'https://cdn.bitcoinbeer.events/meetup/DSC01623.JPG',
      'https://cdn.bitcoinbeer.events/meetup/DSC01653.JPG',
      'https://cdn.bitcoinbeer.events/meetup/DSC09751.JPG',
      'https://cdn.bitcoinbeer.events/meetup/DSC09788.JPG',
      'https://cdn.bitcoinbeer.events/meetup/DSC09814.JPG',
      'https://cdn.bitcoinbeer.events/meetup/Granatiero.jpg',
      'https://cdn.bitcoinbeer.events/meetup/Guybrush-2025-06.jpg',
      'https://cdn.bitcoinbeer.events/meetup/Guybrush_2_2025-06.jpg',
      'https://cdn.bitcoinbeer.events/meetup/Rivi.jpg',
      'https://cdn.bitcoinbeer.events/meetup/Luca-Bitbox.jpg',
      'https://cdn.bitcoinbeer.events/meetup/Luca-Bitbox-2.jpg',
      ],
      heroIndex: 0,
      heroProgress: 0,
      heroTimer: null,
      heroProgTimer: null,
      heroDuration: 5000,

      API: {
        BTCPAY_CREATE: "https://api.bitcoinbeer.events/api/payments/btcpay_create.php",
        PAYPAL_CREATE: "https://api.bitcoinbeer.events/api/payments/paypal_create.php",
        FREE_CLAIM:    "https://api.bitcoinbeer.events/api/payments/free_claim.php",
        REMAINING:     "https://api.bitcoinbeer.events/api/tickets/remaining.php",
        READ_EVENTS:   "https://api.bitcoinbeer.events/api/read_events.php",
        ATTENDEES:     "https://api.bitcoinbeer.events/api/attendees.php",
        PROFILE:       "https://api.bitcoinbeer.events/api/get_profile.php",
        API_KEY:       "0215efb408569f4590cc2108cae33689b4901475a994d2ec5be1e59af0fc231a",
      },
    };
  },
computed: {
  // vero se l'evento ha biglietti attivati (di solito 0/1 nel DB)
  hasTickets() {
    return String(this.event?.has_tickets ?? "") === "1";
  },

  // Prende il primo valore prezzo valido: ticket_price oppure price
  // IGNORA null, undefined, "" e robe non numeriche
  displayPrice() {
    const n1 = this.parseMoney(this.event?.ticket_price);
    const n2 = this.parseMoney(this.event?.price);
    // priorità: ticket_price valido, altrimenti price valido, altrimenti 0
    if (n1 !== null) return n1;
    if (n2 !== null) return n2;
    return 0;
  },

  // Evento "gratis" solo se ha i ticket attivi E il prezzo è 0
  isFree() {
    return this.hasTickets && this.displayPrice <= 0;
  },

  // Stringa per UI
  formattedPrice() {
    return this.displayPrice.toFixed(2);
  },

  heroCurrent() {
    return this.heroImages[this.heroIndex % this.heroImages.length];
  },

  availableLabel() {
    return this.available > 0 ? this.available : "0 (sold out)";
  }
},
  methods: {
    // HERO
    startHero() {
      const tick = () => {
        const start = Date.now();
        this.heroProgress = 0;
        clearInterval(this.heroProgTimer);
        this.heroProgTimer = setInterval(() => {
          const elapsed = Date.now() - start;
          this.heroProgress = Math.min(100, (elapsed / this.heroDuration) * 100);
        }, 40);
        clearTimeout(this.heroTimer);
        this.heroTimer = setTimeout(() => {
          this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;
          tick();
        }, this.heroDuration);
      };
      tick();
    },

    formatDateTime(dateTime) {
      const d = new Date((dateTime || "").replace(" ", "T"));
      return isNaN(d) ? "Data non valida" : d.toLocaleString();
    },

        // Restituisce un numero valido oppure null (NON 0) se vuoto/NaN
    parseMoney(v) {
      if (v === null || v === undefined) return null;
      const s = String(v).trim();
      if (s === "") return null;
      // supporta "5", "5.00", "5,00"
      const n = Number(s.replace(",", "."));
      return Number.isFinite(n) ? n : null;
    },

    // (opzionale) se vuoi isolarla per debug/log
    priceFromEvent(ev) {
      const n1 = this.parseMoney(ev?.ticket_price);
      const n2 = this.parseMoney(ev?.price);
      return n1 ?? n2 ?? 0;
    },


    async fetchEvent(id) {
      this.error = "";
      try {
        const res = await fetch(this.API.READ_EVENTS, {
          headers: this.API.API_KEY ? { "X-API-KEY": this.API.API_KEY } : {},
          cache: "no-store",
        });
        if (!res.ok) throw new Error("read_events non ok");
        const json = await res.json();
        const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        const found = list.find(ev => String(ev.id) === String(id));
        if (!found) { this.error = "Evento non trovato."; return; }
        this.event = found;

        // disponibilità reale
        await this.fetchRemaining();

        // mappa + hero + attendees
        this.$nextTick(() => this.initMap());
        this.fetchAttendees();
        this.startHero();
      } catch (e) {
        console.error("fetchEvent error:", e);
        this.error = "Errore nel caricamento evento.";
      }
    },

    async fetchRemaining() {
      try {
        const token = this.event?.public_url_token;
        if (!token) { this.available = 1; return; }
        const res = await fetch(`${this.API.REMAINING}?token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.success) {
          this.available = Math.max(0, Number(data.remaining ?? 0));
          // clamp qty
          this.qty = Math.min(Math.max(1, this.qty), Math.max(1, this.available));
        } else {
          this.available = Math.max(1, Number(this.event?.max_tickets ?? 1));
        }
      } catch (e) {
        console.error("fetchRemaining error:", e);
        this.available = Math.max(1, Number(this.event?.max_tickets ?? 1));
      }
    },

    async fetchAttendees() {
      try {
        const token = this.event?.public_url_token;
        if (!token) return;
        const url = `${this.API.ATTENDEES}?token=${encodeURIComponent(token)}${
          this.API.API_KEY ? `&api_key=${encodeURIComponent(this.API.API_KEY)}` : ""
        }`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        this.attendees = (json || []).map(u => {
          const first = (u.buyer_name || "").split(" ")[0] || "guest";
          return {
            name: first,
            avatar: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(first)}`
          };
        });
      } catch (e) {
        console.error("fetchAttendees error:", e);
      }
    },

    initMap() {
      if (!this.event || !this.event.latitude || !this.event.longitude) return;
      const lat = parseFloat(this.event.latitude);
      const lon = parseFloat(this.event.longitude);
      this.map = L.map("map").setView([lat, lon], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18, attribution: "© OpenStreetMap",
      }).addTo(this.map);
      L.marker([lat, lon]).addTo(this.map);
    },

    // GRATUITO
    async handleFree() {
      this.error = ""; this.notice = "";
      if (!this.accepted) { this.error = "Devi accettare i termini."; return; }
      if (!this.isFree)  { this.error = "Evento non gratuito"; return; }
      if (this.available <= 0) { this.error = "Sold out"; return; }

      const token = localStorage.getItem("user_token");
      if (!token) { this.redirectLogin(); return; }
      if (!this.event?.public_url_token) { this.error = "Token evento mancante."; return; }

      const quantity = Math.max(1, Math.min(this.available, Number(this.qty) || 1));
      this.loading = true;
      try {
        const res = await fetch(this.API.FREE_CLAIM, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            event_token: this.event.public_url_token,
            quantity,
            note_flag: this.noteFlag ? 1 : 0
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.error || "Errore richiesta");
        this.notice = "Ticket ottenuto! Controlla nel tuo profilo.";
        await this.fetchRemaining();
      } catch (e) {
        console.error(e);
        this.error = e.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    // PAGAMENTO
    redirectLogin() {
      const eventId = this.$route?.params?.id || this.id;
      const ret = encodeURIComponent(`/event/${eventId}`);
      this.$router.push(`/login?redirect=${ret}`);
    },

    async handleBuy(kind) {
      this.error = ""; this.notice = "";
      if (!this.accepted)   { this.error = "Devi accettare i termini."; return; }
      if (this.isFree)      { this.error = "Evento gratuito: usa 'Ottieni'."; return; }
      if (this.available<=0){ this.error = "Sold out"; return; }

      const token = localStorage.getItem("user_token");
      if (!token) { this.redirectLogin(); return; }

      // profilo
      let profile;
      try {
        const res = await fetch(this.API.PROFILE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json = await res.json();
        if (!json?.success) throw new Error("Profilo non disponibile");
        profile = json.data?.user || {};
      } catch (e) {
        this.error = "Impossibile recuperare il profilo.";
        return;
      }
      const email = (profile.email || "").trim();
      const buyerName = (profile.full_name || profile.username || "Guest").trim();
      if (!email) { this.$router.push({ path: "/profile", query: { missingEmail: "1" } }); return; }

      if (!this.event?.public_url_token) { this.error = "Token evento mancante."; return; }
      const quantity = Math.max(1, Math.min(this.available, Number(this.qty) || 1));

      this.loading = true;
      try {
        if (kind === "btcpay") {
          const payload = {
            event_token: this.event.public_url_token,
            buyer_name: buyerName,
            buyer_email: email,
            quantity,
            note_flag: this.noteFlag ? 1 : 0,
          };
          const res = await fetch(this.API.BTCPAY_CREATE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!res.ok || !data.ok || !data.checkoutLink) throw new Error(data.error || "Errore BTCPay");
          window.location.href = data.checkoutLink;
        } else {
          const payload = {
            event_token: this.event.public_url_token,
            name: buyerName,
            email,
            tickets: quantity,
            note_flag: this.noteFlag ? 1 : 0,
          };
          const res = await fetch(this.API.PAYPAL_CREATE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!res.ok || !data.ok || !data.redirectUrl) throw new Error(data.error || "Errore PayPal");
          window.location.href = data.redirectUrl;
        }
      } catch (e) {
        console.error(e);
        this.error = e.message || String(e);
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    const id = this.$route?.params?.id || this.id;
    if (id) await this.fetchEvent(id);
  },
  unmounted() {
    clearTimeout(this.heroTimer);
    clearInterval(this.heroProgTimer);
  }
};
</script>

<style scoped>
.loca { margin-top: -10rem; }
#map { width: 100%; height: 320px; }
.fade-enter-active,.fade-leave-active{ transition: opacity .6s ease-in-out; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
</style>