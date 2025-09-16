<template>
  <section class="h-screen bg-black text-white relative">
    <!-- Effetto Matrix -->
    <div class="absolute inset-0 overflow-hidden">
      <canvas id="matrix-effect" class="w-full h-full"></canvas>
    </div>

    <!-- Titolo e Descrizione -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full">
      <h2 class="text-5xl font-extrabold glowing-text mb-6 text-center">
        {{ $t("bitcoin.title") }}
      </h2>
      <p class="text-lg mb-8 opacity-80 text-center">
        {{ $t("bitcoin.description") }}
      </p>
      <button
        @click="scrollToSection"
        class="relative inline-block py-3 px-6 font-bold text-white border border-white rounded-full overflow-hidden group focus:outline-none focus:ring-4 focus:ring-orange-500"
        >
        <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          <span class="relative z-10">{{ $t("bitcoin.findChapter") }}</span>
      </button>
    </div>
  </section>

  <section class="py-16 bg-gradient-to-b from-black via-gray-900 to-black text-white" id="first">
    <div class="container mx-auto space-y-16">
      <!-- Step Privacy -->
      <div class="group text-center relative p-8 rounded-lg transition-all duration-500 shadow-lg">
        <div class="icon-container mx-auto mb-4">
          <lottie-player
            src="/animate/animation-lock/animations/3fe21902-e139-43e9-b669-7720a660a06e.json"
            background="transparent"
            speed="1"
            style="width: 200px; height: 200px;"
            loop
            autoplay
          ></lottie-player>
        </div>
        <h3 class="text-3xl font-semibold mb-4">
          {{ $t("bitcoin.anonymitySet") }}
        </h3>
        <p class="opacity-80">
          {{ $t("bitcoin.anonymitySetDesc") }}
        </p>
      </div>

      <!-- Educate and Learn -->
      <div class="group text-center relative p-8 rounded-lg transition-all duration-500 shadow-lg">
        <div class="icon-container mx-auto mb-4">
          <lottie-player
            src="/animate/animation-edu/animations/e239347a-7d3e-4af4-ad54-73261ad8dadd.json"
            background="transparent"
            speed="1"
            style="width: 250px; height: 250px;"
            loop
            autoplay
          ></lottie-player>
        </div>
        <h3 class="text-3xl font-semibold mb-4">
          {{ $t("bitcoin.educateLearn") }}
        </h3>
        <p class="opacity-80">
          {{ $t("bitcoin.educateLearnDesc") }}
        </p>
      </div>

      <!-- Organize Meet -->
      <div class="group text-center relative p-8 rounded-lg transition-all duration-500 shadow-lg">
        <div class="icon-container mx-auto mb-4">
          <lottie-player
            src="/animate/animation-meet/animations/b553c1b7-99cb-44fa-b810-4232dd44bba8.json"
            background="transparent"
            speed="1"
            style="width: 250px; height: 250px;"
            loop
            autoplay
          ></lottie-player>
        </div>
        <h3 class="text-3xl font-semibold mb-4">
          {{ $t("bitcoin.organizeMeet") }}
        </h3>
        <p class="opacity-80">
          {{ $t("bitcoin.organizeMeetDesc") }}
        </p>
      </div>

      <!-- Orange Pill -->
      <div class="group text-center relative p-8 rounded-lg transition-all duration-500 shadow-lg">
        <div class="icon-container mx-auto mb-4">
          <lottie-player
            src="/animate/animation-bitcoin/animations/47f6b0f8-f5b8-4408-9463-0238c7a6d9c8.json"
            background="transparent"
            speed="0.5"
            style="width: 200px; height: 200px;"
            loop
            autoplay
          ></lottie-player>
        </div>
        <h3 class="text-3xl font-semibold mb-4">
          {{ $t("bitcoin.orangePill") }}
        </h3>
        <p class="opacity-80">
          {{ $t("bitcoin.orangePillDesc") }}
        </p>
      </div>
    </div>
  </section>
</template>


<script>
export default {
  name: "BitcoinBeer",
  methods: {
    scrollToSection() {
      const element = document.getElementById("first");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  },
  mounted() {
    // Effetto Matrix Orizzontale
    const canvas = document.getElementById("matrix-effect");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "₿shaDEFGHIJKLMN₿OPQRST₿UVWXYZ₿123₿4567256";
    const fontSize = 14;
    const rows = canvas.height / fontSize;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: rows }).fill(1);

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(200, 200, 200, 0.4)";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((x, yIndex) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, x * fontSize, yIndex * fontSize);

        if (x * fontSize > canvas.width && Math.random() > 0.975) {
          drops[yIndex] = 0;
        }

        drops[yIndex]++;
      });
    }

    setInterval(draw, 80);
  },
};
</script>

<style scoped>
.glowing-text {
  background: linear-gradient(90deg, #ffae00, #ff9100);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 4s infinite;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  animation: fadeIn 2s ease-in-out;
}

.group {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.6));
  border-radius: 15px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.group:hover {
  transform: scale(1.02); /* Leggera espansione al passaggio del mouse */
  box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.4);
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.group p {
  font-size: 1.125rem; /* Dimensione del testo adeguata */
  line-height: 1.85; /* Spaziatura ottimale */
  color: rgba(255, 255, 255, 0.95); /* Colore chiaro per un buon contrasto */
  text-align: left; /* Allineamento a sinistra per una lettura naturale */
  text-indent: 1.5rem; /* Rientro per il primo paragrafo */
  padding: 0 1.5rem; /* Margine interno ai lati */
  margin: 0 auto; /* Centrato */
  max-width: 750px; /* Limita la larghezza */
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.1)); /* Sfondo leggero */
  border-left: 5px solid rgba(255, 165, 0, 0.8); /* Barra colorata laterale */
  border-radius: 10px; /* Arrotondamento degli angoli */
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3); /* Effetto ombra */
  opacity: 0; /* Nascondi inizialmente */
  transform: translateY(20px); /* Sposta verso il basso */
  animation: fadeInUp 1.2s ease-in-out forwards; /* Animazione di apparizione */
}

/* Anima il paragrafo con un movimento verso l'alto */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Migliora il focus sui paragrafi */
.group p strong {
  color: #ffd700; /* Evidenzia il testo con colore dorato */
  font-weight: bold;
}

.group p em {
  color: #ffa500; /* Sottolinea concetti chiave con un colore arancione */
  font-style: italic;
}



/* Migliora i titoli */
.group h3 {
  font-size: 2rem;
  color: #ffd700; /* Colore dorato per il titolo */
  text-transform: uppercase;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .group p {
    font-size: 0.95rem; /* Riduce leggermente il testo per dispositivi mobili */
    line-height: 1.6; /* Diminuisce la spaziatura tra le righe */
    text-align: justify; /* Mantiene un buon layout di lettura */
    padding: 0 1rem; /* Aggiunge un margine interno per evitare che il testo tocchi i bordi */
    text-indent: 0; /* Rimuove il rientro per migliorare la leggibilità su mobile */
    margin: 0 auto; /* Centratura */
  }

  .group {
    margin: 0 1rem; /* Aggiunge margine ai lati per evitare che il contenitore tocchi i bordi */
    padding: 16px; /* Spaziatura interna ottimale */
  }

  .icon-container {
    height: 100px; /* Altezza ottimale per mobile */
    margin-bottom: 2rem; /* Aggiunge più spazio tra l'icona e il titolo */
  }

  .group h3 {
    font-size: 1.25rem; /* Riduce la dimensione del titolo */
    margin-top: 0.5rem; /* Aggiunge un margine superiore per ulteriore spazio */
    text-align: center; /* Mantiene il titolo centrato */
  }
}



</style>
