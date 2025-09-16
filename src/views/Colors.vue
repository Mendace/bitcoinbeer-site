<template>
    <div class="color-page bg-white text-black">
      <!-- Hero Section -->
      <section class="hero py-16 bg-gray-900 text-white text-center">
        <div class="container mx-auto main">
          <h1 class="text-4xl font-bold mb-4">{{ $t("colors.heroTitle") }}</h1>
          <p class="text-lg opacity-75">{{ $t("colors.heroSubtitle") }}</p>
        </div>
      </section>
  
      <!-- Main Colors Section -->
      <section class="main-colors py-16">
        <div class="container mx-auto px-8">
          <h2 class="text-2xl font-bold mb-8">{{ $t("colors.mainColorsTitle") }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              v-for="(color, index) in mainColors"
              :key="index"
              class="color-card p-6 rounded-lg shadow-lg text-center cursor-pointer transition-transform transform hover:scale-105"
              :style="{ backgroundColor: color.hex }"
              @click="copyToClipboard(color.hex)"
            >
              <div class="text-white font-bold text-3xl mb-4">{{ color.name }}</div>
              <div class="text-white">
                <p><strong>HEX:</strong> {{ color.hex }}</p>
                <p><strong>RGB:</strong> {{ color.rgb }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Edu Colors Section -->
      <section class="edu-colors py-16">
        <div class="container mx-auto px-8">
          <h2 class="text-2xl font-bold mb-8">{{ $t("colors.eduColorsTitle") }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              v-for="(color, index) in eduColors"
              :key="index"
              class="color-card p-6 rounded-lg shadow-lg text-center cursor-pointer transition-transform transform hover:scale-105"
              :style="{ backgroundColor: color.hex }"
              @click="copyToClipboard(color.hex)"
            >
              <div class="text-white font-bold text-3xl mb-4">{{ color.name }}</div>
              <div class="text-white">
                <p><strong>HEX:</strong> {{ color.hex }}</p>
                <p><strong>RGB:</strong> {{ color.rgb }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Pub Colors Section -->
      <section class="pub-colors py-16">
        <div class="container mx-auto px-8">
          <h2 class="text-2xl font-bold mb-8">{{ $t("colors.pubColorsTitle") }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              v-for="(color, index) in pubColors"
              :key="index"
              class="color-card p-6 rounded-lg shadow-lg text-center cursor-pointer transition-transform transform hover:scale-105"
              :style="{ backgroundColor: color.hex }"
              @click="copyToClipboard(color.hex)"
            >
              <div class="text-white font-bold text-3xl mb-4">{{ color.name }}</div>
              <div class="text-white">
                <p><strong>HEX:</strong> {{ color.hex }}</p>
                <p><strong>RGB:</strong> {{ color.rgb }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
<script>
export default {
  name: "ColorsPage",
  data() {
    return {
      mainColors: [
        { name: "Primary", hex: "#F7931B", rgb: "247, 147, 27" },
        { name: "Black", hex: "#000000", rgb: "0, 0, 0" },
        { name: "Yellow", hex: "#f4c01a", rgb: "244, 192, 26" },
      ],
      eduColors: [
        { name: "Dark Green", hex: "#1A3D34", rgb: "26, 61, 52" },
        { name: "Highlight Green", hex: "#2B8C69", rgb: "43, 140, 105" },
        { name: "Pale White", hex: "#E0E0E0", rgb: "224, 224, 224" },
      ],
      pubColors: [
        { name: "Dark Burgundy", hex: "#3D1F2B", rgb: "61, 31, 43" },
        { name: "Burgundy Accent", hex: "#A63D57", rgb: "166, 61, 87" },
        { name: "Pale White", hex: "#E0E0E0", rgb: "224, 224, 224" },
      ],
    };
  },
  methods: {
    copyToClipboard(hex) {
      navigator.clipboard.writeText(hex).then(
        () => alert(`Copied ${hex} to clipboard!`),
        () => alert("Failed to copy!")
      );
    },
  },
};
</script>
<style scoped>
.hero {
  background: linear-gradient(135deg, #1a1a1a, #000000);
}
.main{
    margin-top: 8rem;
}
.color-card {
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.color-card:hover {
  border-color: #fff;
  transform: scale(1.05);
}
</style>
  