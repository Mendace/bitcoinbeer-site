<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-800 px-4">
    <div class="w-full max-w-md p-6 bg-gray-900 rounded-xl border border-white/10">
      <h2 class="text-2xl font-bold text-yellow-400 mb-4 text-center">Imposta nuova password</h2>

      <form @submit.prevent="submit" novalidate>
        <label class="block text-gray-300 text-sm mb-1" for="pwd1">Nuova password</label>
        <input
          id="pwd1" :type="show ? 'text':'password'" v-model="pwd1"
          class="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Almeno 6 caratteri" :disabled="loading"
        />
        <label class="block text-gray-300 text-sm mb-1 mt-4" for="pwd2">Conferma password</label>
        <input
          id="pwd2" :type="show ? 'text':'password'" v-model="pwd2"
          class="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Ripeti password" :disabled="loading"
        />
        <div class="mt-2 flex items-center gap-2">
          <input id="show" type="checkbox" v-model="show" :disabled="loading"/>
          <label for="show" class="text-gray-300 text-xs">Mostra password</label>
        </div>

        <p v-if="message" class="mt-3 text-center" :class="ok ? 'text-green-400' : 'text-red-400'">{{ message }}</p>

        <button
          type="submit"
          class="w-full btn-polyglass mt-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <span v-if="!loading">Salva nuova password</span>
          <span v-else>Aggiornamento…</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const selector = route.query.selector ?? '';
const token    = route.query.token ?? '';

const pwd1 = ref(''); const pwd2 = ref(''); const show = ref(false);
const loading = ref(false);
const message = ref(''); const ok = ref(false);

const ENDPOINT = 'https://api.bitcoinbeer.events/api/reset_password.php';

async function submit(){
  message.value=''; ok.value=false;

  if (!selector || !token) {
    message.value = 'Link non valido o scaduto.'; return;
  }
  if (!pwd1.value || pwd1.value.length < 6) {
    message.value = 'La password deve contenere almeno 6 caratteri.'; return;
  }
  if (pwd1.value !== pwd2.value) {
    message.value = 'Le password non coincidono.'; return;
  }

  loading.value = true;
  try {
    const res = await fetch(ENDPOINT, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        selector: String(selector),
        token: String(token),
        new_password: pwd1.value
      })
    });
    const data = await res.json().catch(()=> ({}));

    if (res.ok && data?.success) {
      ok.value = true;
      message.value = data.message || 'Password aggiornata con successo.';
      // redirect dopo 2s
      setTimeout(()=> router.push('/login'), 2000);
    } else {
      message.value = data?.error || data?.message || 'Link non valido o scaduto.';
    }
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
