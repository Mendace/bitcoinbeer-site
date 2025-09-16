<template>
  <section class="relative w-full min-h-screen bg-gray-900 text-white overflow-hidden">
    <!-- Contenitore principale -->
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 h-full px-6">
      <!-- Testo a sinistra -->
      <div class="space-y-6 text-center md:text-left">
        <h2 class="text-4xl font-bold">{{ $t("dashboard.title") }}</h2>
        <p class="text-lg text-gray-300">
          {{ $t("dashboard.subtitle") }}
        </p>
        <ul class="list-disc list-inside text-gray-400 space-y-2">
          <li>{{ $t("dashboard.feature1") }}</li>
          <li>{{ $t("dashboard.feature2") }}</li>
          <li>{{ $t("dashboard.feature3") }}</li>
          <li>{{ $t("dashboard.feature4") }}</li>
        </ul>
        <router-link to="/dashboard"
        class="relative inline-block py-3 px-6 font-bold text-white border border-white rounded-full overflow-hidden group focus:outline-none focus:ring-4 focus:ring-orange-500">
        <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          <span class="relative z-10">{{ $t("dashboard.cta") }}</span>
        </router-link>

      </div>

      <!-- Immagine e card a destra -->
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- Immagine del tablet -->
        <img src="/assets/tablet.webp" alt="Dashboard"
          class="z-10 w-full max-w-[400px] md:max-w-[500px] rounded-lg shadow-lg" />

        <!-- Card galleggianti -->
        <div v-for="(card, index) in cards" :key="index" class="absolute floating-card" :style="card.style">
          <div class="card-content p-4 rounded-lg glass-background">
            <h3 class="text-sm font-bold">{{ $t(card.title) }}</h3>
            <p class="text-xs text-gray-300">
              {{ $t(card.description) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      cards: [
        {
          title: "dashboard.card1Title",
          description: "dashboard.card1Description",
          style: {
            top: "5%",
            left: "40%",
            animationDelay: "0s",
          },
        },
        {
          title: "dashboard.card2Title",
          description: "dashboard.card2Description",
          style: {
            top: "30%",
            left: "60%",
            animationDelay: "1s",
          },
        },
        {
          title: "dashboard.card3Title",
          description: "dashboard.card3Description",
          style: {
            bottom: "30%",
            left: "5%",
            animationDelay: "2s",
          },
        },
        {
          title: "dashboard.card4Title",
          description: "dashboard.card4Description",
          style: {
            bottom: "5%",
            right: "20%",
            animationDelay: "3s",
          },
        },
      ],
    };
  },
};
</script>


<style scoped lang="css">
/* Sfondo elegante scuro */
section {
  background: linear-gradient(135deg, #000000, #121212);
  /* Sfondo elegante scuro */
  padding: 1.5rem 0;
}

/* Immagine principale */
img {
  object-fit: contain;
  width: 100%;
  max-width: 500px;
  height: auto;
  transition: transform 0.3s ease-in-out;
  z-index: 0;
}

img:hover {
  transform: scale(1.05);
}

/* Card galleggianti */
.floating-card {
  animation: float 4s infinite ease-in-out;
  position: absolute;
  width: 200px;
  /* Dimensione standard */
  height: auto;
  /* Mantieni proporzione */
  max-width: 100%;
  /* Non supera il contenitore */
}

/* Effetto vetro */
.glass-background {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s ease;
  padding: 1rem;
  /* Adatta il padding */
  font-size: 0.9rem;
  /* Riduci la dimensione del font */
}

.card-content:hover {
  transform: scale(1.1);
}

/* Animazione fluttuante */
@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
  }

  50% {
    transform: translateY(-10px) translateX(5px);
  }

  100% {
    transform: translateY(0) translateX(0);
  }
}

/* Media query per dispositivi mobili */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  img {
    max-width: 300px;
    margin-bottom: 1.5rem;
  }

  .floating-card {
    display: none;
  }


  @keyframes floatMobile {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-5px);
    }

    100% {
      transform: translateY(0);
    }
  }
}
</style>