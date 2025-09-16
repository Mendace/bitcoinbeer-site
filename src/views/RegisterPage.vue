<template>
  <div class="min-h-screen bg-gray-800 pt-24 md:pt-28">
    <div class="max-w-md mx-auto px-4 pb-16">
      <div class="bg-gray-900 border border-gray-200 rounded-xl shadow-sm p-6">
        <!-- Logo -->
        <div class="flex items-center justify-center gap-3 mb-4">
          <img src="/logos/marker.webp" alt="Bitcoin Beer" class="h-8" />
        </div>

        <h2 class="text-xl font-semibold text-yellow-400 mb-6 text-center">Crea il tuo account</h2>

        <!-- SUCCESS -->
        <div
          v-if="ok"
          class="mb-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 text-sm p-3"
        >
          🎉 Registrazione completata! Ora puoi accedere con le tue credenziali.
        </div>

        <form v-if="!ok" @submit.prevent="register" novalidate>
          <!-- EMAIL -->
          <div class="mb-4">
            <label for="email" class="block text-sm text-gray-300">Email</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              placeholder="nome@esempio.it"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 text-sm
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50"
              :disabled="loading"
            />
          </div>

          <!-- USERNAME -->
          <div class="mb-4">
            <label for="username" class="block text-sm text-gray-300">Username</label>
            <input
              id="username"
              v-model.trim="username"
              type="text"
              autocomplete="username"
              placeholder="Il tuo username"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 text-sm
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50"
              :disabled="loading"
            />
          </div>

          <!-- PASSWORD -->
          <div class="mb-3">
            <label for="password" class="block text-sm text-gray-300">Password</label>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Minimo 6 caratteri"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 text-sm
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50"
              :disabled="loading"
            />
          </div>

          <!-- CONFIRM -->
          <div class="mb-2">
            <label for="password2" class="block text-sm text-gray-300">Conferma password</label>
            <input
              id="password2"
              v-model="password2"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Ripeti la password"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 text-sm
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50"
              :disabled="loading"
            />
            <label class="mt-2 inline-flex items-center gap-2 text-xs text-gray-400">
              <input type="checkbox" v-model="showPassword" :disabled="loading" />
              Mostra password
            </label>
          </div>

          <!-- TERMS (opzionale) -->
          <div class="mb-3">
            <label class="inline-flex items-center gap-2 text-xs text-gray-400">
              <input type="checkbox" v-model="accept" :disabled="loading" />
              Accetto Termini e Privacy
            </label>
          </div>

          <!-- ERRORI -->
          <p v-if="msg" class="text-red-400 text-sm mb-3 text-center">{{ msg }}</p>

          <!-- SUBMIT -->
          <button
            type="submit"
            class="w-full inline-flex justify-center items-center rounded-lg bg-amber-500 hover:bg-amber-600
                   text-white font-medium px-4 py-2 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span v-if="!loading">Registrati</span>
            <span v-else>Invio…</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-5">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-gray-400 text-xs">oppure</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Pulsante UNIFIED (stesso stile del login) -->
        <button
          class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white
                 hover:bg-gray-50 text-gray-900 px-4 py-2 text-sm transition"
          @click="goUnifiedLogin"
          aria-label="Registrazione/account unificato"
        >
          <img src="/logos/logo.png" alt="" class="h-5 w-5" />
          <span class="font-medium">Usa l’account unificato</span>
        </button>

        <!-- Footer -->
        <p class="text-center text-gray-400 text-xs mt-6">
          Hai già un account?
          <RouterLink to="/login" class="text-amber-600 hover:underline">Accedi</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.bitcoinbeer.events/api';
const REGISTER_ENDPOINT = `${API_BASE}/register_mail.php`; // API: email + username + password

const router = useRouter();

const email = ref('');
const username = ref('');
const password = ref('');
const password2 = ref('');
const showPassword = ref(false);
const accept = ref(false);

const loading = ref(false);
const msg = ref('');
const ok = ref(false);

async function register() {
  msg.value = '';
  ok.value = false;

  // Validazioni base
  if (!email.value) { msg.value = 'Inserisci una email valida.'; return; }
  if (!username.value || username.value.length < 3 || username.value.length > 20) {
    msg.value = 'Lo username deve essere tra 3 e 20 caratteri.'; return;
  }
  if (!password.value || password.value.length < 6) {
    msg.value = 'La password deve contenere almeno 6 caratteri.'; return;
  }
  if (password.value !== password2.value) {
    msg.value = 'Le password non coincidono.'; return;
  }
  if (!accept.value) {
    msg.value = 'Devi accettare Termini e Privacy.'; return;
  }

  loading.value = true;
  try {
    const res = await fetch(REGISTER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        username: username.value.trim(),
        password: password.value
      })
    });

    let data = null;
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      msg.value = data?.error || data?.message || `Errore server (${res.status}).`;
      return;
    }

    if (data?.success) {
      ok.value = true;
      // opzionale: redirect al login dopo 1–2 secondi
      // setTimeout(() => router.push('/login'), 1200);
    } else {
      msg.value = data?.error || data?.message || 'Errore durante la registrazione.';
    }
  } catch (e) {
    msg.value = 'Errore di rete. Riprova più tardi.';
  } finally {
    loading.value = false;
  }
}

function goUnifiedLogin() {
  // stessa route che usi nel login per la pagina “unified” BB
  router.push('/login-unified-bb');
}
</script>
