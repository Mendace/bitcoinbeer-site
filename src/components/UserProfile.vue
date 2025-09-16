<template>
    <div class="p-4 bg-gray-900 rounded">
      <h2 class="text-xl font-bold text-yellow-400 mb-4">Aggiorna Profilo</h2>
      <div class="mb-4">
        <label class="block text-gray-300 mb-1" for="username">Nome Utente</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Inserisci il tuo nome utente"
          class="w-full p-2 rounded bg-gray-700 text-white border"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-300 mb-1" for="avatar">Avatar (max 2MB, jpg/png/gif)</label>
        <input
          id="avatar"
          type="file"
          @change="onFileChange"
          class="w-full p-2 rounded bg-gray-700 text-white border"
        />
      </div>
      <button @click="updateProfile" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Aggiorna Profilo
      </button>
      <p v-if="message" class="mt-2 text-gray-300">{{ message }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const username = ref('');
  const avatarFile = ref(null);
  const message = ref('');
  
  function onFileChange(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      avatarFile.value = files[0];
    }
  }
  
  async function updateProfile() {
    const token = localStorage.getItem('user_token');
    if (!token) {
      message.value = 'Devi essere loggato per aggiornare il profilo.';
      return;
    }
    const formData = new FormData();
    formData.append('token', token);
    formData.append('username', username.value);
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value);
    }
    try {
      const response = await fetch('https://api.bitcoinbeer.events/api/update_profile.php', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        message.value = 'Profilo aggiornato con successo!';
      } else {
        message.value = 'Errore: ' + data.error;
      }
    } catch (e) {
      console.error(e);
      message.value = 'Errore di rete durante l’aggiornamento del profilo.';
    }
  }
  </script>
  
  <style scoped>
  /* Stili personalizzati per il componente */
  </style>
  