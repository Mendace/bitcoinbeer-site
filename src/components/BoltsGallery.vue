<template>
  <!-- riga tratteggiata più spessa, con margine in basso -->
  <hr class="mx-auto mb-8 h-0 border-t-2 border-dashed border-neutral-600 max-w-6xl" />

  <section class="space-y-4">
    <!-- header -->
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6">
      <div class="flex items-center gap-2">
        <svg
          class="h-6 w-6 text-yellow-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M13 2 3 14h7v8l10-12h-7V2z" />
        </svg>
        <h2 class="text-xl text-white font-bold uppercase tracking-wide">
          Bolts Video
        </h2>
      </div>
      <RouterLink
        :to="{ name: 'bolts-viewer', params: { index: 0 } }"
        class="flex items-center gap-1 text-sm hover:underline whitespace-nowrap"
      >
        Guarda tutti
        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </RouterLink>
    </div>

    <!-- desktop grid (max 5, centrati) -->
    <div
      class="mx-auto hidden max-w-6xl justify-center px-6 md:grid md:grid-cols-5 md:gap-6"
    >
      <BoltsPreview
        v-for="(url, i) in embeds.slice(0, 5)"
        :key="url"
        :embed="url"
        :index="i"
        :previewDuration="3"
      />
    </div>

    <!-- mobile carousel con frecce -->
    <div class="relative md:hidden px-4">
      <!-- freccia sinistra -->
      <button
        @click="scrollLeft"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2"
      >
        <svg
          viewBox="0 0 24 24"
          fill="white"
          class="h-5 w-5"
        >
          <path d="M15 18 9 12l6-6" />
        </svg>
      </button>
      <!-- freccia destra -->
      <button
        @click="scrollRight"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2"
      >
        <svg
          viewBox="0 0 24 24"
          fill="white"
          class="h-5 w-5"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div
        ref="strip"
        class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        <BoltsPreview
          v-for="(url, i) in embeds"
          :key="url"
          :embed="url"
          :index="i"
          :previewDuration="3"
        />
      </div>
    </div>
  </section>

  <!-- riga tratteggiata in basso + spazio extra -->
  <hr class="mx-auto mt-8 mb-12 h-0 border-t-2 border-dashed border-neutral-600 max-w-6xl" />
</template>

<script setup>
import { ref } from 'vue'
import BoltsPreview from './BoltsPreview.vue'

defineProps({ embeds: { type: Array, required: true } })

const strip = ref(null)
const scrollLeft  = () =>
  strip.value?.scrollBy({ left: -200, behavior: 'smooth' })
const scrollRight = () =>
  strip.value?.scrollBy({ left:  200, behavior: 'smooth' })
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
