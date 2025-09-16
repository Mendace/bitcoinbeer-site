<template>
    <section class="p-6 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <div class="container mx-auto">
        <!-- Titolo e Testo Introduttivo -->
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold">{{ $t("stats.title") }}</h2>
          <p class="text-lg mt-4 text-gray-600 dark:text-gray-400">
            {{ $t("stats.description") }}
          </p>
        </div>
  
        <!-- Statistiche -->
        <div class="grid justify-center grid-cols-2 text-center lg:grid-cols-3 gap-8">
          <div
            v-for="(stat, index) in stats"
            :key="index"
            class="stat-card flex flex-col justify-start items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105"
          >
            <p
              class="text-4xl font-bold leading-none lg:text-6xl"
              :id="'stat-' + index"
            >
              {{ animatedNumbers[index] }}
            </p>
            <h3 class="text-xl font-semibold mt-4">{{ $t(stat.label) }}</h3>
            <p class="text-sm mt-2 text-gray-500 dark:text-gray-400">
              {{ $t(stat.description) }}
            </p>
          </div>

        </div>
      </div>
    </section>
  </template>
  
<script>
import { ref, onMounted } from "vue";

export default {
  name: "Statistics",
  setup() {
    const stats = ref([]);
    const animatedNumbers = ref([]);
    const isVisible = ref([]); // Array per monitorare la visibilità delle card

    const fetchStats = async () => {
      try {
        const response = await fetch(
          "https://api.bitcoinbeer.events/data/group_data.json"
        );
        const data = await response.json();

        stats.value = [
          {
            value: data.groups.length,
            label: "stats.groups",
            description: "stats.groupsDesc",
          },
          {
            value: data.groups.reduce((sum, group) => sum + group.user_count, 0),
            label: "stats.totalMembers",
            description: "stats.totalMembersDesc",
          },
          {
            value: data.groups.reduce(
              (sum, group) => sum + group.message_count,
              0
            ),
            label: "stats.totalMessages",
            description: "stats.totalMessagesDesc",
          },
        ];
        animatedNumbers.value = stats.value.map(() => 0);
        isVisible.value = stats.value.map(() => false); // Inizialmente non visibili
      } catch (error) {
        console.error("Errore nel caricamento delle statistiche:", error);
      }
    };

    const animateNumbers = (index) => {
      const targetValue = stats.value[index].value;
      const duration = 1500;
      const increment = targetValue / (duration / 16);
      let currentValue = 0;

      const animate = () => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          animatedNumbers.value[index] = Math.floor(targetValue);
        } else {
          animatedNumbers.value[index] = Math.floor(currentValue);
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    const setupIntersectionObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = entry.target.dataset.index;
            if (entry.isIntersecting && !isVisible.value[index]) {
              isVisible.value[index] = true;
              animateNumbers(index);
            }
          });
        },
        { threshold: 0.5 }
      );

      document.querySelectorAll(".stat-card").forEach((el, index) => {
        el.dataset.index = index;
        observer.observe(el);
      });
    };

    onMounted(async () => {
      await fetchStats();
      setupIntersectionObserver();
    });

    return {
      stats,
      animatedNumbers,
    };
  },
};
</script>
<style scoped>
/* Sfondo della sezione */
section {
  background: linear-gradient(135deg, #000000, #121212); /* Sfondo elegante scuro */
  color: white;
  padding: 4rem 2rem; /* Margini generosi */
}

/* Titolo e descrizione */
h2 {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  margin-bottom: 1rem;
}

p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  text-align: center;
}

/* Griglia delle statistiche */
.grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Reattività */
  max-width: 1200px;
  margin: 0 auto;
}

/* Card con gradiente nero-arancione ancora più soffuso e polyform glass */
.bg-white,
.dark\:bg-gray-800 {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.9), /* Quasi nero */
    rgba(255, 153, 0, 0.1) /* Arancione molto tenue */
  );
  border: 1px solid rgba(255, 255, 255, 0.15); /* Bordo ancora più sottile */
  backdrop-filter: blur(15px); /* Effetto sfocatura */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); /* Ombra diffusa */
  border-radius: 16px; /* Bordo arrotondato */
  padding: 1.5rem; /* Padding interno */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bg-white:hover,
.dark\:bg-gray-800:hover {
  transform: scale(1.05); /* Animazione al passaggio del mouse */
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5); /* Ombra più intensa */
}




/* Numeri */
.text-4xl,
.lg\:text-6xl {
  font-size: 2rem; /* Dimensione dei numeri per mobile */
  color: white;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

/* Titolo delle card */
h3 {
  color: white;
  font-size: 1.2rem; /* Riduce leggermente il font */
  margin-bottom: 0.5rem;
}

/* Testo descrittivo */
p {
  font-size: 0.9rem;
}

/* Effetto hover */
.stat-card:hover {
  transform: scale(1.1) translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* Animazioni Numeri */
.text-4xl {
  animation: glowEffect 1.5s ease-in-out infinite alternate;
}

@keyframes glowEffect {
  from {
    text-shadow: 0 0 5px #ffae00, 0 0 10px #ffae00;
  }
  to {
    text-shadow: 0 0 20px #ffae00, 0 0 40px #ff9900;
  }
}

/* Mobile Responsive */
@media (max-width: 640px) {
  h2 {
    font-size: 1.8rem; /* Riduzione del titolo per dispositivi piccoli */
  }

  .text-4xl,
  .lg\:text-6xl {
    font-size: 1.5rem; /* Riduce ulteriormente i numeri */
  }

  p {
    font-size: 0.8rem; /* Riduzione del testo descrittivo */
  }

  .grid {
    grid-template-columns: 1fr; /* Una sola colonna su dispositivi mobili */
  }
}
</style>

  