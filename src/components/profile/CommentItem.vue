<template>
    <article class="p-4 bg-white/20 hover:bg-white/30 transition rounded">
      <p class="text-gray-100">
        <strong>Commento #{{ comment.id }}</strong> – {{ comment.content }}
      </p>
      <p class="text-sm text-gray-300 mt-1 flex items-center space-x-2">
        <span>{{ formatDate(comment.created_at) }}</span>
        <span>–</span>
        <router-link
          :to="`/article/${comment.article_id}#comment-${comment.id}`"
          class="spectacular-link"
        >
          Vai al commento
        </router-link>
      </p>
    </article>
  </template>
  
  <script setup>
  const props = defineProps({
    comment: { type: Object, required: true }
  });
  import { useProfile } from '@/composables/useProfile';
  const { formatDate } = useProfile();
  </script>
  