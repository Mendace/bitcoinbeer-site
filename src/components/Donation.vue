<template>
  <section class="w-full px-4 py-16 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold">{{ $t("donation.supportProject") }}</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-4">
        {{ $t("donation.choosePlan") }}
      </p>
    </div>
    <div class="grid gap-8 md:grid-cols-3">
      <!-- Piano Early Supporter -->
      <div class="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        <h3 class="text-2xl font-semibold mb-4">{{ $t("donation.earlySupporter") }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ $t("donation.earlySupporterDesc") }}
        </p>
        <p class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">€2</p>
        <button
          @click="submitDonation('early bird', 'Donazione 2 euro', 2)"
          class="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition duration-300 transform hover:scale-110"
        >
          {{ $t("donation.donateNow") }}
        </button>
      </div>

      <!-- Piano Adopter -->
      <div class="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center border border-orange-500 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        <h3 class="text-2xl font-semibold mb-4 text-orange-500">
          {{ $t("donation.adopter") }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ $t("donation.adopterDesc") }}
        </p>
        <p class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">€10</p>
        <button
          @click="submitDonation('adopter', 'Donazione 10 euro', 10)"
          class="px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-400 dark:bg-orange-600 dark:hover:bg-orange-500 text-gray-900 dark:text-gray-100 font-semibold transition duration-300 transform hover:scale-110"
        >
          {{ $t("donation.donateNow") }}
        </button>
      </div>

      <!-- Piano Superhero -->
      <div class="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        <h3 class="text-2xl font-semibold mb-4">{{ $t("donation.superhero") }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ $t("donation.superheroDesc") }}
        </p>
        <p class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">€50</p>
        <button
          @click="submitDonation('superhero', 'Donazione 50 euro', 50)"
          class="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition duration-300 transform hover:scale-110"
        >
          {{ $t("donation.donateNow") }}
        </button>
      </div>
    </div>
    <!-- Hidden Form -->
    <form
      ref="donationForm"
      method="POST"
      action="https://pos.btcpayserver.it/api/v1/invoices"
      class="hidden"
    >
      <input type="hidden" name="storeId" value="BeJaaru2ZWzQ6Y1CrA243gXK8NRxZQwNpvqHn6Kt5QVV" />
      <input type="hidden" name="orderId" />
      <input type="hidden" name="checkoutDesc" />
      <input type="hidden" name="browserRedirect" value="https://bitcoinbeer.events" />
      <input type="hidden" name="notifyEmail" value="prato@bitcoinbeer.events" />
      <input type="hidden" name="price" />
      <input type="hidden" name="currency" value="EUR" />
    </form>
  </section>
</template>

<script>
export default {
  methods: {
    submitDonation(orderId, description, price) {
      const form = this.$refs.donationForm;
      form.orderId.value = orderId;
      form.checkoutDesc.value = description;
      form.price.value = price;
      form.submit();
    },
  },
};
</script>

<style scoped>
/* Sfondo della sezione */
section {
  background: linear-gradient(135deg, #000000, #121212); /* Sfondo elegante scuro */
  color: white;
  padding: 4rem 2rem; /* Più spazio attorno alla sezione */
}

/* Griglia delle card */
.grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adatta le card a schermi più piccoli */
  gap: 2rem; /* Aggiunge spaziatura tra le card */
  max-width: 1200px; /* Limita la larghezza massima */
  margin: 0 auto; /* Centra il contenitore */
}

/* Card con Glass Morphism */
.bg-gray-200,
.dark\:bg-gray-800 {
  background: rgba(255, 255, 255, 0.1); /* Sfondo trasparente */
  border: 1px solid rgba(255, 255, 255, 0.2); /* Bordo sottile */
  backdrop-filter: blur(15px); /* Effetto sfocatura */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); /* Ombra diffusa */
  border-radius: 16px; /* Bordo arrotondato */
  padding: 1.5rem; /* Riduce il padding interno */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bg-gray-200:hover,
.dark\:bg-gray-800:hover {
  transform: scale(1.05); /* Animazione al passaggio del mouse */
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5); /* Ombra più intensa */
}

/* Titolo delle card */
h3 {
  color: white;
  font-size: 1.5rem; /* Riduce leggermente il font */
  margin-bottom: 0.75rem;
}

/* Prezzo */
.text-3xl {
  color: white;
  font-weight: bold;
}

/* Pulsanti */
button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: bold;
  text-align: center;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
}

/* Pulsante speciale (Adopter) */
.bg-orange-500 {
  background: linear-gradient(135deg, #ff8c00, #ffa500); /* Gradiente arancione */
}

.bg-orange-500:hover {
  background: linear-gradient(135deg, #ff7400, #ff8c00); /* Gradiente più scuro */
}
</style>
