<template>
    <div class="bg-white shadow-md rounded p-6">
      <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ServiceCard',
    props: {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  /* Eventuali stili specifici per ServiceCard.vue */
  </style>
  