<template>
  <div class="relative h-screen w-screen bg-black">
    <!-- close -->
    <RouterLink
      to="/"
      class="absolute left-4 top-4 z-20 rounded-full bg-black/60 p-2 hover:bg-black/80"
    >
      <svg viewBox="0 0 24 24" fill="white" class="h-6 w-6">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </RouterLink>

    <!-- feed -->
    <div
      ref="feed"
      class="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth overscroll-y-contain"
    >
      <section
        v-for="(url,i) in embeds"
        :key="url"
        class="h-screen flex items-center justify-center snap-start"
      >
        <ReelPlayer :embed="url" viewer class="w-full max-w-sm" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ReelPlayer from '@/components/ReelPlayer.vue'

const route  = useRoute()
const embeds = route.meta.embeds || []
const feed   = ref(null)

onMounted(() => {
  const idx = Number(route.params.index || 0)
  feed.value?.scrollTo({ top: idx * window.innerHeight })
})
</script>

