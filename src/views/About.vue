<template>
    <section class="about-page bg-gray-900 text-white">
      <!-- Hero Section -->
      <div class="hero relative h-80 bg-black text-white flex items-center justify-center">
        <!-- Layer Sovrapposto -->
        <div class="overlay absolute inset-0 bg-black bg-opacity-50"></div>
        <!-- Contenuto Hero -->
        <div class="text-center relative z-10">
          <h1 class="text-5xl font-bold">{{ $t("about.heroTitle") }}</h1>
          <p class="text-lg text-gray-300 mt-2">{{ $t("about.heroSubtitle") }}</p>
        </div>
      </div>
  
      <!-- Mission Section -->
      <div class="mission-section py-16 bg-gray-800 text-gray-300">
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-4xl font-bold mb-6">{{ $t("about.missionTitle") }}</h2>
          <p class="text-lg leading-relaxed max-w-4xl mx-auto">
            {{ $t("about.missionDescription") }}
          </p>
        </div>
      </div>
  
      <!-- Community Section -->
      <div class="community-section py-16 bg-gradient-to-b from-gray-800 via-gray-900 to-black">
        <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="text-content space-y-6">
            <h2 class="text-4xl font-bold">{{ $t("about.communityTitle") }}</h2>
            <p class="text-lg text-gray-300">
              {{ $t("about.communityDescription") }}
            </p>
            <ul class="list-disc list-inside text-gray-400 space-y-2">
              <li>{{ $t("about.communityPoint1") }}</li>
              <li>{{ $t("about.communityPoint2") }}</li>
              <li>{{ $t("about.communityPoint3") }}</li>
            </ul>
          </div>
          <div class="image-content">
            <img
              src="/assets/edu/DSC01642.webp"
              alt="Community"
              class="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
  
      <!-- Call to Action -->
      <div class="cta-section py-16 bg-orange-500 text-black text-center">
        <div class="container mx-auto px-6">
          <h2 class="text-4xl font-bold mb-4">{{ $t("about.ctaTitle") }}</h2>
          <p class="text-lg mb-6">{{ $t("about.ctaDescription") }}</p>
          <router-link
            to="/contact"
            class="px-6 py-3 bg-black text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-105"
          >
            {{ $t("about.ctaButton") }}
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: "AboutPage",
  };
  </script>
  
  <style scoped>
  .hero {
    background-image: url("/assets/edu/DSC01623.webp");
    background-size: cover;
    background-position: center;
    position: relative;
  }
  
  .overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .text-center {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  }
  
  .mission-section {
    background-color: #2d3748;
  }
  
  .community-section {
    background-color: #1a202c;
  }
  
  .cta-section {
    background: linear-gradient(135deg, #f1f1f1, #363636);
  }
  </style>
  