<template>
  <div class="contact-section bg-black text-white py-16 min-h-screen">
    <div
      class="grid max-w-screen-xl grid-cols-1 gap-8 px-8 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32">
      <div class="flex flex-col justify-between">
        <div class="space-y-2">
          <h2 class="text-4xl font-bold leading-tight lg:text-5xl">
            {{ $t("contact.title") }}
          </h2>
          <div class="text-gray-400">
            {{ $t("contact.subtitle") }}
          </div>
        </div>
        <img src="/animate/Contact us.gif" alt="Illustrazione" class="p-6 h-auto max-h-96" />
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="text-sm">{{ $t("contact.name") }}</label>
          <input id="name" type="text" v-model="form.name" :placeholder="$t('contact.placeholderName')"
            class="w-full p-3 rounded bg-gray-700 text-white" />
        </div>
        <div>
          <label for="email" class="text-sm">{{ $t("contact.email") }}</label>
          <input id="email" type="email" v-model="form.email" :placeholder="$t('contact.placeholderEmail')"
            class="w-full p-3 rounded bg-gray-700 text-white" />
        </div>
        <div>
          <label for="message" class="text-sm">{{ $t("contact.message") }}</label>
          <textarea id="message" rows="3" v-model="form.message" :placeholder="$t('contact.placeholderMessage')"
            class="w-full p-3 rounded bg-gray-700 text-white"></textarea>
        </div>
        <button type="submit"
          class="w-full p-3 text-sm font-bold tracking-wide uppercase rounded bg-orange-600 hover:bg-orange-700">
          {{ $t("contact.button") }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    async handleSubmit() {
      // Controllo sui campi obbligatori
      if (!this.form.name || !this.form.email || !this.form.message) {
        alert(this.$t("contact.error"));
        return;
      }

      try {
        const response = await fetch('https://api.bitcoinbeer.events/send-email-site.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: 'prato@bitcoinbeer.events',
            subject: 'Contatto dal sito Bitcoin Beer',
            message: `Nome: ${this.form.name}\nEmail: ${this.form.email}\nMessaggio: ${this.form.message}`,
          }),
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          console.error('Errore backend:', result.message);
          alert(result.message);
          return;
        }

        alert(this.$t('contact.success'));
        this.form.name = '';
        this.form.email = '';
        this.form.message = '';
      } catch (error) {
        console.error('Errore durante la richiesta:', error);
        alert(this.$t('contact.errorSend'));
      }
    },
  },
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}

.contact-section {
  padding-top: 10rem;
  min-height: 100vh;
}

img {
  object-fit: contain;
  max-height: 24rem;
  /* Ingrandisce la gif */
}
</style>
