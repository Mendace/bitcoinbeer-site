<template>
  <section class="bitcoin-beer-section relative w-full overflow-hidden">


    <!-- Contenitore principale -->
    <div class="container mx-auto py-16 px-6 flex flex-col lg:flex-row items-start gap-12">
      <!-- Titolo e descrizione a sinistra -->
      <div class="intro flex-1">
        <h2 class="section-title">{{ $t("bitcoinBeer.title") }}</h2>
        <p class="section-description">{{ $t("bitcoinBeer.subtitle") }}</p>
      </div>

      <!-- Cards a destra -->
      <div class="cards-container flex-1 flex flex-col gap-6">
        <!-- Card 1 -->
        <div class="action-block">
          <img src="/assets/community-comments-svgrepo-com.webp" alt="Card Image 1" class="block-image" />
          <div class="content">
            <h3 class="block-title">{{ $t("bitcoinBeer.card1Title") }}</h3>
            <p class="block-description">{{ $t("bitcoinBeer.card1Desc") }}</p>
            <router-link to="/start" class="relative inline-block py-3 px-6 font-bold text-white border border-white rounded-full overflow-hidden group focus:outline-none focus:ring-4 focus:ring-orange-500">
              <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              <span class="relative z-10">{{ $t("bitcoinBeer.card1Button") }}</span>
            </router-link>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="action-block">
          <img src="/assets/compass-svgrepo-com.webp" alt="Card Image 2" class="block-image" />
          <div class="content">
            <h3 class="block-title">{{ $t("bitcoinBeer.card2Title") }}</h3>
            <p class="block-description">{{ $t("bitcoinBeer.card2Desc") }}</p>
            <router-link to="/explore" class="relative inline-block py-3 px-6 font-bold text-white border border-white rounded-full overflow-hidden group focus:outline-none focus:ring-4 focus:ring-orange-500">
              <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              <span class="relative z-10">{{ $t("bitcoinBeer.card2Button") }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

  
  <script>
  export default {
    name: "BitcoinBeerSection",
  };
  </script>
  
  <style scoped>
/* Sezione principale */
.bitcoin-beer-section {
  position: relative;
  background: linear-gradient(135deg, #000000, #1a1a1a);
  color: #fff;
  padding: 4rem 2rem;
  z-index: 1;
}

/* Titolo della sezione */
.section-title {
  font-size: 3rem; /* Titolo grande per maggiore enfasi */
  font-weight: 700;
  color: #ffffff; /* Testo bianco puro */
  margin-bottom: 1rem;
  text-transform: uppercase; /* Migliore leggibilità */
  line-height: 1.3;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.1); /* Leggero bagliore */
}

/* Descrizione della sezione */
.section-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8); /* Colore meno intenso */
  max-width: 650px;
  margin: 0 auto; /* Centra il testo */
  line-height: 1.6; /* Leggibilità migliorata */
  padding: 0 1rem;
}

/* Spaziatura e allineamento */
.intro {
  margin-bottom: 3rem; /* Spazio maggiore dal contenuto sottostante */
  text-align: center;
}



/* Cards neutre */
.action-block {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
  background: radial-gradient(circle at top left, rgba(50, 50, 50, 0.9), #1a1a1a);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  z-index: 1;
}

.action-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
  z-index: 1;
}

/* Titoli e descrizioni delle cards */
.block-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff; /* Testo bianco */
  margin-bottom: 1rem;
  z-index: 1;
}

.block-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  z-index: 1;
}

/* Pulsanti Call-to-Action (CTA) */
.cta-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(135deg, rgba(255, 145, 0, 1), rgba(255, 94, 0, 1));
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(255, 145, 0, 0.4);
  transition: all 0.3s ease;
  z-index: 1;
}

.cta-button:hover {
  background: linear-gradient(135deg, rgba(255, 165, 0, 1), rgba(255, 105, 0, 1));
  box-shadow: 0 6px 16px rgba(255, 145, 0, 0.6);
  transform: translateY(-3px);
  z-index: 1;
}

/* Contenitore con il pattern */
.grid-background {
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><defs><pattern id="a" width="20" height="20" patternTransform="scale(4)" patternUnits="userSpaceOnUse"><rect width="100%" height="100%" fill-opacity="0"/><path fill="none" stroke="%23cc6d00" stroke-width=".5" d="M10 0v20ZM0 10h20Z"/></pattern></defs><rect width="800%" height="800%" fill="url(%23a)"/></svg>');
  background-repeat: repeat;
  background-size: auto;
  opacity: 0.2; /* Regola l'opacità */
  z-index: -1; /* Dietro al contenuto */
  pointer-events: none; /* Rimuove l'interattività */
}



/* Immagini nelle cards */
.block-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 50%; /* Rende l'immagine circolare */
  padding: 1rem; /* Spaziatura interna per dare aria */
  margin-bottom: 1rem;
  z-index: 1;
}

/* Layout responsivo per desktop */
@media (min-width: 1024px) {
  .action-block {
    flex-direction: row;
    padding: 3rem;
  }

  .block-image {
    margin-bottom: 0;
    margin-left: 2rem;
  }
}
  </style>
  