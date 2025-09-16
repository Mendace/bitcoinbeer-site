<template>
	<!-- Sezione articoli senza sfondo aggiuntivo -->
	<section class="py-12 text-white">
	  <div class="container mx-auto px-6 space-y-10">
		<!-- Titolo sezione -->
		<h2 class="text-2xl md:text-3xl font-extrabold mb-8 underline decoration-white/40">
		  Articoli Recenti
		</h2>
  
		<!-- Griglia articoli -->
		<div
		  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
		>
		  <article
			v-for="article in displayedArticles"
			:key="article.id"
			class="group"
		  >
			<a
			  :href="`/article/${article.id}`"
			  class="block overflow-hidden rounded-lg"
			>
			  <img
				:src="article.cover_image"
				:alt="`Copertina di ${article.title}`"
				class="w-full h-40 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
			  />
			</a>
  
			<h3 class="mt-4 text-lg font-semibold leading-snug">
			  {{ article.title }}
			</h3>
		  </article>
		</div>
  
		<!-- Pulsante "Vedi tutti" se ci sono più articoli -->
		<div v-if="articles.length > displayedArticles.length" class="text-center mt-10">
		  <a
			href="/BlogMain"
			class="inline-block px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-md shadow-md transition"
		  >
			Vedi tutti
		  </a>
		</div>
	  </div>
	</section>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		articles: [],
		error: null,
	  };
	},
	computed: {
	  // Mostriamo i primi 6 articoli
	  displayedArticles() {
		return this.articles.slice(0, 6);
	  },
	},
	mounted() {
	  fetch("https://api.bitcoinbeer.events/api/articles_api.php")
		.then((response) => {
		  if (!response.ok) throw new Error(`Errore API: ${response.status}`);
		  return response.json();
		})
		.then((data) => {
		  if (data.success) {
			this.articles = data.data;
		  } else {
			this.error = data.error || "Errore sconosciuto.";
		  }
		})
		.catch((err) => (this.error = `Errore nella richiesta API: ${err.message}`));
	},
  };
  </script>
  
  <style scoped>
  /* Nessuno sfondo speciale; testo già bianco dalla sezione */
  h3 {
	color: inherit;
  }
  </style>
  