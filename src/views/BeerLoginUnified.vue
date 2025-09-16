<template>
  <div class="min-h-screen bg-gray-800 pt-24 md:pt-28">
    <div class="max-w-5xl mx-auto px-4 pb-16">
      <div class="bg-gray-900 border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Colonna sinistra: branding unificato -->
          <div class="flex flex-col items-center md:items-start text-center md:text-left">
            <div class="flex items-center gap-4 mb-4">
              <img src="/logos/logo.png" alt="Bitcoin Beer" class="h-10 md:h-12" />
              <svg class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <img src="/logos/marker.webp" alt="Unspent" class="h-10 md:h-12" />
            </div>

            <h1 class="text-2xl md:text-3xl font-bold text-gray-300">
              Un solo account per tutto l’ecosistema
            </h1>
            <p class="text-gray-400 mt-3">
              Con le stesse credenziali accedi sia a <span class="font-medium">BitcoinBeer.events</span> sia a
              <span class="font-medium">Unspent.it</span>.
            </p>

            <ul class="text-gray-600 text-sm mt-4 space-y-1">
              <li class="flex items-center gap-2">
                <span class="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Login unificato con email o username
              </li>
              <li class="flex items-center gap-2">
                <span class="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Password reset valido per entrambi i siti
              </li>
              <li class="flex items-center gap-2">
                <span class="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Sicurezza e privacy condivise
              </li>
            </ul>
          </div>

          <!-- Colonna destra: form -->
          <div>
            <div class="bg-gray-900 border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-semibold text-yellow-400 mb-6 text-center">Accedi al tuo account</h2>

              <form @submit.prevent="login" novalidate>
                <!-- IDENTIFIER -->
                <div class="mb-4">
                  <label for="identifier" class="block text-sm text-gray-400">Email o Username</label>
                  <input
                    id="identifier"
                    v-model.trim="identifier"
                    type="text"
                    autocomplete="username"
                    placeholder="nome@esempio.it oppure tuo_username"
                    class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 text-sm
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50"
                    :disabled="loading"
                  />
                </div>

                <!-- PASSWORD -->
                <div class="mb-2">
                  <label for="password" class="block text-sm text-gray-500">Password</label>
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    placeholder="Password"
                    class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 text-sm
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50"
                    :disabled="loading"
                  />
                  <label class="mt-2 inline-flex items-center gap-2 text-xs text-gray-400">
                    <input type="checkbox" v-model="showPassword" :disabled="loading" />
                    Mostra password
                  </label>
                </div>

                <!-- FORGOT -->
                <div class="mb-4 text-right">
                  <RouterLink to="/forgot-password" class="text-xs text-amber-600 hover:underline">
                    Hai dimenticato la password?
                  </RouterLink>
                </div>

                <!-- ERRORI -->
                <p v-if="authMessage" class="text-red-600 text-sm mb-3 text-center">{{ authMessage }}</p>

                <!-- SUBMIT -->
                <button
                  type="submit"
                  class="w-full inline-flex justify-center items-center rounded-lg bg-amber-500 hover:bg-amber-600
                         text-white font-medium px-4 py-2 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="loading"
                >
                  <span v-if="!loading">Accedi</span>
                  <span v-else>Accesso in corso…</span>
                </button>
              </form>

              <!-- Footer -->
              <p class="text-center text-gray-500 text-xs mt-6">
                Non hai un account?
                <RouterLink to="/register" class="text-amber-600 hover:underline">Registrati</RouterLink>
              </p>

              <div class="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 text-center">
                Con questo accesso entri sia su <strong>BitcoinBeer.events</strong> che su <strong>Unspent.it</strong>.
              </div>
            </div>
          </div>
        </div>

        <!-- Disclaimer -->
        <div class="text-center text-gray-500 text-xs mt-6">
          Accedendo accetti i nostri Termini e l’Informativa sulla Privacy.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProfile } from '@/composables/useProfile';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.bitcoinbeer.events/api';
const LOGIN_ENDPOINT = `${API_BASE}/login_mail.php`;

const router = useRouter();
const { token, loadProfile } = useProfile();

const identifier = ref('');
const password = ref('');
const showPassword = ref(false);
const authMessage = ref('');
const loading = ref(false);

async function login() {
  authMessage.value = '';
  if (!identifier.value || !password.value) {
    authMessage.value = 'Inserisci email/username e password.';
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: identifier.value.trim(), password: password.value })
    });

    if (!res.ok) {
      let msg = '';
      try { const j = await res.json(); msg = j?.error || j?.message || ''; } catch {}
      authMessage.value = msg || `Errore server (${res.status}).`;
      return;
    }

    const data = await res.json();
    if (data?.success && data?.data?.token) {
      const newToken = data.data.token;
      localStorage.setItem('user_token', newToken);
      token.value = newToken;
      await loadProfile();

      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      if (next) window.location.href = next;
      else router.push('/CompleteProfile');
    } else {
      authMessage.value = data?.error || data?.message || 'Credenziali non valide.';
    }
  } catch {
    authMessage.value = 'Errore di rete. Riprova più tardi.';
  } finally {
    loading.value = false;
  }
}
</script>
