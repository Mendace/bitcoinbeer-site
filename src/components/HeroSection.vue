<template>
  <!-- Automatic full‑screen carousel -->
  <section class="relative h-screen w-screen overflow-hidden select-none">
    <!-- Slide (cross‑fade) -->
    <transition name="slide" mode="out-in">
      <img
        :key="currentImage"
        :src="currentImage"
        :alt="`slide-${currentIndex + 1}`"
        class="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
      />
    </transition>

    <!-- Overlay + CTA -->
    <transition name="fade" appear>
      <div
        v-if="showOverlay"
        class="absolute inset-0 flex items-center justify-center bg-black/60"
      >
        <transition name="content" appear>
          <div class="text-center text-white px-4 responsive-layout max-w-4xl">
            <h1 class="heading text-[clamp(2rem,3.5vw,3.2rem)] font-semibold mb-2 tracking-tight">
              {{ t('hero.title') }}
            </h1>
            <h2 class="subheading text-[clamp(0.95rem,2.1vw,1.4rem)] font-normal mb-5 opacity-90 leading-snug">
              {{ t('hero.subtitle') }}
            </h2>

            <div class="cta-group flex flex-col sm:flex-row items-center justify-center gap-3">
              <router-link to="/explore" class="glass-button w-auto">
                {{ t('hero.explore') }}
              </router-link>
              <router-link to="/start" class="glass-button secondary w-auto">
                {{ t('hero.getStarted') }}
              </router-link>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Animated scroll‑down arrow -->
    <transition name="arrow" appear>
      <div
        v-if="showArrow"
        class="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 text-white/80 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </transition>

    <!-- Progress bar -->
    <div
      class="absolute bottom-0 left-0 h-[2px] bg-white/90 progress-bar"
      :style="{ width: progress + '%' }"
    ></div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  images: {
    type: Array,
    default: () => [
      '/assets/meetup/DSC01623.JPG',
      '/assets/meetup/DSC01653.JPG',
      '/assets/meetup/DSC09751.JPG',
      '/assets/meetup/DSC09788.JPG',
      '/assets/meetup/DSC09814.JPG',
      '/assets/meetup/Granatiero.jpg',
      '/assets/meetup/Guybrush_2_2025-06.jpg',
      '/assets/meetup/Guybrush-2025-06.jpg',
      '/assets/meetup/Rivi.jpg',
    ],
  },
  slideDuration: { type: Number, default: 5000 },
  overlayDelay: { type: Number, default: 1000 },
  arrowDelay: { type: Number, default: 2000 },
});

const { t } = useI18n();

const currentIndex = ref(0);
const progress = ref(0);
const showOverlay = ref(false);
const showArrow = ref(false);
let slideTimer; let progressTimer;

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
}

function startProgress(start) {
  progressTimer = setInterval(() => {
    const elapsed = Date.now() - start;
    progress.value = Math.min((elapsed / props.slideDuration) * 100, 100);
  }, 40);
}

function startSlideCycle() {
  const start = Date.now();
  progress.value = 0;
  startProgress(start);
  slideTimer = setTimeout(() => {
    nextSlide();
    clearInterval(progressTimer);
    startSlideCycle();
  }, props.slideDuration);
}

onMounted(() => {
  setTimeout(() => (showOverlay.value = true), props.overlayDelay);
  setTimeout(() => (showArrow.value = true), props.arrowDelay);
  startSlideCycle();
});

onUnmounted(() => {
  clearTimeout(slideTimer);
  clearInterval(progressTimer);
});

const currentImage = computed(() => props.images[currentIndex.value]);
</script>

<style scoped>
/**** Transitions ****/
.slide-enter-active,
.slide-leave-active { transition: opacity 0.7s ease-in-out; }
.slide-enter-from,
.slide-leave-to { opacity: 0; }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.6s ease-in-out; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.content-enter-active { transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
.content-enter-from { opacity: 0; transform: translateY(32px); }

.arrow-enter-active { transition: opacity 0.8s ease-out; }
.arrow-enter-from { opacity: 0; }

/**** Progress bar ****/
.progress-bar { transition: width 0.04s linear; }

/**** Typography ****/
.heading { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; text-shadow: 0 2px 6px rgba(0,0,0,0.5); line-height: 1.1; font-size: clamp(3rem, 5vw, 5rem); }
.subheading { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; line-height: 1.35; font-size: clamp(1.2rem, 3vw, 2.5rem); }

/**** Buttons ****/
.glass-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  border-radius: 12px;
  color: white;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.28);
  backdrop-filter: blur(10px);
  box-shadow: 0 3px 5px rgba(0,0,0,0.25);
  transition: all 0.25s ease-in-out;
  width: fit-content;
  min-width: 0;
}
.glass-button.secondary { background: transparent; border-color: rgba(255,255,255,0.45); }
.glass-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 8px rgba(0,0,0,0.35);
  background: rgba(255,255,255,0.25);
}

/**** Mobile tweaks ****/
@media (max-width: 640px) {
  .responsive-layout {
    padding-top: 0.5rem;
    transform: translateY(-5vh);
    max-width: 90%;
  }

  .heading { font-size: 2.2rem; margin-bottom: 0.75rem; }
  .subheading { font-size: 1.4rem; margin-bottom: 1rem; }

  .cta-group {
    margin-top: 5rem; /* sposta i pulsanti più in basso */
  }

  .glass-button {
    padding: 7px 16px;
    font-size: 0.85rem;
    border-radius: 10px;
    width: 100%;
    max-width: 220px;
  }
  .glass-button + .glass-button { margin-top: 0.5rem; }
}

/**** Bounce fallback ****/
@keyframes bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(6px);} }
.animate-bounce { animation: bounce 1.5s infinite; }
</style>
