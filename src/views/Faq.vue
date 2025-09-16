<template>
    <section class="faq-page bg-gray-900 text-white">
      <!-- Hero Section -->
      <div class="hero relative h-80 bg-black flex items-center justify-center">
        <!-- Overlay per migliorare leggibilità -->
        <div class="overlay absolute inset-0 bg-black bg-opacity-50"></div>
        <!-- Testo Hero -->
        <div class="text-center relative z-10">
          <h1 class="text-5xl font-bold">{{ $t("faq.heroTitle") }}</h1>
          <p class="text-lg text-gray-300 mt-2">{{ $t("faq.heroSubtitle") }}</p>
        </div>
      </div>
  
      <!-- FAQ Section -->
      <div class="faq-section py-16">
        <div class="container mx-auto px-6 max-w-4xl">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item border-b border-gray-700 pb-4 mb-4"
          >
            <button
              @click="toggle(index)"
              class="flex justify-between items-center w-full text-left text-lg font-semibold py-2 focus:outline-none"
            >
              <span>{{ $t(faq.question) }}</span>
              <i
                :class="[
                  'fas transition-transform duration-300',
                  activeIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'
                ]"
              ></i>
            </button>
            <div
              v-if="activeIndex === index"
              class="text-gray-400 text-sm mt-2 transition-all duration-300"
            >
              <p>{{ $t(faq.answer) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: "FaqPage",
    data() {
      return {
        activeIndex: null,
        faqs: [
          { question: "faq.q1", answer: "faq.a1" },
          { question: "faq.q2", answer: "faq.a2" },
          { question: "faq.q3", answer: "faq.a3" },
          { question: "faq.q4", answer: "faq.a4" },
        ],
      };
    },
    methods: {
      toggle(index) {
        this.activeIndex = this.activeIndex === index ? null : index;
      },
    },
  };
  </script>
  
  <style scoped>
  .hero {
    background-image: url("/assets/hero.webp");
    background-size: cover;
    background-position: center;
    position: relative;
  }
  
  .overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .faq-item button {
    color: #fff;
  }
  
  .faq-item button:hover {
    color: #fbbf24; /* Orange highlight */
  }
  
  .faq-item {
    transition: all 0.3s ease;
  }
  
  .faq-item:hover {
    transform: scale(1.02);
  }
  </style>
  