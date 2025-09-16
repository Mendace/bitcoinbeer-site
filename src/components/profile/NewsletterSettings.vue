<template>
  <div class="mb-24">
    <div class="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6">
      <h2 class="text-xl md:text-2xl font-bold text-center mb-6">
        Gestisci le tue newsletter
      </h2>
      <div class="flex items-center gap-4 mb-8">
        <input
          v-model.trim="emailForm"
          type="email"
          placeholder="La tua email"
          class="flex-1 px-4 py-2 rounded bg-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          @click="saveNewsletterEmail"
          :disabled="!emailForm || isUpdating"
          class="px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
        >
          Salva
        </button>
      </div>
      <div class="grid sm:grid-cols-2 gap-6">
        <NewsletterCard
          v-for="n in newsletters"
          :key="n.id"
          :data="n"
          :checked="subscriptions[n.id]"
          :disabled="isUpdating"
          @toggle="toggleNewsletter(n.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useNewsletter } from '@/composables/useNewsletter';
import NewsletterCard from './NewsletterCard.vue';

// Otteniamo la logica dal composable
const {
  newsletters,
  emailForm,
  isUpdating,
  subscriptions,
  saveNewsletterEmail,
  toggleNewsletter,
  loadSubscriptions,
  newsletterEmail
} = useNewsletter();

// Carica le iscrizioni quando il componente è montato
onMounted(async () => {
  await loadSubscriptions();
});

// Carica le sottoscrizioni quando l'email viene modificata
watch(emailForm, async (newEmail) => {
  if (newEmail) {
    await loadSubscriptions();
  }
});
</script>
