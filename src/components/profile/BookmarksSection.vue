<template>
  <div class="w-full max-w-3xl mb-16 mx-auto px-4 mt-8">
    <h3 class="text-2xl font-semibold text-white-400 mb-4">Bookmarks Blog</h3>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-6">
      <svg class="animate-spin h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    </div>

    <!-- No bookmarks -->
    <p v-else-if="bookmarkedArticles.length === 0" class="text-gray-400 italic">
      Non hai ancora aggiunto articoli ai preferiti.
    </p>

    <!-- Bookmarks list styled -->
    <div v-else class="space-y-4">
      <div
        v-for="article in bookmarkedArticles"
        :key="article.id"
        class="relative flex bg-black/20 rounded-lg p-4"
      >
        <img
          v-if="article.cover_image"
          :src="article.cover_image"
          alt="Cover"
          class="block w-20 h-20 object-cover rounded mr-4"
        />

        <div class="flex-1 pr-12">
          <p class="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
            {{ formatDate(article.created_at) }}
          </p>
          <h4 class="font-bold text-lg text-white break-words">
            {{ article.title }}
          </h4>
          <p class="text-gray-300 text-sm mt-1 break-words">
            {{ article.subtitle }}
          </p>
        </div>

        <!-- Toggle remove bookmark -->
        <label class="absolute top-4 right-4 cursor-pointer">
          <input
            type="checkbox"
            class="sr-only"
            :checked="true"
            @change.prevent="removeBookmark(article.id)"
          />
          <div class="w-10 h-6 bg-gray-400 rounded-full relative transition-colors bg-sky-500">
            <div
              class="h-5 w-5 bg-white rounded-full absolute top-0.5 left-5 transition-transform"
            />
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'BookmarksSection',
  setup() {
    const loading = ref(true);
    const bookmarks = ref([]);
    const bookmarkedArticles = ref([]);

    const formatDate = date => {
      try {
        return new Date(date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch {
        return '';
      }
    };

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('user_token');
        const res = await fetch('https://api.bitcoinbeer.events/api/get_profile.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (data.success) {
          bookmarks.value = data.data.user.bookmarks || [];
          await loadArticles();
        }
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    const loadArticles = async () => {
      const promises = bookmarks.value.map(id =>
        fetch(`https://api.bitcoinbeer.events/api/articles_api.php?id=${id}`)
          .then(r => r.json())
          .then(json => json.data)
          .catch(() => null)
      );
      const results = await Promise.all(promises);
      bookmarkedArticles.value = results.filter(a => a);
    };

    const removeBookmark = async articleId => {
      try {
        const token = localStorage.getItem('user_token');
        await fetch('https://api.bitcoinbeer.events/api/bookmark_api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, article_id: articleId, action: 'remove' })
        });
        bookmarks.value = bookmarks.value.filter(id => id !== articleId);
        bookmarkedArticles.value = bookmarkedArticles.value.filter(a => a.id !== articleId);
      } catch (e) {
        console.error('Errore rimuovendo preferito', e);
      }
    };

    onMounted(fetchProfile);

    return {
      loading,
      bookmarks,
      bookmarkedArticles,
      formatDate,
      removeBookmark
    };
  }
};
</script>

<style scoped>
:deep(.prose img) {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
