<template>
  <div class="min-h-screen bg-gray-800 pt-24 md:pt-28">
    <div class="max-w-md mx-auto px-4 pb-16">
      <div class="bg-gray-900 border border-gray-200 rounded-xl shadow-sm p-6">
        <!-- Logo + brand -->
        <div class="flex items-center justify-center gap-3 mb-4">
          <img src="/logos/marker.webp" alt="Bitcoin Beer" class="h-8" />
        </div>

        <h2 class="text-xl font-semibold text-yellow-400 mb-6 text-center">Accedi</h2>

        <form @submit.prevent="login" novalidate>
          <!-- IDENTIFIER -->
          <div class="mb-4">
            <label for="identifier" class="block text-sm text-gray-300">Email o Username</label>
            <input
              id="identifier"
              v-model.trim="identifier"
              type="text"
              autocomplete="username"
              placeholder="nome@esempio.it oppure tuo_username"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-600 text-sm
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50"
              :disabled="loading"
            />
          </div>

          <!-- PASSWORD -->
          <div class="mb-2">
            <label for="password" class="block text-sm text-gray-300">Password</label>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Password"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-600 text-sm
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

        <!-- Divider -->
        <div class="flex items-center gap-3 my-5">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-gray-400 text-xs">oppure</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Pulsante per pagina UNIFIED -->
        <button
          class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white
                 hover:bg-gray-50 text-gray-900 px-4 py-2 text-sm transition"
          @click="goUnifiedLogin"
          aria-label="Accedi con account unificato"
        >
          <img src="/logos/logo.png" alt="" class="h-5 w-5" />
          <span class="font-medium">Accedi con account unificato</span>
        </button>

        <!-- Footer -->
        <p class="text-center text-gray-400 text-xs mt-6">
          Non hai un account?
          <RouterLink to="/register" class="text-amber-600 hover:underline">Registrati</RouterLink>
        </p>
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

function goUnifiedLogin() { router.push('/login-unified-bb'); }
</script>
