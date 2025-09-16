<script setup>
import { useHead } from '@vueuse/head';

useHead({
  title: 'Bitcoin Beer - Esplora le Community Bitcoin in Italia',
  meta: [
    { name: 'description', content: 'Scopri tutte le community Bitcoin in Italia sulla mappa interattiva di Bitcoin Beer. Connettiti con altri appassionati e unisciti agli eventi locali.' },
    { name: 'keywords', content: 'Bitcoin, Community Bitcoin, Mappa Bitcoin, Eventi Bitcoin, Bitcoin Beer, Community Locali, Blockchain Italia' },
    { name: 'author', content: 'BitcoinBeer' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: 'Italian' },
    { name: 'revisit-after', content: '7 days' },
    { property: 'og:title', content: 'Bitcoin Beer - Esplora le Community Bitcoin in Italia' },
    { property: 'og:description', content: 'Trova le community Bitcoin locali in Italia sulla mappa interattiva di Bitcoin Beer e partecipa agli eventi nella tua zona.' },
    { property: 'og:image', content: '/assets/explore.webp' },
    { property: 'og:url', content: 'https://bitcoinbeer.events/explore' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'it_IT' },
    { property: 'og:site_name', content: 'Bitcoin Beer' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Bitcoin Beer - Esplora le Community Bitcoin in Italia' },
    { name: 'twitter:description', content: 'Scopri e connettiti con le community Bitcoin in Italia sulla mappa di Bitcoin Beer. Unisciti agli eventi locali.' },
    { name: 'twitter:image', content: '/assets/explore.webp' },
    { name: 'twitter:site', content: '@BitcoinBeerIT' },
    { name: 'twitter:creator', content: '@BitcoinBeerIT' },
  ],
  link: [
    { rel: 'canonical', href: 'https://bitcoinbeer.events/explore' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Bitcoin Beer - Esplora le Community Bitcoin',
        description: 'Scopri tutte le community Bitcoin in Italia sulla mappa interattiva di Bitcoin Beer.',
        url: 'https://bitcoinbeer.events/explore',
        mainEntity: {
          '@type': 'Map',
          name: 'Mappa delle Community Bitcoin in Italia',
          url: 'https://bitcoinbeer.events/explore',
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'Numero di Community',
              value: '{{ totalCommunities }}'
            },
            {
              '@type': 'PropertyValue',
              name: 'Eventi Attivi',
              value: '{{ activeEvents }}'
            }
          ]
        }
      }),
    },
  ],
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section id="hero" class="hero-section">
      <!-- Image Overlay -->
      <div class="hero-image-overlay"></div>
      <div class="hero-content">
        <h1>{{ $t('welcome.welcome_message') }}</h1>
        <p>{{ $t('welcome.welcome_submessage') }}</p>
      </div>
      <div class="scroll-indicator" @click="scrollToMap">
        <i class="fas fa-chevron-down"></i>
      </div>
    </section>

    <!-- Parallax Section con Mappa -->
    <section id="parallax-section" class="parallax-section">
      <div class="map-container">
        <div id="map"></div>
      </div>
    </section>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customPin from '/logos/marker.webp';
import '@fortawesome/fontawesome-free/css/all.css'; // Importa FontAwesome CSS
import '@fortawesome/fontawesome-free/js/all.js'; // Importa FontAwesome JS

export default {
  name: 'ImprovedMapPage',
  data() {
    return {
      map: null,
      customIcon: null,
      groups: [],
      groupLookup: {},
      pollingInterval: null, // Aggiunto per gestire l'intervallo di polling
    };
  },
  mounted() {
    // Inizializza l'icona personalizzata
    this.customIcon = new L.Icon({
      iconUrl: customPin,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    // Inizializza la mappa dopo che il DOM è pronto
    this.$nextTick(() => {
      this.initMap();
      this.fetchData(); // Fetch iniziale

      // Imposta il polling per aggiornare i dati ogni 30 secondi (30000 ms)
      this.pollingInterval = setInterval(this.fetchData, 30000);
    });
  },
  beforeUnmount() {
    // Pulisce l'intervallo di polling quando il componente viene distrutto
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  },
  methods: {
    scrollToMap() {
      const mapSection = document.getElementById('parallax-section');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
    initMap() {
      this.map = L.map('map', {
        center: [41.9028, 12.4964], // Centra sull'Italia
        zoom: 5,
        layers: [
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
          }),
        ],
      });
    },
    buildGroupLookup() {
      this.groups.forEach((group) => {
        const cities = this.extractCitiesFromGroupName(group.group_name);
        cities.forEach((city) => {
          const normalizedCity = city.toLowerCase();
          if (this.groupLookup[normalizedCity]) {
            this.groupLookup[normalizedCity].push(group);
          } else {
            this.groupLookup[normalizedCity] = [group];
          }
        });
      });
      console.log('Group Lookup:', this.groupLookup);
    },
    extractCitiesFromGroupName(groupName) {
      // Supponiamo che le città siano separate da '-'
      // Esempio: "BitcoinBeer Firenze-Prato⚡️" -> ["Firenze", "Prato"]
      // E "Bitcoin Parma" -> ["Parma"]
      const parts = groupName.split('-');
      const cities = [];

      parts.forEach((part) => {
        // Rimuove "BitcoinBeer" o "Bitcoin" se presente
        const cleanedPart = part.replace(/Bitcoin(?:Beer)?\s*/i, '').trim();
        // Rimuove eventuali caratteri speciali
        const city = cleanedPart.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim();
        if (city) {
          cities.push(city);
        }
      });

      return cities;
    },
    addMarkers(data) {
      // Rimuovi i marker esistenti prima di aggiungerne di nuovi
      if (this.markersLayer) {
        this.map.removeLayer(this.markersLayer);
      }
      this.markersLayer = L.layerGroup().addTo(this.map);

      data.forEach((community) => {
        const latitude = parseFloat(community.latitude);
        const longitude = parseFloat(community.longitude);

        // Verifica se latitude e longitude sono validi
        if (isNaN(latitude) || isNaN(longitude)) {
          console.warn(`Coordinate non valide per la community: ${community.city}`);
          return;
        }

        const marker = L.marker([latitude, longitude], { icon: this.customIcon }).addTo(this.markersLayer);

        // Estrarre la città dal campo "city"
        const communityCity = this.extractCityFromCommunity(community.city);
        const normalizedCommunityCity = communityCity.toLowerCase();

        // Verificare se esiste un gruppo associato a questa città
        const associatedGroups = this.groupLookup[normalizedCommunityCity] || [];

        console.log(`Community: ${communityCity}, Groups:`, associatedGroups);

        // Costruire il contenuto del popup
        let popupContent = `
          <div class="map-popup">
            <div class="popup-header">
            <img src="/logos/marker.webp" alt="Logo" class="popup-logo"/>              <h3 class="popup-title">${community.city}</h3>
            </div>
            <div class="popup-separator"></div>
            ${community.bio ? `<p class="popup-bio">${community.bio}</p>` : ''}
        `;

        // Se ci sono gruppi associati, aggiungi le info dei gruppi
        if (associatedGroups.length > 0) {
          popupContent += `<div class="groups-section"><h4 class="groups-title">Gruppo di riferimento</h4>`;
          associatedGroups.forEach((group) => {
            popupContent += `
              <div class="group-info">
                <h5 class="group-name">${group.group_name}</h5>
                <p><strong>Admin:</strong> ${group.administrators.map(admin => admin.first_name).join(', ')}</p>
                <p><strong>Utenti:</strong> ${group.user_count}</p>
                <p><strong>Messaggi:</strong> ${group.message_count}</p>
              </div>
            `;
          });
          popupContent += `</div>`;
        }

        // Aggiungi le icone social come già fatto
        popupContent += `
            <div class="popup-social">
              ${community.telegram ? `<a href="${community.telegram}" target="_blank" title="Telegram"><i class="fab fa-telegram-plane"></i></a>` : ''}
              ${community.instagram ? `<a href="${community.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
              ${community.x ? `<a href="${community.x}" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
              ${community.mastodon ? `<a href="${community.mastodon}" target="_blank" title="Mastodon"><i class="fab fa-mastodon"></i></a>` : ''}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
      });
    },
    extractCityFromCommunity(cityField) {
      // Supponendo che il formato sia "Città, Regione, Paese"
      // Esempio: "Parma, Emilia-Romagna, Italia" -> "Parma"
      const parts = cityField.split(',');
      return parts[0].trim();
    },
    changeLanguage(lang) {
      this.$i18n.locale = lang;
    },
    // Nuovo metodo per il polling
    fetchData() {
      const communitiesUrl = 'https://api.bitcoinbeer.events/data/communities.json';
      const groupsUrl = 'https://api.bitcoinbeer.events/data/group_data.json';

      // Recupera entrambi i JSON in parallelo
      Promise.all([fetch(communitiesUrl), fetch(groupsUrl)])
        .then(async ([communitiesRes, groupsRes]) => {
          if (!communitiesRes.ok) {
            throw new Error('Errore nel recupero di communities.json');
          }
          if (!groupsRes.ok) {
            throw new Error('Errore nel recupero di group_data.json');
          }
          const communitiesData = await communitiesRes.json();
          const groupsData = await groupsRes.json();

          // Verifica se ci sono cambiamenti nei gruppi
          if (JSON.stringify(this.groups) !== JSON.stringify(groupsData.groups)) {
            this.groups = groupsData.groups;
            this.buildGroupLookup();
          }

          // Aggiorna i marker sulla mappa
          this.addMarkers(communitiesData);
        })
        .catch((error) => {
          console.error('Errore nel recupero dei dati:', error);
        });
    },
  },
};
</script>


<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  height: 100vh; /* Occupa l'intera altezza dello schermo */
  background-color: #000; /* Sfondo nero profondo */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  overflow: hidden;
}

.hero-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/assets/world.webp'); /* Sostituisci con il percorso corretto */
  background-size: cover;
  background-position: center;
  opacity: 0.3; /* Regola l'opacità secondo necessità */
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 20px;
}

.hero-content h1 {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
}

.hero-content p {
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.6);
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  font-size: 2rem;
  color: #fff;
  animation: bounce 2s infinite;
  cursor: pointer;
  z-index: 2;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Parallax Section */
.parallax-section {
  /* Effetto Parallax */
  background-image: url('/assets/background-map.webp'); /* Sostituisci con il percorso corretto */
  height: 100vh;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Map Container */
.map-container {
  background: rgba(255, 255, 255, 0.1); /* Semi-trasparente per effetto glassmorphism */
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); /* Effetto ombra */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 20px;
  width: 80%;
  max-width: 800px;
  height: 80%;
  max-height: 600px;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
</style>
