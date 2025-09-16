<template>
    <section class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div class="container mx-auto overflow-hidden relative">
        <div class="flex items-center space-x-4 animate-slide">
          <div v-for="(partner, index) in partners" :key="index" class="flex-shrink-0 w-32 h-16 transition duration-300 hover:scale-105">
            <img 
              :src="hoveredPartner === index ? partner.color : partner.bw" 
              @mouseover="hoveredPartner = index" 
              @mouseleave="hoveredPartner = null" 
              alt="Partner Logo" 
              class="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  </template>

<script>
export default {
  data() {
    return {
      partners: [
        { bw: "/logos/BitBox.webp", color: "/logos/BitBox.webp" },
        { bw: "/logos/btcpeople.webp", color: "/logos/btcpeople.webp" },
        { bw: "/logos/dtv.webp", color: "/logos/dtv.webp" },
        { bw: "/logos/lanarchico.webp", color: "/logos/lanarchico.webp" },
        { bw: "/logos/Awning.webp", color: "/logos/Awning.webp" },
      ],
      hoveredPartner: null,
    };
  },
};

</script>

<style scoped>
/* Sfondo nero elegante */
section {
  background: linear-gradient(135deg, #000000, #121212);
  color: #ffffff; /* Testo bianco */
}

/* Container */
.container {
  max-width: 100%;
  padding-left: 2rem; 
  padding-right: 2rem;
  overflow: hidden;
}

/* Scorrimento continuo */
.animate-slide {
  display: flex;
  flex-wrap: nowrap;
  gap: 2rem;
  animation: slide 25s linear infinite;
}

/* Animazione di scorrimento */
@keyframes slide {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Stile per i loghi */
.flex-shrink-0 {
  flex-shrink: 0;
  width: 8rem;
  height: 4rem;
  filter: grayscale(100%); /* Loghi inizialmente in scala di grigi */
  transition: filter 0.3s ease, transform 0.3s ease;
}

.flex-shrink-0:hover {
  filter: grayscale(0%); /* Rimuove la scala di grigi al passaggio del mouse */
  transform: scale(1.1); /* Ingrandisce leggermente */
}

/* Spaziatura */
.space-x-4 {
  margin-right: 2rem; 
}

/* Transizione morbida */
.transition {
  transition: transform 0.3s ease-in-out;
}
</style>


  
  