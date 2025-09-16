<template>
  <div class="mt-12 relative">
    <!-- BOX Login / Registrazione (se non loggato) -->
    <div
      v-if="!loggedIn"
      class="p-4 bg-gray-900 rounded-xl mb-4 border border-white/10 glass-effect"
    >
      <h2 class="text-xl font-bold text-yellow-400 mb-4">Login / Registrazione</h2>

      <!-- Campi di input -->
      <div class="mb-4">
        <label for="username" class="block text-gray-300">Username:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full p-2 mt-1 rounded bg-gray-700 text-white border-none
                 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-gray-300">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full p-2 mt-1 rounded bg-gray-700 text-white border-none
                 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <!-- Pulsanti polyglass con bordo che si illumina -->
      <div class="flex space-x-4">
        <button @click="login" class="btn-polyglass">
          Login
        </button>
        <button @click="registerUser" class="btn-polyglass">
          Registrati
        </button>
      </div>

      <p v-if="authMessage" class="mt-3 text-gray-300">{{ authMessage }}</p>
    </div>
  
    <!-- Titolo "Commenti" (sempre visibile) -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-yellow-400">Commenti</h2>
      <!-- Se loggato, mostra info utente e pulsante Profilo -->
      <div v-if="loggedIn" class="flex items-center space-x-2">
        <img :src="userAvatar" alt="Avatar" class="w-8 h-8 rounded-full object-cover" />
        <span class="text-yellow-400 font-semibold">{{ profile.username || 'Utente' }}</span>
        <button
          @click="openProfileModal"
          class="bg-yellow-500 hover:bg-orange-600 text-white px-3 py-2 rounded"
        >
          Profilo
        </button>
      </div>
    </div>
  
    <!-- Elenco commenti: SEMPRE visibili -->
    <div v-if="thread.length === 0" class="text-gray-300 my-2">
      Nessun commento. Sii il primo a commentare!
    </div>
    <div class="mt-4 space-y-4">
      <CommentItem
        v-for="c in thread"
        :key="c.id"
        :comment="c"
        :formatDate="formatDate"
        :refresh="loadComments"
        :loggedIn="loggedIn"
      />
    </div>
  
    <!-- Box "Aggiungi commento" SOLO se loggato -->
    <div v-if="loggedIn" class="mt-8 p-4 bg-gray-900 rounded">
      <div class="flex items-center space-x-3 mb-3">
        <img :src="userAvatar" alt="Avatar" class="w-8 h-8 rounded-full object-cover" />
        <span class="text-yellow-400 font-semibold">{{ profile.username || 'Utente' }}</span>
      </div>
      <h3 class="text-lg font-bold text-yellow-400">Aggiungi un commento</h3>
      <div class="mt-2">
        <textarea
          v-model="content"
          rows="4"
          placeholder="Scrivi il tuo commento..."
          class="w-full mb-2 px-2 py-1 rounded bg-gray-700 text-white border-none"
        ></textarea>
        <button class="bg-yellow-500 text-black px-3 py-1 rounded" @click="addComment">
          Invia
        </button>
      </div>
    </div>
  
<!-- Modal Profilo (se loggato) -->
<div
  v-if="showProfileModal"
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
  <!-- Contenitore con bordo gradiente multicolore -->
  <div class="relative w-11/12 md:w-1/2 p-[2px] rounded-2xl shadow-2xl profile-modal-frame">
    <!-- Sfondo interno scuro e semitrasparente -->
    <div class="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center relative">

      <!-- Pulsante di chiusura in alto a destra -->
      <button
        @click="closeProfileModal"
        class="absolute top-4 right-4 text-gray-300 text-3xl hover:text-white transition-colors"
      >
        &times;
      </button>

      <!-- Se stiamo caricando, mostra un messaggio -->
      <div v-if="profileLoading" class="text-gray-300 mt-2">
        Caricamento...
      </div>

      <!-- Altrimenti, mostra il contenuto del profilo -->
      <div v-else>

        <!-- Avatar grande e arrotondato -->
        <img
          :src="userAvatar"
          alt="Avatar utente"
          class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto mb-4
                 border-4 border-white/20 shadow-xl"
        />

        <!-- Username in grande -->
        <h3 class="text-2xl md:text-3xl font-extrabold text-yellow-300 mb-1">
          {{ profile.username || 'Utente' }}
        </h3>

        <!-- Divider decorativo -->
        <div class="my-3 h-[2px] w-1/2 bg-white/20 mx-auto"></div>

        <!-- Pulsante Logout (unico pulsante) -->
        <button
          @click="logout"
          class="btn-logout mt-1 mb-4"
        >
          Logout
        </button>

        <!-- Eventuale messaggio (es. “Profilo aggiornato con successo!”, se gestito altrove) -->
        <p v-if="profileMessage" class="mt-2 text-gray-300">
          {{ profileMessage }}
        </p>

        <!-- Sezione Reazioni Totali (like, heart, star...) -->
        <div class="mt-6 w-full">
          <h4 class="text-xl md:text-2xl font-bold text-yellow-400 mb-2">
            Le tue reazioni totali
          </h4>
          <div class="flex flex-wrap justify-center gap-4 mt-3">
            <!-- Puoi mostrare solo quelle che usi realmente:
                 like_count, heart_count, star_count, thumbsup_count, thumbsdown_count, etc. -->
            <div class="flex items-center space-x-2 text-xl text-gray-200" v-if="totalHeart > 0">
              <span>💖</span><span>{{ totalHeart }}</span>
            </div>
            <div class="flex items-center space-x-2 text-xl text-gray-200" v-if="totalStar > 0">
              <span>⭐</span><span>{{ totalStar }}</span>
            </div>
            <div class="flex items-center space-x-2 text-xl text-gray-200" v-if="totalThumbsUp > 0">
              <span>👍🏻</span><span>{{ totalThumbsUp }}</span>
            </div>
            <div class="flex items-center space-x-2 text-xl text-gray-200" v-if="totalThumbsDown > 0">
              <span>👎🏻</span><span>{{ totalThumbsDown }}</span>
            </div>
            <!-- Se non hai nulla, mostra un testo -->
            <p
              v-if="totalReactions() === 0"
              class="text-gray-400 text-base italic"
            >
              Nessuna reazione finora.
            </p>
          </div>
        </div>

        <!-- Lista dei commenti dell’utente -->
        <div class="mt-8 w-full">
          <h4 class="text-xl md:text-2xl font-bold text-yellow-400 mb-3">
            I miei commenti
          </h4>
          <div v-if="myComments.length === 0" class="text-gray-300">
            Non hai commenti.
          </div>
          <ul class="space-y-2 max-h-40 overflow-y-auto px-2">
            <li
              v-for="c in myComments"
              :key="c.id"
              class="text-gray-300 text-sm"
            >
              Commento #{{ c.id }} ({{ c.like_count || 0 }} like) –
              <a :href="`/article/${c.article_id}#comment-${c.id}`"
                 class="spectacular-link"
              >
                Vai al commento
              </a>
            </li>
          </ul>
        </div>

        <!-- Link a “Profilo Completo” -->
        <div class="mt-6">
          <router-link
            to="/CompleteProfile"
            class="spectacular-link flex items-center justify-center"
          >
            <i class="bi bi-person-lines-fill mr-1"></i>
            Profilo Completo
          </router-link>
        </div>
      </div>
    </div>
  </div>
</div>

  
    <!-- Modal Registrazione: username e password -->
    <div
      v-if="showRegistrationModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-900 rounded p-6 w-11/12 md:w-1/3 relative overflow-hidden">
        <!-- Bottone per chiudere -->
        <button
          class="absolute right-4 top-4 text-gray-300 text-2xl"
          @click="cancelRegistration"
        >
          &times;
        </button>

        <!-- Gestione step: 0 => form, 1 => complimenti, 2 => invito a loggarsi -->
        <transition name="fade" mode="out-in">
          <!-- Step 0: form di registrazione -->
          <div v-if="registrationSuccessStep === 0" key="step0">
            <h3 class="text-xl font-bold text-yellow-400 mb-4">Registrazione</h3>

            <label class="block text-gray-300 mb-2" for="registrationUsername">
              Inserisci il tuo username:
            </label>
            <input
              id="registrationUsername"
              v-model="registrationUsername"
              type="text"
              placeholder="Username"
              class="w-full p-2 rounded bg-gray-700 text-white border-none
                     focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <label class="block text-gray-300 mb-2 mt-4" for="registrationPassword">
              Inserisci la tua password:
            </label>
            <input
              id="registrationPassword"
              v-model="registrationPassword"
              type="password"
              placeholder="Password"
              class="w-full p-2 rounded bg-gray-700 text-white border-none
                     focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <!-- Messaggio di errore (se fallisce) -->
            <p
              v-if="registrationMessage && !registrationSuccess"
              class="mt-3 text-red-400"
            >
              {{ registrationMessage }}
            </p>

            <div class="mt-4 flex justify-end space-x-2">
              <button
                @click="submitRegistration"
                class="btn-polyglass"
              >
                Registrati
              </button>
            </div>
          </div>

          <!-- Step 1: Complimenti e emoji trionfo -->
          <div v-else-if="registrationSuccessStep === 1" key="step1" class="text-center p-6">
            <h3 class="text-3xl font-bold text-green-400 mb-2">
              Complimenti! <span class="text-4xl">🎉</span>
            </h3>
            <p class="text-gray-200 text-lg">
              Registrazione completata con successo!
            </p>
          </div>

          <!-- Step 2: Invito a chiudere e fare login -->
          <div v-else-if="registrationSuccessStep === 2" key="step2" class="text-center p-6">
            <p class="text-yellow-400 text-xl mb-4 font-semibold">
              Ora puoi chiudere la finestra e accedere con il tuo nuovo account.
            </p>
            <button
              @click="closeAndClear"
              class="btn-polyglass text-lg px-5 py-3"
            >
              Ok, ho capito
            </button>
          </div>
        </transition>
      </div>
    </div>
  
    <!-- Modal Private Key (se serve) -->
    <div
      v-if="showPrivateKeyModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-900 rounded p-6 w-11/12 md:w-1/3">
        <h3 class="text-xl font-bold text-yellow-400 mb-4">Registrazione completata</h3>
        <p class="text-gray-300 mb-4">
          Salva con cura la tua private key. Sarà necessaria per accedere al tuo profilo:
        </p>
        <div class="bg-gray-800 p-4 rounded text-white font-mono text-center mb-4">
          {{ registrationPrivateKey }}
        </div>
        <div class="flex justify-end">
          <button
            @click="closePrivateKeyModal"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CommentItem from './CommentItem.vue';

// Props
const props = defineProps({
  articleId: { type: [String, Number], required: true }
});

// Stato di login
const loggedIn = ref(false);
const username = ref('');
const password = ref('');
const authMessage = ref('');

// Dati per i commenti
const rawComments = ref([]);
const thread = ref([]);
const content = ref('');

// Profilo utente
const profile = ref({ user_id: null, username: '', avatar: '' });
const myComments = ref([]);
const profileLoading = ref(false);
const profileMessage = ref('');

// Modal e registrazioni
const showProfileModal = ref(false);
const showRegistrationModal = ref(false);

// Campi di registrazione
const registrationUsername = ref('');
const registrationPassword = ref('');
const registrationMessage = ref('');
// True => registrazione ok
const registrationSuccess = ref(false);

// “Fasi” del modal di registrazione
// 0 => form iniziale
// 1 => Complimenti + emoji
// 2 => Invito a chiudere e loggarsi
const registrationSuccessStep = ref(0);

const showPrivateKeyModal = ref(false);
const registrationPrivateKey = ref('');

// Avatar di default
const defaultAvatar = '/assets/default-avatar.png';
const userAvatar = computed(() => {
  return profile.value.avatar && profile.value.avatar.trim() !== ''
    ? profile.value.avatar
    : defaultAvatar;
});

// Controlla login
function checkLogin() {
  const token = localStorage.getItem('user_token');
  loggedIn.value = !!token;
}
checkLogin();

// onMounted => carica commenti e, se loggato, carica il profilo
onMounted(() => {
  loadComments();
  if (loggedIn.value) {
    loadProfile();
  }
});

/**
 * Carica commenti
 */
async function loadComments() {
  try {
    const url = `https://api.bitcoinbeer.events/api/comments_api.php?article_id=${props.articleId}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.success) {
      rawComments.value = data.data;
      buildThread();
    } else {
      console.error(data.error);
    }
  } catch (e) {
    console.error('loadComments error', e);
  }
}


const totalLike = computed(() => {
  // Somma di "like_count" dai commenti dell'utente, ad esempio
  return myComments.value.reduce((sum, c) => sum + (c.like_count || 0), 0);
});
const totalHeart = computed(() => {
  return myComments.value.reduce((sum, c) => sum + (c.heart_count || 0), 0);
});
const totalStar = computed(() => {
  return myComments.value.reduce((sum, c) => sum + (c.star_count || 0), 0);
});
const totalThumbsUp = computed(() => {
  return myComments.value.reduce((sum, c) => sum + (c.thumbsup_count || 0), 0);
});
const totalThumbsDown = computed(() => {
  return myComments.value.reduce((sum, c) => sum + (c.thumbsdown_count || 0), 0);
});

function totalReactions() {
  return totalLike.value + totalHeart.value + totalStar.value
         + totalThumbsUp.value + totalThumbsDown.value;
}

/**
 * Ricostruisce la thread
 */
function buildThread() {
  const map = {};
  rawComments.value.forEach(c => {
    c.replies = [];
    map[c.id] = c;
  });
  const roots = [];
  rawComments.value.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(c);
    } else {
      roots.push(c);
    }
  });
  thread.value = roots;
}

/**
 * Aggiunge un commento
 */
async function addComment() {
  if (!content.value.trim()) {
    alert("Testo commento vuoto!");
    return;
  }
  try {
    const body = {
      article_id: Number(props.articleId),
      content: content.value,
      token: localStorage.getItem('user_token') || ""
    };
    if (profile.value.username) {
      body.author = profile.value.username;
    }
  
    const resp = await fetch('https://api.bitcoinbeer.events/api/comments_api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await resp.json();
    if (data.success) {
      localStorage.setItem(`commentKey_${data.data.id}`, data.data.edit_key);
      rawComments.value.push({
        id: data.data.id,
        parent_id: null,
        article_id: props.articleId,
        user_id: profile.value.user_id || null,
        author: profile.value.username || 'Anonimo',
        avatar: userAvatar.value,
        content: content.value,
        status: data.data.status || 'pending',
        like_count: 0,
        heart_count: 0,
        star_count: 0,
        thumbsup_count: 0,
        thumbsdown_count: 0,
        created_at: new Date().toISOString()
      });
      buildThread();
      content.value = '';
    } else {
      console.error(data.error);
    }
  } catch (e) {
    console.error('addComment error', e);
  }
}

/**
 * Formatta data
 */
function formatDate(dt) {
  return new Date(dt).toLocaleString('it-IT');
}

/**
 * Login
 */
async function login() {
  if (!username.value.trim() || !password.value.trim()) {
    authMessage.value = 'Inserisci username e password.';
    return;
  }
  try {
    const response = await fetch('https://api.bitcoinbeer.events/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value.trim()
      })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('user_token', data.data.token);
      authMessage.value = 'Login effettuato con successo!';
      loggedIn.value = true;
      username.value = '';
      password.value = '';
      loadComments();
      loadProfile();
    } else {
      authMessage.value = 'Errore: ' + data.error;
    }
  } catch (e) {
    console.error(e);
    authMessage.value = 'Errore di rete.';
  }
}

/**
 * Mostra il modal di registrazione
 */
function registerUser() {
  showRegistrationModal.value = true;
  registrationMessage.value = '';
  registrationSuccess.value = false;
  registrationSuccessStep.value = 0; // Torniamo allo step 0
}

/**
 * Chiude e resetta la registrazione
 */
function cancelRegistration() {
  showRegistrationModal.value = false;
  registrationUsername.value = '';
  registrationPassword.value = '';
  registrationMessage.value = '';
  registrationSuccess.value = false;
  registrationSuccessStep.value = 0;
}

/**
 * Invio registrazione
 */
async function submitRegistration() {
  if (!registrationUsername.value.trim()) {
    registrationMessage.value = 'Inserisci un nome utente.';
    registrationSuccess.value = false;
    return;
  }
  if (!registrationPassword.value.trim()) {
    registrationMessage.value = 'Inserisci una password.';
    registrationSuccess.value = false;
    return;
  }
  try {
    const response = await fetch('https://api.bitcoinbeer.events/api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: registrationUsername.value.trim(),
        password: registrationPassword.value.trim()
      })
    });
    const data = await response.json();
    if (data.success) {
      // OK => Passiamo allo step 1
      registrationSuccess.value = true;
      registrationMessage.value = '';
      registrationSuccessStep.value = 1;
      // Dopo 2 secondi, passiamo allo step 2
      setTimeout(() => {
        registrationSuccessStep.value = 2;
      }, 2000);
    } else {
      registrationMessage.value = data.error || 'Errore durante la registrazione.';
      registrationSuccess.value = false;
    }
  } catch (e) {
    console.error(e);
    registrationMessage.value = 'Errore di rete durante la registrazione.';
    registrationSuccess.value = false;
  }
}

/**
 * Step finale: chiudi e resetta
 */
function closeAndClear() {
  cancelRegistration();
}

/**
 * Chiude il modal della private key (se usi la key)
 */
function closePrivateKeyModal() {
  showPrivateKeyModal.value = false;
}

/**
 * Carica profilo
 */
async function loadProfile() {
  const token = localStorage.getItem('user_token');
  if (!token) return;
  profileLoading.value = true;
  try {
    const resp = await fetch('https://api.bitcoinbeer.events/api/get_profile.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await resp.json();
    if (data.success) {
      profile.value = data.data.user;
      myComments.value = data.data.comments;
      localStorage.setItem('user_data', JSON.stringify(data.data.user));
    } else {
      console.error(data.error);
    }
  } catch (e) {
    console.error(e);
  }
  profileLoading.value = false;
}

/**
 * Apre modal profilo
 */
function openProfileModal() {
  showProfileModal.value = true;
  loadProfile();
}

/**
 * Chiude modal profilo
 */
function closeProfileModal() {
  showProfileModal.value = false;
}

/**
 * Aggiorna profilo (solo username)
 */
async function updateProfile() {
  const token = localStorage.getItem('user_token');
  if (!token) return;
  profileMessage.value = '';
  const formData = new FormData();
  formData.append('token', token);
  formData.append('username', profile.value.username);

  try {
    const resp = await fetch('https://api.bitcoinbeer.events/api/update_profile.php', {
      method: 'POST',
      body: formData
    });
    const data = await resp.json();
    if (data.success) {
      profile.value.username = data.data.username;
      profile.value.avatar = '';
      profileMessage.value = 'Profilo aggiornato con successo!';
    } else {
      profileMessage.value = 'Errore: ' + data.error;
    }
  } catch (e) {
    console.error(e);
    profileMessage.value = 'Errore di rete durante l’aggiornamento del profilo.';
  }
}

/**
 * Logout
 */
function logout() {
  localStorage.removeItem('user_token');
  loggedIn.value = false;
  showProfileModal.value = false;
  authMessage.value = 'Logout effettuato.';
  profile.value = { user_id: null, username: '', avatar: '' };
  myComments.value = [];
}
</script>

<style scoped>
.mt-12 {
  margin-top: 3rem;
}
.fixed {
  position: fixed;
}
.inset-0 {
  top: 0; right: 0; bottom: 0; left: 0;
}
.z-50 {
  z-index: 50;
}
.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Effetto vetroso leggero */
.glass-effect {
  backdrop-filter: blur(8px);
}

/* Pulsanti "polyglass" con bordo che si illumina (solo il bordo in hover) */
.btn-polyglass {
  position: relative;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 9999px; /* pill shape */
  /* Bordo e background base */
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
}
.btn-polyglass:hover {
  border: 0px solid transparent;
  border-image: linear-gradient(to right, #f97316, #facc15) 1;
  box-shadow: 0 0 8px #f97316, 0 0 16px #facc15;
}

/* Transizione fade (usata con <transition name="fade">) */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.profile-modal-frame {
  /* BORDO: gradiente viola → rosa → giallo */
  background: linear-gradient(to right, #8b5cf6, #ec4899, #facc15);
}

.btn-logout {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  color: #fff;
  font-weight: 600;
  border-radius: 9999px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
}
.btn-logout:hover {
  border: 0px solid transparent;
  border-image: linear-gradient(to right, #f97316, #facc15) 1;
  box-shadow: 0 0 8px #f97316, 0 0 16px #facc15;
}

.spectacular-link {
  /* Testo in gradiente (rosa → viola) */
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  -webkit-background-clip: text;  /* clip del gradiente solo sul testo */
  color: transparent;            /* il testo “trasparente” rivela il gradiente */
  font-weight: 700;
  text-decoration: none;         /* niente sottolineatura “di default” */
  transition: all 0.4s ease;
}

.spectacular-link:hover {
  /* Cambio gradiente (giallo → arancione) + “glow” */
  background: linear-gradient(to right, #facc15, #f97316);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow:
    0 0 6px rgba(249, 115, 22, 0.6),
    0 0 12px rgba(234, 179, 8, 0.5);
}

</style>
