<template>
  <div class="brand-page bg-black text-white min-h-screen">
    <!-- Hero Section -->
    <section class="hero relative h-60 bg-gradient-to-b from-gray-900 to-black text-center flex items-center justify-center">
      <h1 class="text-5xl font-bold">{{ $t('brandPage.title') }}</h1>
    </section>

    <!-- Cards Section -->
    <section class="cards-section py-20 px-4">
      <div class="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Logos Card -->
        <router-link to="/logos" class="card bg-gray-800 hover:bg-gray-700 transition rounded-lg overflow-hidden">
          <div class="p-6 text-center">
            <div class="text-5xl font-bold mb-4">BB</div>
            <h3 class="text-xl font-semibold">{{ $t('brandPage.logosTitle') }}</h3>
            <p class="text-sm mt-2">{{ $t('brandPage.logosDescription') }}</p>
          </div>
        </router-link>

        <!-- Typography Card -->
        <router-link to="/typography" class="card bg-purple-600 hover:bg-purple-500 transition rounded-lg overflow-hidden">
          <div class="p-6 text-center">
            <div class="text-5xl font-bold mb-4 text-white">Aa</div>
            <h3 class="text-xl font-semibold text-white">{{ $t('brandPage.typographyTitle') }}</h3>
            <p class="text-sm mt-2 text-white">{{ $t('brandPage.typographyDescription') }}</p>
          </div>
        </router-link>

        <!-- Colors Card -->
        <router-link to="/colors" class="card bg-gray-800 hover:bg-gray-700 transition rounded-lg overflow-hidden">
          <div class="p-6 text-center">
            <div class="flex justify-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-orange-500 rounded"></div>
              <div class="w-8 h-8 bg-black rounded border"></div>
              <div class="w-8 h-8 bg-yellow-400 rounded"></div>
            </div>
            <h3 class="text-xl font-semibold">{{ $t('brandPage.colorsTitle') }}</h3>
            <p class="text-sm mt-2">{{ $t('brandPage.colorsDescription') }}</p>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'BrandPage',
};
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #1a1a1a, #000000);
}

.cards-section {
  background-color: #121212;
}

.card {
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}
</style>
