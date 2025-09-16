<script setup>
import { useHead } from '@vueuse/head';

useHead({
  title: 'Bitcoin Beer Dashboard - Gestisci Eventi e Community con Facilità',
  meta: [
    { name: 'description', content: 'Organizza eventi, gestisci biglietti e monitora la tua community locale con la dashboard Bitcoin Beer. Strumenti potenti per far crescere la tua community Bitcoin.' },
    { name: 'keywords', content: 'Bitcoin, Dashboard, Gestione Eventi, Community Bitcoin, Biglietti Eventi Bitcoin, Analisi Community, Crescita Bitcoin' },
    { name: 'author', content: 'BitcoinBeer' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: 'Italian' },
    { name: 'revisit-after', content: '7 days' },
    { property: 'og:title', content: 'Bitcoin Beer Dashboard - Gestisci Eventi e Community con Facilità' },
    { property: 'og:description', content: 'Utilizza la dashboard Bitcoin Beer per creare eventi, gestire biglietti e far crescere la tua community locale con strumenti di analisi avanzati.' },
    { property: 'og:image', content: '/assets/dashboard.webp' },
    { property: 'og:url', content: 'https://bitcoinbeer.events/dashboard' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'it_IT' },
    { property: 'og:site_name', content: 'Bitcoin Beer Dashboard' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Bitcoin Beer Dashboard - Gestisci Eventi e Community con Facilità' },
    { name: 'twitter:description', content: 'Crea eventi, gestisci biglietti e monitora la tua community Bitcoin con la dashboard Bitcoin Beer.' },
    { name: 'twitter:image', content: '/assets/dashboard.webp' },
    { name: 'twitter:site', content: '@BitcoinBeerIT' },
    { name: 'twitter:creator', content: '@BitcoinBeerIT' },
  ],
  link: [
    { rel: 'canonical', href: 'https://bitcoinbeer.events/dashboard' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Bitcoin Beer Dashboard',
        description: 'Organizza eventi, gestisci biglietti e monitora la tua community locale con la dashboard Bitcoin Beer.',
        url: 'https://bitcoinbeer.events/dashboard',
        mainEntity: {
          '@type': 'SoftwareApplication',
          name: 'Bitcoin Beer Dashboard',
          description: 'Strumenti avanzati per la gestione di eventi e community Bitcoin.',
          applicationCategory: 'Utility',
          operatingSystem: 'All',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'BTC',
            url: 'https://bitcoinbeer.events/dashboard'
          },
          featureList: [
            'Analisi in Tempo Reale',
            'Gestione Eventi',
            'Aggiornamenti Community',
            'Pianificazione della Crescita'
          ],
          screenshot: '/assets/dashboard.webp'
        }
      }),
    },
  ],
});
</script>

<template>
  <div class="dashboard-page">
    <!-- Hero Section -->
    <section class="hero relative bg-black text-white flex items-center h-screen overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>

      <div class="relative z-10 flex flex-col md:flex-row items-center w-full max-w-screen-xl mx-auto px-8">
        <!-- Testo -->
        <div class="text-content md:w-1/2 text-left text">
          <h1 class="text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">
            {{ $t('dashboardpage.heroTitle') }}
          </h1>
          <p class="text-lg mb-8 opacity-80">
            {{ $t('dashboardpage.heroSubtitle') }}
          </p>
          <a
            href="https://t.me/+m7F8BCFwODc5ODhk"
            target="_blank"
            rel="noopener noreferrer"
            class="relative inline-block py-3 px-6 font-bold text-white border border-white rounded-full overflow-hidden group focus:outline-none focus:ring-4 focus:ring-orange-500">
            <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            <span class="relative z-10">{{ $t('dashboardpage.tryNowButton') }}</span>
          </a>
        </div>

        <!-- Immagine dello Smartphone -->
        <div class="image-content md:w-1/2 relative flex justify-center items-end">
          <img
            src="/assets/dashsmart.png"
            alt="{{ $t('dashboardpage.heroImageAlt') }}"
            class="w-full max-w-sm h-auto object-cover rounded-t-2xl border border-white-700 shadow-lg" style="margin-top: 120px;"
          />
        </div>
      </div>
    </section>
    <!-- Video Section -->
    <section class="video-section py-20 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div class="container mx-auto px-8 text-center">
        <div class="video-wrapper max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <!-- Video -->
          <video
            autoplay
            loop
            muted
            playsinline
            class="w-full h-auto rounded-lg shadow-lg"
            poster="/assets/tablet.webp"
          >
            <source src="/video/dashboard.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section py-20 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div class="container mx-auto px-8">
        <h2 class="text-4xl font-semibold text-center mb-12">
          {{ $t('dashboardpage.featuresTitle') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Feature Cards -->
          <div class="feature-card bg-gray-800 p-6 rounded shadow-lg text-center">
            <h3 class="text-2xl font-bold mb-4">
              {{ $t('dashboardpage.feature1Title') }}
            </h3>
            <p class="text-sm opacity-75">
              {{ $t('dashboardpage.feature1Desc') }}
            </p>
          </div>
          <div class="feature-card bg-gray-800 p-6 rounded shadow-lg text-center">
            <h3 class="text-2xl font-bold mb-4">
              {{ $t('dashboardpage.feature2Title') }}
            </h3>
            <p class="text-sm opacity-75">
              {{ $t('dashboardpage.feature2Desc') }}
            </p>
          </div>
          <div class="feature-card bg-gray-800 p-6 rounded shadow-lg text-center">
            <h3 class="text-2xl font-bold mb-4">
              {{ $t('dashboardpage.feature3Title') }}
            </h3>
            <p class="text-sm opacity-75">
              {{ $t('dashboardpage.feature3Desc') }}
            </p>
          </div>
          <div class="feature-card bg-gray-800 p-6 rounded shadow-lg text-center">
            <h3 class="text-2xl font-bold mb-4">
              {{ $t('dashboardpage.feature4Title') }}
            </h3>
            <p class="text-sm opacity-75">
              {{ $t('dashboardpage.feature4Desc') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "DashboardPage",
};
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  padding-top: 70px;
}

.text-content {
  z-index: 10;
  text-align: left;
}

.image-content {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

img {
  display: block;
  width: 100%;
  max-width: 350px;
  height: auto;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
  border: 2px solid #444;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
}

/* Responsive Mobile */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 100px;
  }

  .text-content {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 3rem;
  }

  .image-content {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  img {
    width: 95%;
    max-width: 320px;
    margin-top: -50%;
  }
}
</style>
