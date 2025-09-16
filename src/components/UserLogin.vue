<template>
    <div class="p-4 bg-gray-900 rounded">
      <h2 class="text-xl font-bold text-yellow-400">Login con Private Key</h2>
      <input
        v-model="privateKey"
        type="text"
        placeholder="Inserisci la tua private key"
        class="w-full p-2 my-2 rounded bg-gray-700 text-white border"
      />
      <button @click="login" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Login
      </button>
      <p v-if="message" class="mt-2 text-gray-300">{{ message }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const privateKey = ref('');
  const message = ref('');
  
  const login = async () => {
    if (!privateKey.value.trim()) {
      message.value = 'Inserisci la private key.';
      return;
    }
    try {
      const response = await fetch('https://api.bitcoinbeer.events/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ private_key: privateKey.value.trim() })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user_token', data.data.token);
        message.value = 'Login effettuato con successo!';
      } else {
        message.value = 'Errore: ' + data.error;
      }
    } catch (e) {
      message.value = 'Errore di rete.';
      console.error(e);
    }
  };
  </script>
  