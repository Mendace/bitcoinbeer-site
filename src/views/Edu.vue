<script setup>
import { useHead } from '@vueuse/head';

useHead({
  title: 'Bitcoin Beer EDU - Meetup Educativi su Bitcoin con Speaker di Alto Livello',
  meta: [
    { name: 'description', content: 'Partecipa ai meetup educativi di Bitcoin Beer EDU: eventi unici con speaker esperti da tutta Italia. Scopri il mondo Bitcoin con approfondimenti di alto livello.' },
    { name: 'keywords', content: 'Bitcoin, Educazione Bitcoin, Meetup Bitcoin, Speaker Bitcoin, Eventi Educativi, Blockchain, Bitcoin Italia, Bitcoin Beer EDU' },
    { name: 'author', content: 'BitcoinBeerEDU' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: 'Italian' },
    { name: 'revisit-after', content: '7 days' },
    { property: 'og:title', content: 'Bitcoin Beer EDU - Meetup Educativi su Bitcoin con Speaker di Alto Livello' },
    { property: 'og:description', content: 'Scopri Bitcoin Beer EDU: meetup educativi su Bitcoin con speaker esperti da tutta Italia. Approfondimenti esclusivi per appassionati e professionisti.' },
    { property: 'og:image', content: '/assets/edu.webp' },
    { property: 'og:url', content: 'https://bitcoinbeer.events/edu' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'it_IT' },
    { property: 'og:site_name', content: 'Bitcoin Beer EDU' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Bitcoin Beer EDU - Meetup Educativi su Bitcoin con Speaker di Alto Livello' },
    { name: 'twitter:description', content: 'Partecipa ai meetup educativi su Bitcoin con speaker di alto livello da tutta Italia. Approfondisci il mondo Bitcoin con Bitcoin Beer EDU.' },
    { name: 'twitter:image', content: '/assets/edu.webp' },
    { name: 'twitter:site', content: '@BitcoinBeerIT' },
    { name: 'twitter:creator', content: '@BitcoinBeerIT' },
  ],
  link: [
    { rel: 'canonical', href: 'https://bitcoinbeer.events/edu' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Bitcoin Beer EDU',
        description: 'Partecipa ai meetup educativi di Bitcoin Beer EDU: eventi unici con speaker esperti da tutta Italia.',
        startDate: '{{ event.start_date }}',
        endDate: '{{ event.end_date }}',
        location: {
          '@type': 'Place',
          name: '{{ event.location_name }}',
          address: {
            '@type': 'PostalAddress',
            addressLocality: '{{ event.city }}',
            addressCountry: 'IT'
          }
        },
        image: '/assets/edu.webp',
        organizer: {
          '@type': 'Organization',
          name: 'Bitcoin Beer',
          url: 'https://bitcoinbeer.events'
        },
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        offers: {
          '@type': 'Offer',
          price: '{{ event.price }}',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: 'https://bitcoinbeer.events/edu/{{ event.id }}'
        }
      }),
    },
  ],
});
</script>

<template>
    <transition name="fade">
    <router-view />
   </transition>
  <section class="edu-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('edu.title') }}</h1>
        <p class="hero-description">{{ $t('edu.description') }}</p>
      </div>
      <img src="/assets/gufo.webp" alt="EDU Owl" class="hero-image" />
    </div>

    <!-- Info Section -->
    <div class="info-section">
      <div class="info-block">
        <h2>{{ $t('edu.section1Title') }}</h2>
        <p>{{ $t('edu.section1Description') }}</p>
      </div>
      <div class="info-block">
        <h2>{{ $t('edu.section2Title') }}</h2>
        <p>{{ $t('edu.section2Description') }}</p>
      </div>
    </div>

    <!-- Gallery Section -->
    <div class="gallery-section">
      <h2>{{ $t('edu.galleryTitle') }}</h2>
      <div class="gallery">
        <img v-for="(image, index) in images" :key="index" :src="image.src" :alt="image.alt" class="gallery-image" />
      </div>
    </div>

    <!-- Event Details -->
    <event-details category="edu" />
  </section>
</template>

<script>
import EventDetails from '/src/components/EventDetail.vue';

export default {
  name: 'EduPage',
  components: {
    EventDetails,
  },
  data() {
    return {
      images: [
        { src: '/assets/edu/DSC01623.webp', alt: 'meetup edu Prato novembre 2024' },
        { src: '/assets/edu/DSC01642.webp', alt: 'meetup edu Prato novembre 2024' },
        { src: '/assets/edu/DSC01684.webp', alt: 'meetup edu Prato novembre 2024' },
      ],
    };
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


/* EDU PAGE */
.edu-page {
  font-family: 'Arial', sans-serif;
  color: #f5f5f5;
  background: linear-gradient(to bottom, #1a3d34, #0c1e17);
  overflow-x: hidden;
}

/* HERO SECTION */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  overflow: hidden;
}

.hero-content {
  z-index: 2;
  max-width: 600px;
  text-align: left;
  animation: fadeInUp 1.2s ease-in-out;
}

.hero-title {
  margin-top: 5rem;
  font-size: 3.5rem;
  font-weight: bold;
  color: #2b8c69;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
}

.hero-description {
  font-size: 1.5rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
}

.cta-button {
  display: inline-block;
  padding: 12px 24px;
  background: #f5f5f5;
  color: #2b8c69;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* HERO IMAGE */
.hero-image {
  position: absolute;
  bottom: -10px;
  right: 5%;
  max-width: 450px;
  height: auto;
  object-fit: contain;
  animation: zoomIn 1.5s ease-in-out;
}

/* INFO SECTION */
.info-section {
  background: #0c1e17;
  padding: 60px 5%;
  text-align: center;
}

.info-block h2 {
  font-size: 2.5rem;
  color: #2b8c69;
  margin-bottom: 1rem;
}

.info-block p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
}

/* GALLERY SECTION */
.gallery-section {
  padding: 60px 5%;
  background: #1a3d34;
  text-align: center;
}

.gallery-section h2 {
  font-size: 2.5rem;
  color: #f5f5f5;
  margin-bottom: 2rem;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.gallery-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

/* ANIMATIONS */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* RESPONSIVITY */
@media (max-width: 768px) {
  .hero-section {
    margin-top: 5em;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-content {
    max-width: 100%;
    margin-bottom: 20px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.2rem;
  }

  .hero-image {
    max-width: 300px;
  }

  .gallery-image {
    width: 100%;
    height: auto;
  }
}
</style>
