<!-- src/components/ProfileHeader.vue -->
<template>
  <div class="w-full max-w-3xl mb-10 mx-auto px-4">
    <div class="relative bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6">
      
      <!-- Logout icon-only button top-right -->
      <button
  @click="logout"
  class="btn-polyglass px-4 py-2 flex items-center space-x-2"
>
  <!-- icona logout -->
  <svg xmlns="http://www.w3.org/2000/svg"
       class="h-5 w-5"
       fill="none" viewBox="0 0 24 24"
       stroke="currentColor">
    <path stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-8V7" />
  </svg>
  <span>Logout</span>
</button>

      <!-- Avatar centered -->
      <div class="flex justify-center mb-4">
        <img
          :src="profile.avatar || defaultAvatar"
          class="w-28 h-28 rounded-full object-cover border-4 border-purple-600 shadow-lg"
        />
      </div>

      <!-- Username -->
      <h1 class="text-2xl md:text-3xl font-bold text-pink-400 text-center mb-1">
        {{ profile.username || 'Utente' }}
      </h1>

      <!-- Membership date -->
      <p class="text-center text-gray-400 text-sm mb-6">
        Membro da {{ formatMonthYear(profile.created_at) }}
      </p>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useProfile } from '@/composables/useProfile'

const { profile, defaultAvatar, stats, formatMonthYear } = useProfile()
const router = useRouter()

function logout() {
  localStorage.removeItem('user_token')
  router.push('/')
}
</script>

<style scoped>
.btn-polyglass {
  position: relative;
  color: #fff;
  border-radius: 9999px;
  border: 2px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
}
.btn-polyglass:hover {
  box-shadow: 0 0 8px #f44336, 0 0 16px #d32f2f;
}
</style>
