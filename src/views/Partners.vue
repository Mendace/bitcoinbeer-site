<template>
    <section class="partners-section bg-gray-900 text-white py-12">
      <div class="container mx-auto px-6">
        <!-- Titolo -->
        <div class="text-center mb-8 main">
          <h2 class="text-4xl font-bold">{{ $t('partners.title') }}</h2>
          <p class="text-lg text-gray-300 mt-2">{{ $t('partners.subtitle') }}</p>
        </div>
  
        <!-- Loghi Importanti -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <a
            v-for="(logo, index) in mainLogos"
            :key="'main-' + index"
            :href="logo.url"
            target="_blank"
            rel="noopener noreferrer"
            class="partner-box flex items-center justify-center bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <img 
              :src="logo.src" 
              :alt="logo.alt" 
              class="w-3/4 h-auto grayscale hover:grayscale-0 transition duration-300"
            />
          </a>
        </div>
  
        <!-- Loghi Secondari -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <a
            v-for="(logo, index) in secondaryLogos"
            :key="'secondary-' + index"
            :href="logo.url"
            target="_blank"
            rel="noopener noreferrer"
            class="partner-box flex items-center justify-center bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <img 
              :src="logo.src" 
              :alt="logo.alt" 
              class="w-full h-auto grayscale hover:grayscale-0 transition duration-300"
            />
          </a>
        </div>
      </div>
    </section>
  </template>
  
  
  
  <script>
  export default {
    name: "PartnersSection",
    data() {
      return {
        mainLogos: [
          { src: "/logos/BitBox.webp", alt: "Logo Bitbox by ShifthCrypto", url: "https://bitbox.swiss/it/bitbox02/?utm_source=bitcoinbeer&utm_medium=webcast&utm_campaign=landingpage&ref=XiwIgfY4X6mvWS" },
          { src: "/logos/btcpeople.webp", alt: "Logo Bitcoin People", url: "https://bitcoinpeople.it/" },
        ],
        secondaryLogos: [
          { src: "/logos/dtv.webp", alt: "Logo DTV Electronics", url: "https://dtvelectronics.com" },
          { src: "/logos/lanarchico.webp", alt: "Logo Lanarchico Prato", url: "https://linktr.ee/lanarchico" },
          { src: "/logos/Awning.webp", alt: "Logo Awning", url: "https://github.com/giovantenne/awning" },
        ],
      };
    },
  };
  </script>
  
  
  
  <style scoped>
  .partners-section {
    background: linear-gradient(to bottom, #000000, #040311);
  }

  .main{
    margin-top: 6rem;
  }
  
  .partner-box {
    transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
  }
  
  .partner-box:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
  
  .partner-box img {
    transition: filter 0.3s ease;
  }
  
  .partner-box img:hover {
    filter: grayscale(0);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .grid-cols-2 {
      grid-template-columns: 1fr;
    }
  
    .grid-cols-4 {
      grid-template-columns: 1fr 1fr;
    }
  }
  </style>
  
  