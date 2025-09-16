<template>
    <section class="coming-soon-page h-screen flex items-center justify-center bg-gray-900 text-white">
      <div class="text-center">
        <h1 class="text-5xl font-bold mb-4">{{ $t("comingSoon.title") }}</h1>
        <p class="text-lg text-gray-300 mb-6">{{ $t("comingSoon.description") }}</p>
        <router-link
          to="/"
          class="px-6 py-3 bg-orange-500 text-black font-semibold text-lg rounded-lg shadow-lg hover:bg-orange-400 transition-transform transform hover:scale-105"
        >
          {{ $t("comingSoon.backToHome") }}
        </router-link>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: "ComingSoonPage",
  };
  </script>
  
  <style scoped>
  .coming-soon-page {
    background-image: url("/src/assets/hero.jpg");
    background-size: cover;
    background-position: center;
    background-blend-mode: overlay;
    background-color: rgba(0, 0, 0, 0.7);
  }
  </style>
  