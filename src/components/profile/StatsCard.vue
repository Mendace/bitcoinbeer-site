<template>
    <div class="stats-card">
      <div class="text-2xl font-extrabold">{{ value }}</div>
      <div :class="['flex items-center justify-center', colorClass]">
        <slot/>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    value: { type: Number, required: true },
    color: { type: String, default: 'white' }
  });
  const colorClass = `text-${props.color}`;
  </script>
  
  <style scoped>
  .stats-card {
    min-width: 64px;
    background: rgba(255,255,255,.07);
    border-radius: .5rem;
    padding: .75rem 1rem;
    text-align: center;
    transition: transform .3s;
  }
  .stats-card:hover {
    transform: translateY(-3px) scale(1.05);
    background: rgba(255,255,255,.15);
  }
  </style>
  