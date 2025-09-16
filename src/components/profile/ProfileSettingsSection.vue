<template>
  <section class="mb-12">
    <div class="rounded-2xl p-6 md:p-8 bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
      <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Impostazioni profilo</h2>
      <p class="text-sm text-gray-300 mb-6">Aggiorna i tuoi dati principali. Le modifiche sono immediate dopo il salvataggio.</p>

      <div v-if="serverError" class="mb-4 rounded border border-red-500/40 bg-red-900/30 text-red-200 px-3 py-2">
        {{ serverError }}
      </div>
      <div v-if="ok" class="mb-4 rounded border border-emerald-500/40 bg-emerald-900/30 text-emerald-200 px-3 py-2">
        Dati aggiornati!
      </div>

      <form @submit.prevent="save" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Username -->
          <div>
            <label class="block text-xs uppercase tracking-wide text-gray-400 mb-2">Username</label>
            <div class="relative">
              <input
                v-model.trim="form.username"
                type="text"
                placeholder="username"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/60 focus:border-transparent"
              />
            </div>
            <p v-if="errors.username" class="text-red-300 text-xs mt-2">{{ errors.username }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs uppercase tracking-wide text-gray-400 mb-2">Email</label>
            <div class="relative">
              <input
                v-model.trim="form.email"
                type="email"
                placeholder="nome@dominio.it"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/60 focus:border-transparent"
              />
            </div>
            <p v-if="errors.email" class="text-red-300 text-xs mt-2">{{ errors.email }}</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-end pt-2">
          <button
            type="button"
            @click="resetForm"
            class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            Annulla
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-500 hover:opacity-90 disabled:opacity-50 font-semibold"
          >
            {{ saving ? 'Salvataggio…' : 'Salva' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';

const props = defineProps({
  // se il parent passa già il profilo, lo usiamo; altrimenti lo carichiamo noi
  profile: { type: Object, default: () => ({}) },
  api: {
    type: Object,
    default: () => ({
      PROFILE: 'https://api.bitcoinbeer.events/api/get_profile.php',
      UPDATE:  'https://api.bitcoinbeer.events/api/profile_update.php'
    })
  }
});
const emit = defineEmits(['updated']);

const form = reactive({ username: '', email: '' });
const base = reactive({ username: '', email: '' }); // per reset
const errors = reactive({ username: '', email: '' });
const saving = ref(false);
const serverError = ref('');
const ok = ref(false);

function fillFrom(p) {
  form.username = p?.username || '';
  form.email = p?.email || '';
  base.username = form.username;
  base.email = form.email;
}

watch(() => props.profile, (p) => fillFrom(p), { immediate: true });

function validate() {
  errors.username = '';
  errors.email = '';
  if (form.username && !/^[a-zA-Z0-9._-]{3,32}$/.test(form.username)) {
    errors.username = '3-32 caratteri; lettere/numeri/._-';
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email non valida';
  }
  return !(errors.username || errors.email);
}

function resetForm() {
  ok.value = false;
  serverError.value = '';
  errors.username = '';
  errors.email = '';
  form.username = base.username;
  form.email = base.email;
}

async function loadProfileIfNeeded() {
  // se il parent ha passato un profilo già popolato, non carico
  const hasParentData = !!(props.profile && (props.profile.username || props.profile.email));
  if (hasParentData) return;
  try {
    const token = localStorage.getItem('user_token');
    if (!token) return;
    const headers = { 'Content-Type': 'application/json' };
    headers['Authorization'] = `Bearer ${token}`; // aiuta lato server
    const res = await fetch(props.api.PROFILE, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token }) // body + bearer per massima compatibilità
    });
    const json = await res.json();
    if (json?.success) {
      const u = json.data?.user || {};
      fillFrom(u);
      emit('updated', u); // informa il parent
    }
  } catch (e) {
    // non blocchiamo la UI
  }
}

async function save() {
  ok.value = false;
  serverError.value = '';
  if (!validate()) return;

  const token = localStorage.getItem('user_token');
  if (!token) {
    serverError.value = 'Devi effettuare il login.';
    return;
  }

  const payload = { token };
  if (form.username !== base.username) payload.username = form.username;
  if (form.email    !== base.email)    payload.email    = form.email;

  if (Object.keys(payload).length === 1) { // solo token, nulla da salvare
    ok.value = true;
    return;
  }

  saving.value = true;
  try {
    // 1) UPDATE
    const updRes = await fetch(props.api.UPDATE, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    const updJson = await updRes.json();
    if (!updJson?.success) throw new Error(updJson?.error || 'Errore salvataggio');

    // 2) RELOAD profilo dal backend (così riempiamo email/username aggiornati)
    const headers = { 'Content-Type':'application/json' };
    const profRes = await fetch(props.api.PROFILE, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token })
    });
    const profJson = await profRes.json();
    if (!profJson?.success) throw new Error(profJson?.error || 'Impossibile ricaricare il profilo');

    const user = profJson.data?.user || {};
    fillFrom(user);      // aggiorna i campi del form
    emit('updated', user); // notifica al parent (header ecc.)
    ok.value = true;
  } catch (e) {
    serverError.value = e.message || String(e);
  } finally {
    saving.value = false;
  }
}


onMounted(loadProfileIfNeeded);
</script>
