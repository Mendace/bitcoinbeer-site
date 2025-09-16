<template>
  <div class="p-4 bg-gray-800 rounded mb-2" :class="{ 'opacity-50': comment.status === 'pending' }">
    <!-- Se pending, mostraci un messaggio -->
    <div v-if="comment.status === 'pending'" class="text-sm text-blue-300 italic">
      [In attesa di moderazione]
    </div>

    <!-- Avatar e autore -->
    <div class="flex items-center space-x-2">
      <img :src="comment.avatar || defaultAvatar" alt="Avatar" class="w-8 h-8 rounded-full" />
      <span class="text-yellow-400 font-semibold">{{ comment.author }}</span>
    </div>

    <!-- Data -->
    <div class="flex justify-between items-center">
      <span class="text-gray-400 text-sm">{{ formatDate(comment.created_at) }}</span>
    </div>

    <!-- Se stiamo editando il contenuto -->
    <div v-if="isEditing" class="mt-2">
      <textarea
        v-model="editContent"
        rows="3"
        class="w-full px-2 py-1 rounded bg-gray-700 text-white border-none"
      ></textarea>
      <div class="mt-2 flex space-x-2">
        <button class="bg-blue-500 text-white px-2 py-1 rounded" @click="saveEdit">Salva</button>
        <button class="bg-gray-600 text-white px-2 py-1 rounded" @click="cancelEdit">Annulla</button>
      </div>
    </div>
    <!-- Altrimenti mostriamo il testo -->
    <div v-else class="mt-2 text-gray-200 whitespace-pre-line">
      {{ comment.content }}
    </div>

    <!-- Reazioni e pulsanti -->
    <div class="flex flex-wrap items-center space-x-3 mt-3">
      <template v-if="loggedIn">
        <button class="flex items-center space-x-1" @click="react('heart')">
          <span class="text-red-500">♥</span>
          <span class="text-sm text-gray-300">{{ comment.heart_count || 0 }}</span>
        </button>
        <button class="flex items-center space-x-1" @click="react('star')">
          <span class="text-yellow-400">★</span>
          <span class="text-sm text-gray-300">{{ comment.star_count || 0 }}</span>
        </button>
        <button class="flex items-center space-x-1" @click="react('thumbsup')">
          <span class="text-green-400">👍</span>
          <span class="text-sm text-gray-300">{{ comment.thumbsup_count || 0 }}</span>
        </button>
        <button class="flex items-center space-x-1" @click="react('thumbsdown')">
          <span class="text-red-400">👎</span>
          <span class="text-sm text-gray-300">{{ comment.thumbsdown_count || 0 }}</span>
        </button>
        <button class="text-sm text-blue-400 underline" @click="toggleReply">
          Rispondi
        </button>
        <template v-if="isOwner">
          <button class="text-sm text-green-400 underline" @click="startEdit">Modifica</button>
          <button class="text-sm text-red-400 underline" @click="deleteComment">Elimina</button>
        </template>
      </template>
      <template v-else>
        <span class="flex items-center space-x-1 text-gray-600">
          <span class="text-red-500">♥</span>
          <span class="text-sm text-gray-300">{{ comment.heart_count || 0 }}</span>
        </span>
        <span class="flex items-center space-x-1 text-gray-600">
          <span class="text-yellow-400">★</span>
          <span class="text-sm text-gray-300">{{ comment.star_count || 0 }}</span>
        </span>
        <span class="flex items-center space-x-1 text-gray-600">
          <span class="text-green-400">👍</span>
          <span class="text-sm text-gray-300">{{ comment.thumbsup_count || 0 }}</span>
        </span>
        <span class="flex items-center space-x-1 text-gray-600">
          <span class="text-red-400">👎</span>
          <span class="text-sm text-gray-300">{{ comment.thumbsdown_count || 0 }}</span>
        </span>
      </template>
    </div>

    <!-- Box rispondi -->
    <div v-if="showReply && loggedIn" class="mt-2">
      <textarea
        v-model="replyContent"
        rows="2"
        placeholder="La tua risposta..."
        class="w-full mb-1 px-2 py-1 rounded bg-gray-700 text-white border-none"
      ></textarea>
      <button class="bg-yellow-500 text-black px-2 py-1 rounded" @click="sendReply">
        Invia risposta
      </button>
    </div>
    <div v-else-if="showReply && !loggedIn" class="mt-2">
      <input
        type="text"
        v-model="replyAuthor"
        placeholder="Tuo nome (opz.)"
        class="w-full mb-1 px-2 py-1 rounded bg-gray-700 text-white border-none"
      />
      <textarea
        v-model="replyContent"
        rows="2"
        placeholder="La tua risposta..."
        class="w-full mb-1 px-2 py-1 rounded bg-gray-700 text-white border-none"
      ></textarea>
      <button class="bg-yellow-500 text-black px-2 py-1 rounded" @click="sendReply">
        Invia risposta
      </button>
    </div>

    <!-- Visualizzazione delle risposte -->
    <div v-if="comment.replies && comment.replies.length" class="mt-3">
      <button class="text-xs text-gray-500 underline" @click="collapsed = !collapsed">
        <span v-if="collapsed">▶ Mostra ({{ comment.replies.length }}) risposte</span>
        <span v-else>▼ Nascondi risposte</span>
      </button>
      <div v-if="!collapsed" class="ml-5 border-l border-gray-600 pl-3 mt-1">
        <CommentItem
          v-for="r in comment.replies"
          :key="r.id"
          :comment="r"
          :formatDate="formatDate"
          :refresh="refresh"
          :loggedIn="loggedIn"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'CommentItem',
  components: {
    CommentItem: () => import('./CommentItem.vue')
  },
  props: {
    comment: { type: Object, required: true },
    formatDate: { type: Function, required: true },
    refresh: { type: Function, required: true },
    loggedIn: { type: Boolean, default: false }
  },
  setup(props) {
    const isEditing = ref(false);
    const editContent = ref(props.comment.content);
    const collapsed = ref(true);
    const showReply = ref(false);
    const replyAuthor = ref('');
    const replyContent = ref('');

    const defaultAvatar = '/assets/default-avatar.png';

    // Confronta l'user_id salvato in localStorage con quello del commento (convertendo in Number)
    const isOwner = computed(() => {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      // Usa parsed.id se l'API restituisce "id" per l'utente
      return Number(parsed.id) === Number(props.comment.user_id);
    } catch (e) {
      return false;
    }
  }
  return false;
});


    function toggleReply() {
      showReply.value = !showReply.value;
    }

    function startEdit() {
      isEditing.value = true;
      editContent.value = props.comment.content;
    }
    function cancelEdit() {
      isEditing.value = false;
      editContent.value = props.comment.content;
    }

    async function saveEdit() {
      const token = localStorage.getItem('user_token');
      if (!token) {
        alert("Non sei autenticato!");
        return;
      }
      isEditing.value = false;
      try {
        const resp = await fetch(
          `https://api.bitcoinbeer.events/api/comments_api.php?action=edit&id=${props.comment.id}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: editContent.value, token: token })
          }
        );
        const data = await resp.json();
        if (data.success) {
          props.refresh();
        } else {
          console.error(data.error);
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function deleteComment() {
      if (!confirm("Sicuro di voler eliminare questo commento?")) return;
      const token = localStorage.getItem('user_token');
      if (!token) {
        alert("Non sei autenticato!");
        return;
      }
      try {
        const resp = await fetch(
          `https://api.bitcoinbeer.events/api/comments_api.php?action=delete&id=${props.comment.id}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token })
          }
        );
        const data = await resp.json();
        if (data.success) {
          props.refresh();
        } else {
          console.error(data.error);
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function react(actionType) {
      try {
        const token = localStorage.getItem('user_token') || "";
        const url = `https://api.bitcoinbeer.events/api/comments_api.php?action=${actionType}&id=${props.comment.id}&token=${token}`;
        const resp = await fetch(url, { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
          props.refresh();
        } else {
          console.error(data.error);
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function sendReply() {
      if (!replyContent.value.trim()) {
        alert("Testo della risposta vuoto");
        return;
      }
      try {
        const bodyObj = {
          article_id: props.comment.article_id,
          parent_id: props.comment.id,
          author: props.loggedIn
            ? JSON.parse(localStorage.getItem('user_data')).username
            : (replyAuthor.value || 'Anonimo'),
          content: replyContent.value
        };
        const token = localStorage.getItem('user_token');
        if (token) {
          bodyObj.token = token;
        }
        const resp = await fetch('https://api.bitcoinbeer.events/api/comments_api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyObj)
        });
        const data = await resp.json();
        if (data.success) {
          props.refresh();
        } else {
          console.error(data.error);
        }
      } catch (e) {
        console.error(e);
      }
      showReply.value = false;
      replyAuthor.value = '';
      replyContent.value = '';
    }

    return {
      isEditing,
      editContent,
      collapsed,
      showReply,
      replyAuthor,
      replyContent,
      isOwner,
      defaultAvatar,
      toggleReply,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteComment,
      react,
      sendReply
    };
  }
};
</script>
