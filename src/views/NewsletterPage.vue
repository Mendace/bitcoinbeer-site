<template>
  <div class="min-h-screen bg-black pt-32 text-white font-inter">
    <!-- Grid container with polyglass cards -->
    <main class="w-full sm:max-w-6xl mx-auto px-4 pb-16">
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Combined intro + email form card -->
        <div
          class="col-span-1 sm:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-stretch text-center"
        >
          <h1 class="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4">
            Le nostre Newsletter
          </h1>
          <p class="text-sm sm:text-base md:text-lg opacity-80 mb-6 max-w-2xl mx-auto">
            Inserisci la tua email per controllare le iscrizioni esistenti o seleziona le newsletter che preferisci.
          </p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full max-w-2xl mx-auto">
            <input
              v-model.trim="emailForm"
              type="email"
              placeholder="La tua email"
              class="flex-1 px-5 py-3 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              @click="saveNewsletterEmail"
              :disabled="!emailForm || isUpdating"
              class="w-full sm:w-auto px-6 py-3 rounded-lg bg-sky-600/70 hover:bg-sky-600/80 disabled:opacity-50 font-semibold transition"
            >
              Salva
            </button>
          </div>
        </div>

        <!-- Newsletter cards -->
        <div
          v-for="n in newsletters"
          :key="n.id"
          class="bg-white/10 backdrop-blur-md rounded-xl shadow-lg h-full p-4 flex flex-col"
        >
          <NewsletterCard
            :data="n"
            :checked="subscriptions[n.id]"
            :disabled="isUpdating"
            @toggle="toggleNewsletter(n.id)"
            class="flex-1"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useNewsletter } from '@/composables/useNewsletter'
import NewsletterCard from '@/components/profile/NewsletterCard.vue'

const {
  newsletters,
  emailForm,
  isUpdating,
  subscriptions,
  saveNewsletterEmail,
  toggleNewsletter,
  loadSubscriptions,
} = useNewsletter()

onMounted(async () => {
  await loadSubscriptions()
})

watch(emailForm, async (newEmail, oldEmail) => {
  if (newEmail && newEmail !== oldEmail) {
    await loadSubscriptions()
  }
})
</script>

<style scoped>
* {
  color: white !important;
}
</style>
