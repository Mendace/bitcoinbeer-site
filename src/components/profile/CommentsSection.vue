<template>
    <div class="w-full max-w-3xl mb-16 mx-auto px-4">
      <div class="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6">
        <h2 class="text-xl md:text-2xl font-bold text-center mb-6">
          I miei commenti ({{ comments.length }})
        </h2>
        <p v-if="!comments.length" class="text-gray-200 text-center">
          Non hai ancora commentato nulla.
        </p>
        <div v-else class="space-y-4">
          <CommentItem
            v-for="c in comments"
            :key="c.id"
            :comment="c"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useProfile } from '@/composables/useProfile';
  import CommentItem     from './CommentItem.vue';
  const { comments } = useProfile();
  </script>
  