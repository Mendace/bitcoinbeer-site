<template>
<section class="min-h-screen bg-gradient-to-b bg-gradient-to-b from-black to-slate-900 text-white font-inter">
    <!-- ░░░ FILTER BAR (sempre in alto) ░░░ -->
    <div class="mx-auto max-w-screen-xl px-4 md:px-8 pt-24 lg:pt-32">
      <div class="w-full md:w-2/3 lg:w-1/2 mx-auto
                  bg-white/10 backdrop-blur-md rounded-xl p-6
                  flex flex-col md:flex-row gap-4 items-center">

        <!-- search -->
        <div class="relative flex-1">
          <input v-model="searchTerm" type="text" placeholder="Cerca..."
                 class="search-input w-full px-4 py-2 rounded-full placeholder-gray-300 bg-gray-800 text-white">
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 16l-4.293 4.293a1 1 0 001.414 1.414L9.414 17.414
                       A8 8 0 1116 8a7.964 7.964 0 01-1.414 4.586
                       l4.293 4.293a1 1 0 001.414-1.414L18 11.586" />
            </svg>
          </span>
        </div>

        <!-- category -->
        <select v-model="selectedCategory"
                class="px-4 py-2 bg-transparent text-white border border-white/20
                       rounded-full focus:outline-none">
          <option value="">Tutte</option>
          <option v-for="c in allCategories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>

    <!-- ░░░ HERO + TOP STORIES ░░░ -->
    <div class="mx-auto max-w-screen-xl px-4 md:px-8 pt-16 lg:pt-20">

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

        <!-- ── HERO (col-span-8) ── -->
        <div class="lg:col-span-8">
          <a v-if="featuredArticle.id" :href="link(featuredArticle)" class="block overflow-hidden">
            <img :src="featuredArticle.cover_image"
                 class="w-full aspect-[16/9] object-cover lg:translate-x-6
                        transition-transform duration-300 hover:scale-105"/>
          </a>

          <header v-if="featuredArticle.id" class="mt-6 lg:mt-10 max-w-4xl">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <a :href="link(featuredArticle)" class="hover:text-yellow-400">
                {{ featuredArticle.title }}
              </a>
            </h1>
            <p v-if="featuredArticle.subtitle" class="mt-4 text-gray-300 text-lg lg:text-xl">
              {{ featuredArticle.subtitle }}
            </p>
            <time class="mt-4 block text-sm text-gray-400 uppercase tracking-wider">
              {{ formatDate(featuredArticle.created_at) }}
            </time>
          </header>
        </div>

        <!-- ── TOP STORIES (col-span-4) ── -->
        <aside class="lg:col-span-4">
          <h2 class="text-lg font-bold uppercase tracking-wider text-gray-300 mb-6 lg:mb-8">
            Ultimi articoli
          </h2>
          <ul class="space-y-6 lg:space-y-8">
            <li v-for="a in recentArticles" :key="a.id" class="flex items-start gap-4 group">
              <a :href="link(a)" class="flex-shrink-0 w-20 h-20 overflow-hidden block">
                <img :src="a.cover_image" class="w-full h-full object-cover"/>
              </a>
              <div class="flex-1">
                <h3 class="text-base font-semibold leading-snug">
                  <a :href="link(a)" class="hover:text-yellow-400">{{ a.title }}</a>
                </h3>
                <time class="text-xs text-gray-500">{{ formatDate(a.created_at) }}</time>
              </div>
            </li>
          </ul>
        </aside>

      </div>
    </div>

    <!-- ░░░ ALTRI ARTICOLI ░░░ -->
    <div class="mx-auto max-w-screen-xl px-4 md:px-8 pt-20 pb-24 space-y-12">

    <article
      v-for="a in additionalArticles"
      :key="a.id"
      class="flex items-start gap-4 md:gap-8 border-t border-white/10 pt-8"
    >
      <!-- TESTO (sempre a sinistra) -->
      <div class="flex-1">
        <h3 class="text-xl md:text-2xl font-bold text-yellow-400">
          <a :href="link(a)" class="hover:text-yellow-300">{{ a.title }}</a>
        </h3>

        <p v-if="a.subtitle"
          class="mt-2 text-gray-300 line-clamp-3 md:line-clamp-none">
          {{ a.subtitle }}
        </p>

        <time class="mt-3 block text-xs text-gray-500 uppercase tracking-wide">
          {{ formatDate(a.created_at) }}
        </time>
      </div>

      <!-- THUMB (sempre a destra) -->
      <a :href="link(a)"
        class="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden block">
        <img :src="a.cover_image"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </a>
    </article>

    </div>

    <!-- PAGINAZIONE -->
    <div class="flex justify-center items-center pb-24" v-if="totalPages > 1">
      <button @click="loadPreviousPage" :disabled="currentPage===1"
              class="px-5 py-2 rounded-l-full bg-white/10 hover:bg-white/20 disabled:opacity-50">
        Prev
      </button>
      <span class="px-4 py-2 bg-white/10">{{ currentPage }} / {{ totalPages }}</span>
      <button @click="loadNextPage" :disabled="currentPage===totalPages"
              class="px-5 py-2 rounded-r-full bg-white/10 hover:bg-white/20 disabled:opacity-50">
        Next
      </button>
    </div>

  </section>
</template>

<script setup>
/* ------------- HEAD (lascia invariato) ------------- */
import { useHead } from '@vueuse/head'
import { ref, watch, onMounted, computed } from 'vue'

useHead({

title: 'Bitcoin Beer Blog - Notizie, Guide e Approfondimenti su Bitcoin e Tecnologia',

meta: [

{ name: 'description', content: 'Tieniti aggiornato con Bitcoin Beer Blog: notizie, guide e approfondimenti su Bitcoin, blockchain e tecnologia. Scopri di più.' },

{ name: 'keywords', content: 'Bitcoin, Tecnologia, Blockchain, Notizie Bitcoin, Guide Bitcoin, Sicurezza, Blog Tecnologico, Meetup Bitcoin, Eventi Bitcoin Italia' },

{ name: 'author', content: 'BitcoinBeerBlog' },

{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' },

{ name: 'robots', content: 'index, follow' },

{ name: 'language', content: 'Italian' },

{ name: 'revisit-after', content: '7 days' },

{ property: 'og:title', content: 'Bitcoin Beer Blog - Notizie e Guide su Bitcoin e Tecnologia' },

{ property: 'og:description', content: 'Tieniti aggiornato con Bitcoin Beer Blog: notizie, guide e approfondimenti su Bitcoin, blockchain e tecnologia.' },

{ property: 'og:image', content: '/assets/blog.webp' },

{ property: 'og:url', content: 'https://bitcoinbeer.events/blogmain' },

{ property: 'og:type', content: 'website' },

{ property: 'og:locale', content: 'it_IT' },

{ property: 'og:site_name', content: 'Bitcoin Beer Blog' },

{ name: 'twitter:card', content: 'summary_large_image' },

{ name: 'twitter:title', content: 'Bitcoin Beer Blog - Notizie e Guide su Bitcoin e Tecnologia' },

{ name: 'twitter:description', content: 'Tieniti aggiornato con Bitcoin Beer Blog: notizie e approfondimenti su Bitcoin, blockchain e tecnologia.' },

{ name: 'twitter:image', content: '/assets/blog.webp' },

{ name: 'twitter:site', content: '@bitcoinbeer' },

{ name: 'twitter:creator', content: '@bitcoinbeer' },

],

link: [

{ rel: 'canonical', href: 'https://bitcoinbeer.events/blogmain' },

],

script: [

{

type: 'application/ld+json',

children: JSON.stringify({

'@context': 'https://schema.org',

'@type': 'Blog',

name: 'Bitcoin Beer Blog',

description: 'Tieniti aggiornato con Bitcoin Beer Blog: notizie, guide e approfondimenti su Bitcoin, blockchain e tecnologia.',

url: 'https://bitcoinbeer.events/blogmain',

publisher: {

'@type': 'Organization',

name: 'Bitcoin Beer',

logo: {

'@type': 'ImageObject',

url: '/assets/blog.webp',

},

},

blogPost: [

{

'@type': 'BlogPosting',

headline: '{{ featuredArticle.title }}',

image: '{{ featuredArticle.cover_image }}',

author: {

'@type': 'Person',

name: 'BitcoinBeer',

},

datePublished: '{{ featuredArticle.created_at }}',

dateModified: '{{ featuredArticle.updated_at }}',

description: '{{ featuredArticle.subtitle }}',

url: '/article/{{ featuredArticle.id }}',

keywords: 'Bitcoin, Tecnologia, Blockchain, Notizie Bitcoin, Guide Bitcoin, Meetup Bitcoin, Eventi Bitcoin Italia',

interactionStatistic: {

'@type': 'InteractionCounter',

interactionType: 'https://schema.org/CommentAction',

userInteractionCount: '{{ featuredArticle.comments_count }}',

},

},

],

}),

},

],

});

/* ------------- stato e fetch (identico) ------------- */
const allArticles = ref([])
const featuredArticle = ref({})
const recentArticles = ref([])
const additionalArticles = ref([])
const error = ref(null)

const currentPage = ref(1)
const hasMorePages = ref(true)

const searchTerm = ref('')
const selectedCategory = ref('')

onMounted(fetchArticles)
function fetchArticles () {
  fetch(`https://api.bitcoinbeer.events/api/articles_api.php?page=${currentPage.value}`)
    .then(r => { if (!r.ok) throw new Error('net'); return r.json() })
    .then(d => {
      if (d.success) {
        allArticles.value = d.data
        hasMorePages.value = d.hasMorePages ?? false
        applyFilter()
      } else error.value = d.error || 'Errore'
    })
    .catch(e => error.value = e.message)
}

function applyFilter () {
  let list = [...allArticles.value]
  const s = searchTerm.value.trim().toLowerCase()
  if (s) list = list.filter(a =>
      (a.title||'').toLowerCase().includes(s) ||
      (a.subtitle||'').toLowerCase().includes(s) ||
      (a.content||'').toLowerCase().includes(s))
  if (selectedCategory.value) {
    list = list.filter(a => (a.categories||'').toLowerCase().includes(selectedCategory.value.toLowerCase()))
  }
  featuredArticle.value = list[0] || {}
  recentArticles.value  = list.slice(1,4)
  additionalArticles.value = list.slice(4)
}
watch([searchTerm,selectedCategory], applyFilter)

/* paginazione */
function loadPreviousPage(){ if(currentPage.value>1){currentPage.value--;fetchArticles()} }
function loadNextPage(){ if(hasMorePages.value){currentPage.value++;fetchArticles()} }
const totalPages = computed(()=>hasMorePages.value ? currentPage.value+1 : currentPage.value)

/* helpers */
const link = a => `/article/${a.id}`
function formatDate(d){try{return new Date(d).toLocaleDateString('it-IT',{day:'numeric',month:'short'}).toUpperCase()}catch{return''}}

const allCategories = computed(() => {
  const s = new Set()
  allArticles.value.forEach(a => (a.categories||'').split(',').forEach(c => s.add(c.trim())))
  return [...s].filter(Boolean)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
.font-inter{font-family:'Inter',sans-serif}

.line-clamp-3{-webkit-line-clamp:3;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}

.search-input{border:2px solid rgba(255,255,255,.2);border-radius:9999px;background:#1f2937;transition:.3s}
.search-input:focus{box-shadow:0 0 10px 2px #facc15,0 0 20px 5px #ea580c;outline:none}
</style>
