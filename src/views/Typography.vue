<template>
    <div class="typography-page">
      <!-- Hero Section -->
      <section class="hero bg-white py-12">
        <div class="container mx-auto px-8 main">
          <h1 class="text-4xl font-bold text-black mb-4">
            {{ $t('typography.mainTitle') }}
          </h1>
          <p class="text-lg text-gray-700">
            {{ $t('typography.description') }}
          </p>
        </div>
      </section>
  
      <!-- Main Font Section -->
      <section class="main-font bg-gray-100 py-16">
        <div class="container mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Font Preview -->
          <div class="font-preview text-center">
            <h2 class="text-9xl font-bold mb-4">Aa</h2>
            <p class="text-2xl font-semibold">Poppins</p>
          </div>
  
          <!-- Font Details -->
          <div class="font-details">
            <h3 class="text-2xl font-bold mb-4">{{ $t('typography.fontDetailsTitle') }}</h3>
            <ul class="text-lg text-gray-700 mb-6">
              <li>{{ $t('typography.useWeb') }}</li>
              <li>{{ $t('typography.usePrint') }}</li>
              <li>{{ $t('typography.usePresentation') }}</li>
            </ul>
            <a
              href="https://fonts.google.com/specimen/Poppins"
              class="inline-block bg-blue-600 text-white font-semibold text-lg px-6 py-3 rounded hover:bg-blue-500"
              download
            >
              {{ $t('typography.downloadFont') }}
            </a>
          </div>
        </div>
      </section>
  
      <!-- Font Specifications -->
      <section class="font-specifications bg-white py-16">
        <div class="container mx-auto px-8">
          <h3 class="text-2xl font-bold mb-8">{{ $t('typography.specificationsTitle') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="specification bg-gray-100 p-6 rounded shadow">
              <h4 class="font-bold mb-2">{{ $t('typography.weight') }}</h4>
              <p>{{ $t('typography.weightDesc') }}</p>
            </div>
            <div class="specification bg-gray-100 p-6 rounded shadow">
              <h4 class="font-bold mb-2">{{ $t('typography.style') }}</h4>
              <p>{{ $t('typography.styleDesc') }}</p>
            </div>
            <div class="specification bg-gray-100 p-6 rounded shadow">
              <h4 class="font-bold mb-2">{{ $t('typography.size') }}</h4>
              <p>{{ $t('typography.sizeDesc') }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: "TypographyPage",
  };
  </script>
  
  <style scoped>
  .hero {
    background: linear-gradient(to bottom, #fff, #f9f9f9);
  }
  .main{
    margin-top: 8rem;
  }
  
  .main-font .font-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .main-font .font-details ul {
    list-style-type: disc;
    padding-left: 1rem;
  }
  </style>
  