<template>
  <section class="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen relative">
    <!-- Hero Section -->
    <div
      class="relative w-full h-96 bg-cover bg-center flex items-center justify-center"
      :style="{ backgroundImage: 'url(/assets/blog-hero.jpg)' }"
    >
      <div class="absolute inset-0 bg-black opacity-60"></div>
      <div class="relative z-10 text-center px-6">
        <!-- Logo del blog -->
        <img
          src="/assets/ilBlog.png"
          alt="BitcoinBeer Blog"
          class="mx-auto mb-4 w-48 sm:w-64 h-auto"
        />
        <p class="text-lg md:text-xl text-gray-300">
          Bitcoin spiegato bene.
        </p>
      </div>
    </div>

    <!-- Articolo -->
    <div v-if="article" class="container mx-auto px-6 md:px-12 lg:px-20 py-12">
      <div class="mx-auto max-w-2xl">
        <!-- Badge e data -->
        <div class="flex flex-wrap items-center space-x-4 mb-4">
          <span
            v-for="cat in categoriesList"
            :key="cat"
            class="border border-yellow-500 text-yellow-500 px-2 py-1 rounded-md text-sm font-medium bg-transparent"
          >{{ cat }}</span>
          <span class="text-gray-400 text-sm">{{ formatDate(article.created_at) }}</span>
        </div>

        <!-- Titolo e sottotitolo -->
        <div class="mb-8 text-left">
          <h1 class="text-4xl md:text-5xl font-extrabold text-yellow-400 drop-shadow-lg leading-tight">
            {{ article.title }}
          </h1>
          <p class="text-lg md:text-xl text-gray-400 italic mt-2 leading-relaxed">
            {{ article.subtitle }}
          </p>
        </div>

        <!-- Bottoni Condividi e Preferiti -->
        <div class="flex items-center justify-start space-x-4 mb-8 relative">
          <button
            @click="toggleShareMenu"
            class="flex items-center px-3 py-2 border border-blue-500 text-blue-500 rounded-md shadow-sm hover:bg-blue-500 hover:text-white transition-colors duration-200"
          >
            <i class="fas fa-share-alt mr-2"></i>Condividi
          </button>
          <button
            @click="toggleBookmark"
            :class="[
              'flex items-center px-3 py-2 rounded-md shadow-sm transition-colors duration-200',
              isBookmarked
                ? 'bg-yellow-500 text-black border border-transparent'
                : 'border border-gray-500 text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white'
            ]"
          >
            <i class="fas fa-bookmark mr-2"></i>
            <span>{{ isBookmarked ? 'Pref. Salvato' : 'Preferiti' }}</span>
          </button>

          <!-- Dropdown Condivisione -->
          <div v-if="showShareMenu" class="absolute top-full mt-2 bg-white text-black rounded-md shadow-lg z-50 w-48">
            <ul>
              <li><a @click.prevent="share('facebook')" href="#" class="block px-4 py-2 hover:bg-gray-100">Facebook</a></li>
              <li><a @click.prevent="share('twitter')" href="#" class="block px-4 py-2 hover:bg-gray-100">X (Twitter)</a></li>
              <li><a @click.prevent="share('email')" href="#" class="block px-4 py-2 hover:bg-gray-100">Email</a></li>
              <li><a @click.prevent="share('whatsapp')" href="#" class="block px-4 py-2 hover:bg-gray-100">Whatsapp</a></li>
            </ul>
          </div>
        </div>

        <!-- Cover Image -->
        <div class="mb-8 mt-4">
          <img :src="article.cover_image" alt="Cover" class="w-full object-contain rounded-lg shadow-md" />
        </div>

        <!-- Banner AD -->
        <div class="relative w-full mb-8 h-25 rounded-lg overflow-hidden shadow-lg">
          <a href="https://bitbox.swiss/it/bitbox02/?utm_source=bitcoinbeer&utm_medium=webcast&utm_campaign=landingpage&ref=XiwIgfY4X6mvWS" target="_blank">
            <img src="/public/assets/bitbox-banner.png" alt="Banner" class="w-full h-full object-cover" />
          </a>
        </div>

        <!-- Autore e avatar -->
        <div class="flex items-center space-x-4 mb-12">
          <img
            :src="article.author_logo"
            alt="Autore"
            class="w-12 h-12 rounded-full shadow-md border border-yellow-500"
          />
          <div>
            <p class="text-lg font-semibold text-yellow-400">{{ article.author }}</p>
            <p class="text-gray-400">Pubblicato il {{ formatDate(article.created_at) }}</p>
          </div>
        </div>

      </div>

      <!-- Contenuto Principale -->
      <article class="prose prose-xl prose-invert mx-auto max-w-2xl leading-relaxed">
        <p>{{ article.intro }}</p>
        <figure class="my-8 text-center">
          <img
            :src="article.image"
            alt=""
            class="rounded-lg shadow-md w-4/5 mx-auto max-w-md"
          />
          <figcaption class="text-gray-500 mt-2 text-sm">{{ article.image_caption }}</figcaption>
        </figure>
        <div v-html="article.content" class="leading-loose text-gray-300 overflow-x-auto"></div>
        <p>{{ article.conclusion }}</p>
      </article>

      <!-- Footer Banner -->
      <div class="relative mx-auto w-full max-w-2xl mt-8 h-25 rounded-lg overflow-hidden shadow-lg">
        <a href="https://go.getproton.me/SH1Ma" target="_blank">
          <img src="/public/assets/VPN_HSD_950X200@2x.png" alt="Footer Banner" class="w-full h-full object-cover" />
        </a>
      </div>

      <!-- Commenti -->
      <Comments :articleId="id" />

      <!-- Blog Correlati -->
      <div class="mt-32 mx-auto max-w-6xl">
        <Blog />
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50"
    >
      {{ toastMessage }}
    </div>
  </section>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useHead } from "@vueuse/head";
import Blog from "../components/Blog.vue";
import Comments from "../components/Comments.vue";

export default {
  name: "Article",
  components: { Blog, Comments },
  props: {
    id: { type: [String, Number], required: true, validator: v => !isNaN(parseInt(v)) },
  },
  setup(props) {
    const article = ref(null);
    const showShareMenu = ref(false);
    const isBookmarked = ref(false);
    const toastMessage = ref("");
    const showToast = ref(false);

    const triggerToast = msg => {
      toastMessage.value = msg;
      showToast.value = true;
      setTimeout(() => (showToast.value = false), 3000);
    };

    const fetchArticle = async () => {
      try {
        const res = await fetch(`https://api.bitcoinbeer.events/api/articles_api.php?id=${props.id}`);
        const data = await res.json();
        if (data.success) {
          article.value = data.data;

          // Imposta i meta tag dinamici
          useHead({
            title: article.value.meta_title || article.value.title,
            meta: [
              { name: 'description', content: article.value.meta_description || article.value.subtitle },
              { name: 'keywords', content: article.value.meta_keywords },
              { property: 'og:title', content: article.value.meta_title || article.value.title },
              { property: 'og:description', content: article.value.meta_description || article.value.subtitle },
              { property: 'og:image', content: article.value.og_image || article.value.cover_image },
              { property: 'og:type', content: 'article' },
              { property: 'og:url', content: window.location.href },
              { name: 'twitter:card', content: 'summary_large_image' },
              { name: 'twitter:title', content: article.value.meta_title || article.value.title },
              { name: 'twitter:description', content: article.value.meta_description || article.value.subtitle },
              { name: 'twitter:image', content: article.value.og_image || article.value.cover_image }
            ]
          });

          // Inizializza bookmark
          const token = localStorage.getItem('user_token');
          if (token) {
            const prof = await fetch('https://api.bitcoinbeer.events/api/get_profile.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
            }).then(r => r.json());
            if (prof.success) {
              isBookmarked.value = (prof.data.user.bookmarks || []).includes(article.value.id);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    const toggleBookmark = async () => {
      const token = localStorage.getItem('user_token');
      if (!token) {
        triggerToast('Effettua il login per salvare i preferiti');
        return;
      }
      try {
        const action = isBookmarked.value ? 'remove' : 'add';
        const res = await fetch('https://api.bitcoinbeer.events/api/bookmark_api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, article_id: props.id, action })
        });
        const result = await res.json();
        if (result.success) {
          isBookmarked.value = !isBookmarked.value;
          triggerToast(isBookmarked.value ? 'Aggiunto ai preferiti!' : 'Rimosso dai preferiti');
        } else {
          triggerToast('Errore durante il salvataggio');
        }
      } catch (e) {
        console.error(e);
        triggerToast('Errore di rete');
      }
    };

    onMounted(fetchArticle);

    const categoriesList = computed(() =>
      article.value && article.value.categories
        ? article.value.categories.split(',').map(c => c.trim())
        : []
    );

    const formatDate = date => {
      try { return new Date(date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' }); }
      catch { return ''; }
    };

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const toggleShareMenu = () => {
      if (isMobile && navigator.share) navigator.share({ title: article.value.title, url: location.href });
      else showShareMenu.value = !showShareMenu.value;
    };
    const share = platform => {
      const url = encodeURIComponent(location.href);
      const text = encodeURIComponent(article.value.title);
      let shareUrl = '';
      switch (platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareUrl = `https://twitter.com/share?url=${url}&text=${text}`; break;
        case 'email': shareUrl = `mailto:?subject=${text}&body=${url}`; break;
        case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`; break;
      }
      window.open(shareUrl, '_blank');
      showShareMenu.value = false;
    };

    return {
      article,
      showShareMenu,
      toggleShareMenu,
      share,
      categoriesList,
      formatDate,
      isBookmarked,
      toggleBookmark,
      toastMessage,
      showToast
    };
  }
};
</script>


<style scoped>
:deep(u) {
  background: linear-gradient(to right, #ffa200, #ffda47); /* da arancione a giallo */
  text-decoration: none;
  background-repeat: no-repeat;
  background-size: 100% 0.1em;
  background-position: 0 100%;
  padding-bottom: 2px;
}

:deep(.prose img) {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
/* Rendere responsive le tabelle */
:deep(.prose table) {
  width: 100%;
  display: block;
  overflow-x: auto;
}

:deep(.prose) {
  line-height: 1.8;
  letter-spacing: 0.01em;
}

:deep(figcaption),
:deep(.text-gray-400) {
  color: #d1d5db; /* più leggibile sul nero */
}

:deep(article img) {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
}

:deep(blockquote) {
  border-left: 4px solid #facc15;
  padding-left: 1rem;
  font-style: italic;
  color: #d4d4d4;
  background: rgba(255,255,255,0.03);
}

:deep(a) {
  color: #facc15;
  text-decoration: underline dotted;
}
:deep(a:hover) {
  color: #fde68a;
}

:deep(pre), :deep(code) {
  background: #1e1e1e;
  color: #facc15;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

:deep(.callout) {
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid #f59e0b;
  padding: 1rem;
  margin: 2rem 0;
  color: #f3f4f6;
  border-radius: 6px;
}


@media (max-width: 640px) {
  :deep(h1) {
    font-size: 1.875rem;
  }
  :deep(.prose) {
    font-size: 1rem;
    padding: 0 1rem;
  }
}

</style>
