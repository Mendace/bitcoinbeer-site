<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-800 px-4">
    <div class="w-full max-w-md p-6 bg-gray-900 rounded-xl border border-white/10">
      <h2 class="text-2xl font-bold text-yellow-400 mb-4 text-center">Password dimenticata</h2>

      <form @submit.prevent="submit" novalidate>
        <label for="email" class="block text-gray-300 text-sm mb-1">Email</label>
        <input
          id="email" type="email" v-model.trim="email"
          class="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="nome@esempio.it" :disabled="loading"
        />
        <p v-if="message" class="mt-3 text-center" :class="ok ? 'text-green-400' : 'text-red-400'">{{ message }}</p>
        <button
          type="submit"
          class="w-full btn-polyglass mt-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <span v-if="!loading">Invia link di reset</span>
          <span v-else>Invio…</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const loading = ref(false);
const message = ref('');
const ok = ref(false);

const ENDPOINT = 'https://api.bitcoinbeer.events/api/request_password_reset.php';

function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

async function submit(){
  message.value = ''; ok.value = false;
  if (!email.value || !isEmail(email.value)) {
    message.value = 'Inserisci un’email valida.';
    return;
  }
  loading.value = true;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email: email.value })
    });
    const data = await res.json().catch(()=> ({}));
    ok.value = !!data.success || res.ok;
    message.value = data.message || 'Se l’email esiste, riceverai un link di reset.';
  } catch {
    message.value = 'Errore di rete. Riprova.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.btn-polyglass {
  position: relative; color:#fff; font-weight:600; border-radius:9999px;
  border:2px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05);
  backdrop-filter: blur(6px); transition: all .3s ease;
}
.btn-polyglass:hover { box-shadow: 0 0 8px #f97316, 0 0 16px #facc15; }
</style>
