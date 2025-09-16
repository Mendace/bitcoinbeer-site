<template>
  <div class="logos-page">
    <!-- Hero Section -->
    <section class="hero relative h-64 bg-black text-white flex items-center justify-center">
      <h1 class="text-4xl font-bold">{{ $t('logos.heroTitle') }}</h1>
    </section>

    <!-- Main Logos Section -->
    <section class="main-logos py-12 bg-gray-100">
      <div class="container mx-auto px-8">
        <h2 class="text-3xl font-semibold mb-6">{{ $t('logos.mainLogosTitle') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="logo-card bg-white shadow-lg rounded-lg p-6 text-center">
            <div class="logo-preview mb-4">
              <!-- Inserisci immagine logo principale -->
              <img src="/logos/bitcoinbeer.webp" alt="Bitcoin Beer Logo" class="h-20 mx-auto">
            </div>
            <h3 class="text-xl font-semibold">Bitcoin Beer Logo</h3>
            <a
              href="/src/assets/logos/bitcoinbeer.zip"
              download
              class="text-orange-500 hover:underline"
            >
              {{ $t('logos.download') }}
            </a>
          </div>

          <div class="logo-card bg-white shadow-lg rounded-lg p-6 text-center">
            <div class="logo-preview mb-4">
              <!-- Inserisci immagine simbolo principale -->
              <img src="/logos/marker.webp" alt="Bitcoin Beer Symbol" class="h-20 mx-auto">
            </div>
            <h3 class="text-xl font-semibold">Bitcoin Beer Symbol</h3>
            <a
              href="/src/assets/logos/marker.zip"
              download
              class="text-orange-500 hover:underline"
            >
              {{ $t('logos.download') }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- EDU Logos Section -->
    <section class="edu-logos py-12 bg-green-100">
      <div class="container mx-auto px-8">
        <h2 class="text-3xl font-semibold mb-6">{{ $t('logos.eduLogosTitle') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="logo-card bg-white shadow-lg rounded-lg p-6 text-center">
            <div class="logo-preview mb-4">
              <!-- Inserisci immagine logo EDU -->
              <img src="/assets/gufo.webp" alt="Bitcoin Beer EDU Logo" class="h-20 mx-auto">
            </div>
            <h3 class="text-xl font-semibold">Bitcoin Beer EDU Logo</h3>
            <a
              href="/src/assets/logos/gufo.zip"
              download
              class="text-orange-500 hover:underline"
            >
              {{ $t('logos.download') }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- PUB Logos Section -->
    <section class="pub-logos py-12 bg-red-100">
      <div class="container mx-auto px-8">
        <h2 class="text-3xl font-semibold mb-6">{{ $t('logos.pubLogosTitle') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="logo-card bg-white shadow-lg rounded-lg p-6 text-center">
            <div class="logo-preview mb-4">
              <!-- Inserisci immagine logo PUB -->
              <img src="/assets/bear.webp" alt="Bitcoin Beer PUB Logo" class="h-20 mx-auto">
            </div>
            <h3 class="text-xl font-semibold">Bitcoin Beer PUB Logo</h3>
            <a
              href="/src/assets/logos/bear.zip"
              download
              class="text-orange-500 hover:underline"
            >
              {{ $t('logos.download') }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
export default {
  name: "LogosPage",
};
</script>

<style scoped>
.hero {
  background-color: #000;
  color: #fff;
}

.logo-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.logo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.logo-preview {
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  border-radius: 8px;
}

.edu-logos {
  background-color: #e0f4e8;
}

.pub-logos {
  background-color: #fde4e9;
}
</style>
