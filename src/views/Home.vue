<template>
  <div>
    <!-- Loader -->
    <div v-if="isLoading" class="loading-screen">
      <img src="/logos/marker.webp" alt="Logo" class="spinner" />
    </div>

    <!-- Contenuto della Home -->
    <div v-else class="main">
      <HeroSection />
      <BrandCarousel />
      <EventDetail />
      <Reel />
      <Details />
      <CardsFloat />
      <Chapter />
      <Stats />
      <FyndraSearch />
      <Donation />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import HeroSection from "../components/HeroSection.vue";
import BrandCarousel from "../components/BrandCarousel.vue";
import EventDetail from "../components/EventDetail.vue";
import Reel from "../components/Reel.vue";
import Details from "../components/Details.vue";
import CardsFloat from "../components/CardsFloat.vue";
import Chapter from "../components/Chapter.vue";
import Stats from "../components/Stats.vue";
import Donation from "../components/Donation.vue";
import FyndraSearch from "../components/FyndraSearch.vue";

export default {
  name: "Home",
  components: {
    HeroSection,
    BrandCarousel,
    EventDetail,
    Reel,
    Details,
    CardsFloat,
    Chapter,
    Stats,
    FyndraSearch,
    Donation,
  },
  setup() {
    const isLoading = ref(true);

    onMounted(() => {
      // Simula un tempo di caricamento (ad esempio, 2 secondi)
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    });

    return { isLoading };
  },
};

console.log(

"%c ███████╗  ██████╗ █████╗ ███╗   ███╗\n" +           
  " ██╔════╝ ██╔════╝██╔══██╗████╗ ████║\n" +	
  " ██████╗░ ██║     ███████║██╔████╔██║\n" +    
  " ╚═══██╗░ ██║     ██╔══██║██║╚██╔╝██║\n" +
  " ██████║░ ╚██████╗██║  ██║██║ ╚═╝ ██║\n" +
  " ╚═════╝   ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝\n",
    "color: #FF0000; font-family: monospace; font-size: 16px; font-weight: bold;"
  );

console.log(
  "%c🚨 Teniamo lontano un Craig Wright come te!\n" +
  "🔒 Questo sito protegge il suo codice sorgente per garantire sicurezza e integrità.\n" +
  "💡 %cSe vuoi saperne di più, visita il nostro sito ufficiale!",
  "color: #FFD700; font-size: 16px; font-weight: bold;",
  "color: #00FFFF; font-size: 14px;"
);
</script>

<style scoped>
/* Stile per lo spinner */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black; /* Sfondo nero */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.main {
  background-color: black;
}

.spinner {
  width: 100px;
  height: 100px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
