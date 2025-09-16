<template>
    <div class="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4">
      <div class="absolute inset-0 bg-gradient-to-br from-pink-900 via-black to-indigo-900 opacity-70 animate-bgBlur"></div>
  
      <!-- ✅ MESSAGGIO DI CONFERMA -->
      <div
        v-if="subscribed"
        class="z-10 bg-green-600 text-white px-8 py-16 rounded-3xl shadow-2xl text-center text-3xl font-bold animate-fade-in-up"
      >
        ✅ Iscrizione effettuata con successo!
      </div>
  
      <!-- ✅ CARD PRINCIPALE -->
      <div
        v-else
        class="relative z-10 max-w-xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 text-white shadow-2xl animate-fade-in-up"
      >
        <h1 class="text-4xl md:text-5xl font-bold text-center mb-6">🌌 Entra nella community</h1>
        <p class="text-center text-zinc-300 mb-8">
          Seguici su Telegram o iscriviti alle newsletter del Bitcoin Beer!
        </p>
  
        <div class="flex flex-col md:flex-row gap-6">
          <a
            href="https://t.me/bitcoinpratohub"
            target="_blank"
            class="flex-1 text-center bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-full font-semibold shadow-lg transform hover:scale-105 transition duration-300"
          >
            💬 Telegram
          </a>
            <a
            href="https://bitcoinbeer.events/newsletter"
            target="_blank"
            class="flex-1 text-center bg-pink-600 hover:bg-pink-700 py-3 px-6 rounded-full font-semibold shadow-lg transform hover:scale-105 transition duration-300"
          >
            📬 Newsletter
          </a>
          <!--<button
            @click="showModal = true"
            class="flex-1 text-center bg-pink-600 hover:bg-pink-700 py-3 px-6 rounded-full font-semibold shadow-lg transform hover:scale-105 transition duration-300"
          >
            📬 Mailing List
          </button>-->
        </div>
      </div>
  
      <!-- ✅ MODALE ISCRIZIONE -->
      <div v-if="showModal" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
        <div class="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
          <button
            class="absolute top-2 right-2 text-gray-400 hover:text-gray-800 text-2xl"
            @click="showModal = false"
          >
            &times;
          </button>
          <h2 class="text-2xl font-bold mb-4">Iscriviti alla newsletter</h2>
          <form @submit.prevent="handleSubscribe" class="space-y-4">
            <div>
              <label class="block mb-1 text-sm font-medium" for="name">Nome</label>
              <input
                v-model="name"
                type="text"
                id="name"
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                placeholder="Mario"
              />
            </div>
  
            <div>
              <label class="block mb-1 text-sm font-medium" for="email">Email</label>
              <input
                v-model="email"
                type="email"
                id="email"
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                placeholder="mario@email.com"
                required
              />
            </div>
  
            <button
              type="submit"
              class="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-md font-semibold transition"
            >
              Invia
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const showModal = ref(false)
  const subscribed = ref(false)
  const email = ref('')
  const name = ref('')
  
  async function handleSubscribe() {
    try {
      await fetch("https://listmonk.bitcoinbeer.events/subscription/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          email: email.value,
          name: name.value,
          l: "818b4ea2-ea1f-48c1-843f-2f40c62604f6"
        })
      })
  
      // Mostra subito messaggio di successo
      subscribed.value = true
      showModal.value = false
      email.value = ""
      name.value = ""
  
      // Se vuoi nascondere il messaggio dopo 5 secondi:
      // setTimeout(() => subscribed.value = false, 5000)
  
    } catch (err) {
      console.error("Errore durante l'iscrizione:", err)
      subscribed.value = true
      showModal.value = false
    }
  }
  </script>
  
  <style scoped>
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes bgBlur {
    0%, 100% {
      background-position: 0% 50%;
      filter: blur(80px);
    }
    50% {
      background-position: 100% 50%;
      filter: blur(100px);
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }
  .animate-bgBlur {
    animation: bgBlur 15s ease infinite;
    background-size: 200% 200%;
  }
  </style>
  