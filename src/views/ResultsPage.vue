<template>
  <div class="results-page">
    <!-- Masthead: Institution Branding -->
    <!-- offset below main navbar -->
    <header class="masthead">
      <div class="container masthead-container">
        <h1 class="brand">BitcoinBeer Directory</h1>
        <div class="search-box">
          <input
            v-model="searchQuery"
            @keyup.enter="doSearch"
            type="text"
            placeholder="Cerca (es. Ristorante Bitcoin Milano / 25 marzo)"
            aria-label="Campo di ricerca"
          />
          <button @click="doSearch" class="btn-search">Cerca</button>
        </div>
      </div>
    </header>

    <main class="container">
      <section class="status-bar">
        <p class="results-title">Risultati per: <strong>"{{ searchQuery }}"</strong></p>
      </section>

      <!-- Loading Skeleton Cards -->
      <div v-if="loading" class="results-list">
        <li v-for="n in 6" :key="n" class="result-card">
          <div class="skeleton-card">
            <div class="flex p-4 space-x-4">
              <div class="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
              <div class="flex-1 py-2 space-y-4">
                <div class="w-full h-3 rounded bg-gray-300 animate-pulse"></div>
                <div class="w-5/6 h-3 rounded bg-gray-300 animate-pulse"></div>
              </div>
            </div>
            <div class="p-4 space-y-4">
              <div class="w-full h-4 rounded bg-gray-300 animate-pulse"></div>
              <div class="w-full h-4 rounded bg-gray-300 animate-pulse"></div>
              <div class="w-3/4 h-4 rounded bg-gray-300 animate-pulse"></div>
            </div>
          </div>
        </li>
      </div>

      <p v-else-if="places.length === 0" class="no-results">
        Nessun risultato trovato per "{{ searchQuery }}".
      </p>

      <!-- Results List -->
      <ul v-else class="results-list">
        <li
          v-for="place in places"
          :key="place.id"
          class="result-card"
          @click="openModal(place)"
        >
          <div class="card-header">
            <h2 class="place-name">{{ place.name || 'Senza nome' }}</h2>
            <div class="payment-icons">
              <img
                v-if="place.payment_onchain"
                src="/logos/icons8-bitcoin-48.png"
                alt="Bitcoin Onchain"
                title="On-chain"
              />
              <img
                v-if="place.payment_lightning"
                src="/logos/icons8-fulmine-48.png"
                alt="Lightning Payment"
                title="Lightning"
              />
              <img
                v-if="place.payment_lightning_contactless"
                src="https://cdn-icons-png.flaticon.com/512/727/727399.png"
                alt="Contactless"
                title="Contactless"
              />
            </div>
          </div>
          <p class="place-address">
            {{ place.address_street }} {{ place.address_housenumber }}, {{ place.address_city }}
          </p>
          <p v-if="place.description" class="place-description">
            {{ place.description }}
          </p>
          <p v-if="place.website" class="place-website">
            <a :href="place.website" target="_blank" rel="noopener">
              <img
                src="https://cdn-icons-png.flaticon.com/512/841/841364.png"
                alt="Sito web"
                class="icon-web"
              />
              Visita il sito ufficiale
            </a>
          </p>
        </li>
      </ul>
    </main>

    <!-- Modal for Place Details -->
    <transition name="fade">
      <div v-if="selectedPlace" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <button class="modal-close" @click="closeModal" aria-label="Chiudi">×</button>
          <h2>{{ selectedPlace.name }}</h2>
          <p><strong>Indirizzo:</strong> {{ selectedPlace.address_street }} {{ selectedPlace.address_housenumber }}, {{ selectedPlace.address_city }}</p>
          <div class="modal-payments">
            <span v-if="selectedPlace.payment_onchain">On-chain</span>
            <span v-if="selectedPlace.payment_lightning">Lightning</span>
            <span v-if="selectedPlace.payment_lightning_contactless">Contactless</span>
          </div>
          <p v-if="selectedPlace.description" class="modal-description">{{ selectedPlace.description }}</p>
          <p v-if="selectedPlace.website" class="modal-website">
            <a :href="selectedPlace.website" target="_blank" rel="noopener">Vai al sito ufficiale</a>
          </p>
          <div ref="map" class="modal-map"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import L from 'leaflet';
import SkeletonCard from '../components/SkeletonCard.vue';
import bitcoinIconPath from '/logos/icons8-bitcoin-48.png';
import lightningIconPath from '/logos/icons8-fulmine-48.png';

export default {
  components: { SkeletonCard },
  name: 'ResultsPage',
  data() {
    return {
      places: [],
      loading: false,
      searchQuery: this.$route.query.q || '',
      selectedPlace: null,
    };
  },
  methods: {
    async doSearch() {
      this.loading = true;
      try {
        const params = new URLSearchParams({ limit: 100 });
        if (this.searchQuery.trim()) params.append('search', this.searchQuery.trim());
        const res = await fetch(`https://api.bitcoinbeer.events/api/places.php?${params}`);
        const json = await res.json();
        this.places = json.data || [];
      } catch {
        this.places = [];
      } finally {
        this.loading = false;
      }
    },
    openModal(place) {
      this.selectedPlace = place;
      this.$nextTick(() => {
        const map = L.map(this.$refs.map).setView([place.latitude, place.longitude], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([place.latitude, place.longitude]).addTo(map);
      });
    },
    closeModal() {
      this.selectedPlace = null;
    }
  },
  mounted() {
    this.doSearch();
  }
};
</script>

<style scoped>
/* Global Styles */
* { box-sizing: border-box; }
body, html { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
.container { width: 90%; max-width: 900px; margin: 0 auto; }

.results-page {
  background: #000;
  min-height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
}

/* Masthead */
.masthead {
  background: rgba(0,0,0,0.9);
  padding: 2rem 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  margin-top: 60px; /* offset below navbar */
}


/* main content offset so results scroll under header */
.results-page > main.container {
  margin-top: 100px;
}
 
.search-box, .btn-search { /* kept unchanged */ }

/* Status Bar */
.status-bar { margin: 1.5rem 0; text-align: center; }
.results-title { font-size: 1.2rem; margin: 0; }

/* Spinner */
.spinner-wrapper { text-align: center; padding: 2rem; display: none; }

/* Skeleton placeholder */
.skeleton {
  height: 100px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid #333; border-top-color: #00509e; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Polyglass Cards */
.results-list { list-style: none; padding: 0; margin: 0; }
.result-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
} 
.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255,255,255,0.1);
}

.card-header { display: flex; justify-content: space-between; align-items: center; }
.place-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #FFD700; /* gold for emphasis */
} 
.payment-icons img { width: 24px; height: 24px; margin-left: 0.5rem; }

.place-address, .place-description, .place-website { margin: 0.5rem 0; color: #ccc; font-size: 0.9rem; }

/* Resize web icon */
.place-website img {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: middle;
}
.place-website a {
  color: #5faaff;
  text-decoration: none;
}
.place-website a:hover { text-decoration: underline; }
.no-results { text-align: center; font-size: 1rem; color: #ccc; }

/* Modal Styles */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; }
.modal-container {
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  color: #fff;
  position: relative;
}
.modal-close { position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #fff; }
.modal-map { width: 100%; height: 200px; margin-top: 1rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; }
</style>
