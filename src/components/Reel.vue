<script setup>
import BoltsGallery from '@/components/BoltsGallery.vue'

const myReels = [
  'https://peertube.uno/videos/embed/vouhzfXDksWyBPENMK2PDg',
  'https://peertube.uno/videos/embed/ikzsdapcyima26X5ewHznM',
  'https://peertube.uno/videos/embed/esYjLmeKSTkZ27U9bqKZEB',
  'https://peertube.uno/videos/embed/fAABMNStVpjqZgkMBMhQYy',
]
</script>

<template>
  <BoltsGallery :embeds="myReels" />
</template>
