<template>
  <div class="relative w-full min-h-screen overflow-hidden cosmic-bg text-white flex flex-col">
    <!-- Sfondo: Animazione cosmica con gradienti e campo stelle -->
    <div class="absolute inset-0 z-0">
      <!-- Animazione di sfondo -->
      <div class="absolute inset-0 bg-[linear-gradient(270deg,#0a0a2a,#000,#0a0a2a)] bg-[length:400%_400%] animate-cosmic"></div>
      <!-- Campo di stelle opzionale -->
      <div class="absolute inset-0 pointer-events-none stars"></div>
    </div>

    <!-- Header: Logo centrale con effetto glow -->
    <header class="relative z-10 flex justify-center pt-8">
      <img src="../assets/logo.png" alt="Bitcoin Beer EU Logo" class="h-24 w-auto animate-glow-logo" />
    </header>

    <!-- Contenuto principale centrato -->
    <div class="relative z-10 flex flex-col items-center justify-center flex-1 px-4 md:px-16 text-center space-y-6">
      <!-- Messaggio informativo con link (v-html permette di interpretare l'HTML) -->
      <p class="text-lg md:text-2xl max-w-2xl" v-html="t('fyndra.bbmessage')"></p>

      <!-- Titolo con gradient text -->
      <h1 class="text-4xl md:text-6xl font-extrabold">
        {{ t('fyndra.try') }}
        <span class="bg-gradient-to-r from-blue-500 to-sky-300 bg-clip-text text-transparent">
          Fyndra
        </span>
      </h1>
      
      <!-- Sottotitolo -->
      <p class="text-xl md:text-2xl">
        {{ t('fyndra.subtitle') }}
      </p>

      <!-- Barra di ricerca -->
      <div class="w-full max-w-md">
        <div class="flex items-center bg-white/10 border border-blue-500 rounded-full px-5 py-3 backdrop-blur-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            @focus="activateSearch"
            @input="onSearchInput"
            :placeholder="t('fyndra.placeholder')"
            class="ml-4 w-full bg-transparent focus:outline-none text-white placeholder-gray-400 text-base"
          />
        </div>
      </div>
    </div>

    <!-- Overlay di ricerca -->
    <div v-if="searchActive" class="search-overlay fixed inset-0 z-50 flex flex-col">
      <div class="bg-black/60 backdrop-blur-md flex items-center p-4">
        <input
          type="text"
          v-model="searchQuery"
          @input="onSearchInput"
          :placeholder="t('fyndra.placeholder')"
          class="w-full p-4 rounded-lg bg-white text-gray-900 focus:outline-none transition-all duration-300"
        />
        <button @click="deactivateSearch" class="ml-4 text-white">
          {{ t('search.cancel') }}
        </button>
      </div>
      <div class="flex-1 overflow-auto p-4">
        <div v-if="isSearching" class="text-center py-4">
          <p>{{ t('search.searching') }}</p>
        </div>
        <div v-else-if="searchResults.length === 0" class="text-center py-4">
          <p>{{ t('search.noResults') }}</p>
        </div>
        <div v-else class="space-y-8">
          <div v-for="(results, cat) in groupedResults" :key="cat">
            <div class="mb-4 border-b border-gray-500 pb-2">
              <h3 class="text-lg font-bold">{{ cat }}</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="result in results"
                :key="result.id"
                class="bg-black/30 backdrop-blur-md rounded p-4 cursor-pointer hover:bg-black/50 transition-colors duration-300 flex flex-col items-center"
                @click="goToAlternative(result.id)"
              >
                <div v-if="result.logo_path" class="mb-2">
                  <img :src="result.logo_path" alt="Logo" class="h-12 w-auto object-contain" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center">
                  {{ result.nome }}
                </h3>
                <p class="text-xs mt-1 text-center">
                  {{ result.descrizione_it.substring(0, 100) }}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { searchAlternatives } from '../services/alternativeService.js'

// Imposta i18n
const { t } = useI18n({ useScope: 'global' })

// Stati per la ricerca
const searchQuery = ref('')
const searchActive = ref(false)
const searchResults = ref([])
const isSearching = ref(false)
let searchTimeout = null

function activateSearch() {
  searchActive.value = true
}

function deactivateSearch() {
  searchActive.value = false
  searchQuery.value = ''
  searchResults.value = []
}

function goToAlternative(id) {
  deactivateSearch()
  window.location.href = `https://eu.bitcoinbeer.events/detail/${id}`
}

function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.trim() === '') {
      searchResults.value = []
      return
    }
    isSearching.value = true
    try {
      const results = await searchAlternatives(searchQuery.value)
      searchResults.value = results
    } catch (err) {
      console.error(err)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
}

const groupedResults = computed(() => {
  const groups = {}
  searchResults.value.forEach((result) => {
    const cat = result.categoria || 'Senza categoria'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(result)
  })
  return groups
})
</script>

<style scoped>
/* Animazione cosmic background */
@keyframes cosmic {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animate-cosmic {
  animation: cosmic 20s ease infinite;
}

/* Glow effect per il logo */
@keyframes glow-logo {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(0, 150, 255, 0.7));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(0, 150, 255, 1));
  }
}
.animate-glow-logo {
  animation: glow-logo 3s ease-in-out infinite;
}

/* Glow per l'elemento di sfondo della search bar */
@keyframes glow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.35;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.65;
  }
}
.animate-glow {
  animation: glow 6s ease-in-out infinite;
}

/* Fade-in per l'overlay di ricerca */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.search-overlay {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out forwards;
}

/* Effetto opzionale: campo stelle */
.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><circle cx="50" cy="50" r="1" fill="white"/><circle cx="100" cy="80" r="1" fill="white"/></svg>') repeat;
  opacity: 0.2;
  animation: starFade 2s linear infinite;
}
@keyframes starFade {
  0% { opacity: 0.2; }
  50% { opacity: 0.5; }
  100% { opacity: 0.2; }
}
</style>
