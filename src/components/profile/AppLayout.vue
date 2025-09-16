<template>
    <div class="dark-neon-bg min-h-screen flex flex-col items-center text-white">
      <slot />
    </div>
  </template>
  
  <script setup>
  // Wrapper per sfondo e layout principale
  </script>
  
  <style scoped>
  .dark-neon-bg {
    background: #000;
    position: relative;
    overflow: hidden;
  }
  .dark-neon-bg::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 1800px; height: 1800px;
    transform: translate(-50%, -50%) scale(.7);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,0,128,.25) 0%, transparent 70%);
    animation: pulse-glow 4s infinite ease-in-out;
    z-index: 0;
  }
  @keyframes pulse-glow {
    0%,100% { transform: translate(-50%, -50%) scale(.7); opacity: 1 }
    50%    { transform: translate(-50%, -50%) scale(1);   opacity: .6 }
  }
  .dark-neon-bg > * { position: relative; z-index: 1 }
  </style>
  