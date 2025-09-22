<template>
  <div class="referral-leaderboard bg-black text-white p-6 rounded-lg">
    <h2 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-trophy text-yellow-500 mr-3"></i>
      Classifica Referral
    </h2>

    <div v-if="loading" class="text-center py-8">
      <i class="fas fa-spinner fa-spin text-orange-500 text-2xl"></i>
      <p class="mt-2 text-gray-400">Caricamento classifica...</p>
    </div>

    <div v-else-if="error" class="bg-red-900/30 border border-red-500/40 text-red-200 p-4 rounded-lg">
      {{ error }}
    </div>

    <div v-else>
      <!-- Top 3 Podio -->
      <div v-if="topThree.length > 0" class="mb-8">
        <div class="flex justify-center items-end space-x-4 mb-6">
          <!-- 2° posto -->
          <div v-if="topThree[1]" class="text-center podium-item" data-position="2">
            <div class="podium-avatar silver">
              <img :src="getAvatar(topThree[1].email)" :alt="topThree[1].name" class="w-16 h-16 rounded-full object-cover">
              <div class="podium-badge silver-badge">
                <i class="fas fa-medal"></i>
              </div>
            </div>
            <div class="podium-info">
              <h3 class="font-bold text-lg">{{ topThree[1].name }}</h3>
              <p class="text-gray-400 text-sm">{{ topThree[1].total_points }} punti</p>
              <p class="text-gray-500 text-xs">{{ topThree[1].referrals }} referral</p>
            </div>
            <div class="podium-height silver-height"></div>
          </div>

          <!-- 1° posto -->
          <div v-if="topThree[0]" class="text-center podium-item" data-position="1">
            <div class="podium-avatar gold">
              <img :src="getAvatar(topThree[0].email)" :alt="topThree[0].name" class="w-20 h-20 rounded-full object-cover">
              <div class="podium-badge gold-badge">
                <i class="fas fa-crown"></i>
              </div>
            </div>
            <div class="podium-info">
              <h3 class="font-bold text-xl text-yellow-400">{{ topThree[0].name }}</h3>
              <p class="text-gray-300 text-base">{{ topThree[0].total_points }} punti</p>
              <p class="text-gray-400 text-sm">{{ topThree[0].referrals }} referral</p>
            </div>
            <div class="podium-height gold-height"></div>
          </div>

          <!-- 3° posto -->
          <div v-if="topThree[2]" class="text-center podium-item" data-position="3">
            <div class="podium-avatar bronze">
              <img :src="getAvatar(topThree[2].email)" :alt="topThree[2].name" class="w-14 h-14 rounded-full object-cover">
              <div class="podium-badge bronze-badge">
                <i class="fas fa-medal"></i>
              </div>
            </div>
            <div class="podium-info">
              <h3 class="font-bold text-lg">{{ topThree[2].name }}</h3>
              <p class="text-gray-400 text-sm">{{ topThree[2].total_points }} punti</p>
              <p class="text-gray-500 text-xs">{{ topThree[2].referrals }} referral</p>
            </div>
            <div class="podium-height bronze-height"></div>
          </div>
        </div>
      </div>

      <!-- Lista completa -->
      <div class="space-y-3">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <i class="fas fa-list-ol text-orange-500 mr-2"></i>
          Classifica completa
        </h3>

        <div v-for="(user, index) in leaderboard" :key="user.email"
             :class="['leaderboard-item',
                      index < 3 ? 'top-three' : '',
                      isCurrentUser(user) ? 'current-user' : '']">

          <div class="flex items-center space-x-4 flex-1">
            <!-- Posizione -->
            <div class="ranking-number">
              <span v-if="index < 3" class="medal-icon">
                <i v-if="index === 0" class="fas fa-crown text-yellow-500"></i>
                <i v-else-if="index === 1" class="fas fa-medal text-gray-400"></i>
                <i v-else class="fas fa-medal text-yellow-600"></i>
              </span>
              <span v-else class="rank-text">{{ index + 1 }}</span>
            </div>

            <!-- Avatar e info -->
            <div class="flex items-center space-x-3 flex-1">
              <img :src="getAvatar(user.email)" :alt="user.name"
                   class="w-12 h-12 rounded-full object-cover">
              <div class="flex-1">
                <h4 class="font-semibold text-lg">{{ user.name }}</h4>
                <p class="text-sm text-gray-400">{{ user.referrals }} referral</p>
              </div>
            </div>

            <!-- Punti -->
            <div class="text-right">
              <div class="text-xl font-bold text-orange-400">{{ user.total_points }}</div>
              <div class="text-sm text-gray-500">punti</div>
            </div>

            <!-- Badge "Tu" se è l'utente corrente -->
            <div v-if="isCurrentUser(user)" class="ml-3">
              <span class="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                TU
              </span>
            </div>
          </div>

          <!-- Barra progressiva (solo per i primi 5) -->
          <div v-if="index < 5 && leaderboard[0]" class="progress-bar mt-3">
            <div class="progress-fill"
                 :style="{ width: getProgressWidth(user.total_points, leaderboard[0].total_points) + '%' }">
            </div>
          </div>
        </div>

        <!-- Messaggio se non ci sono dati -->
        <div v-if="leaderboard.length === 0" class="text-center py-8">
          <i class="fas fa-chart-bar text-gray-500 text-3xl mb-3"></i>
          <p class="text-gray-400">Nessun dato nella classifica.</p>
          <p class="text-sm text-gray-500 mt-1">Inizia a invitare persone per apparire qui!</p>
        </div>
      </div>

      <!-- Posizione utente se non è nella top 10 -->
      <div v-if="userPosition && userPosition > 10" class="mt-6 pt-4 border-t border-gray-700">
        <h4 class="text-lg font-semibold mb-3 text-orange-400">La tua posizione</h4>
        <div class="leaderboard-item current-user">
          <div class="flex items-center space-x-4 flex-1">
            <div class="ranking-number">
              <span class="rank-text">{{ userPosition }}</span>
            </div>
            <div class="flex items-center space-x-3 flex-1">
              <img :src="getAvatar(userEmail)" alt="Tu"
                   class="w-12 h-12 rounded-full object-cover">
              <div class="flex-1">
                <h4 class="font-semibold text-lg">Tu</h4>
                <p class="text-sm text-gray-400">{{ userStats?.referrals || 0 }} referral</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-orange-400">{{ userStats?.total_points || 0 }}</div>
              <div class="text-sm text-gray-500">punti</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReferralLeaderboard",
  props: {
    userEmail: {
      type: String,
      default: ""
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      loading: false,
      error: "",
      leaderboard: [],
      userPosition: null,
      userStats: null,
      API_BASE: "https://api.bitcoinbeer.events/api/referral.php",
      API_KEY: "0215efb408569f4590cc2108cae33689b4901475a994d2ec5be1e59af0fc231a" // Se necessaria
    };
  },
  computed: {
    topThree() {
      return this.leaderboard.slice(0, 3);
    }
  },
  async created() {
    await this.loadLeaderboard();
    if (this.userEmail) {
      await this.loadUserPosition();
    }
  },
  methods: {
    async loadLeaderboard() {
      this.loading = true;
      this.error = "";

      try {
        const headers = {
          "Content-Type": "application/json"
        };

        // Aggiungi API key se disponibile
        if (this.API_KEY) {
          headers["X-API-KEY"] = this.API_KEY;
        }

        const response = await fetch(`${this.API_BASE}?action=leaderboard&limit=${this.limit}`, {
          method: "GET",
          headers
        });

        // Gestione errori HTTP specifici
        if (response.status === 401) {
          this.error = "API key mancante o invalida";
          return;
        }

        if (response.status === 404) {
          this.error = "Dati leaderboard non trovati";
          return;
        }

        if (!response.ok) {
          this.error = `Errore HTTP: ${response.status} ${response.statusText}`;
          return;
        }

        const data = await response.json();

        // Controlla sempre response.success prima di usare data
        if (data.success) {
          this.leaderboard = data.data || [];
        } else {
          this.error = data.error || "Errore nel caricamento della classifica";
        }
      } catch (e) {
        console.error("Errore caricamento leaderboard:", e);
        this.error = "Errore di connessione al server";
      } finally {
        this.loading = false;
      }
    },

    async loadUserPosition() {
      if (!this.userEmail) return;

      try {
        const headers = {
          "Content-Type": "application/json"
        };

        // Aggiungi API key se disponibile
        if (this.API_KEY) {
          headers["X-API-KEY"] = this.API_KEY;
        }

        const response = await fetch(`${this.API_BASE}?action=my_stats&email=${encodeURIComponent(this.userEmail)}`, {
          method: "GET",
          headers
        });

        // Gestione errori HTTP specifici
        if (response.status === 401) {
          console.warn("API key mancante o invalida per posizione utente");
          return;
        }

        if (response.status === 404) {
          console.info("Utente non trovato nel sistema referral");
          return;
        }

        if (!response.ok) {
          console.warn(`Errore HTTP nel caricamento posizione utente: ${response.status}`);
          return;
        }

        const data = await response.json();

        // Controlla sempre response.success prima di usare data
        if (data.success && data.data) {
          this.userStats = {
            total_points: data.data.stats.grand_total,
            referrals: data.data.stats.successful_referrals
          };

          // Trova la posizione dell'utente nella classifica
          const userIndex = this.leaderboard.findIndex(user => user.email === this.userEmail);
          if (userIndex !== -1) {
            this.userPosition = userIndex + 1;
          }
        }
      } catch (e) {
        console.error("Errore caricamento posizione utente:", e);
      }
    },

    getAvatar(email) {
      return `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(email)}`;
    },

    isCurrentUser(user) {
      return this.userEmail && user.email === this.userEmail;
    },

    getProgressWidth(points, maxPoints) {
      if (!maxPoints || maxPoints === 0) return 0;
      return Math.max(5, (points / maxPoints) * 100);
    }
  }
};
</script>

<style scoped>
.referral-leaderboard {
  background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.95) 100%);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Podio */
.podium-item {
  position: relative;
  z-index: 1;
}

.podium-avatar {
  position: relative;
  margin-bottom: 1rem;
}

.podium-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.gold-badge {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: #000;
}

.silver-badge {
  background: linear-gradient(45deg, #C0C0C0, #A8A8A8);
  color: #000;
}

.bronze-badge {
  background: linear-gradient(45deg, #CD7F32, #B87333);
  color: #000;
}

.podium-info {
  margin-bottom: 1rem;
}

.podium-height {
  width: 100%;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
}

.gold-height {
  height: 80px;
  background: linear-gradient(180deg, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0.1) 100%);
}

.silver-height {
  height: 60px;
  background: linear-gradient(180deg, rgba(192,192,192,0.3) 0%, rgba(192,192,192,0.1) 100%);
}

.bronze-height {
  height: 40px;
  background: linear-gradient(180deg, rgba(205,127,50,0.3) 0%, rgba(205,127,50,0.1) 100%);
}

/* Lista classifica */
.leaderboard-item {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease;
}

.leaderboard-item:hover {
  background: rgba(255,255,255,0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.leaderboard-item.current-user {
  background: rgba(255,165,0,0.1);
  border-color: rgba(255,165,0,0.3);
}

.leaderboard-item.top-three {
  background: rgba(255,215,0,0.05);
  border-color: rgba(255,215,0,0.2);
}

.ranking-number {
  width: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.medal-icon {
  font-size: 1.5rem;
}

.rank-text {
  color: #9CA3AF;
}

/* Barra di progresso */
.progress-bar {
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #F7931A);
  border-radius: 2px;
  transition: width 1s ease;
}

/* Animazioni */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.leaderboard-item {
  animation: slideInUp 0.6s ease forwards;
}

.leaderboard-item:nth-child(2) { animation-delay: 0.1s; }
.leaderboard-item:nth-child(3) { animation-delay: 0.2s; }
.leaderboard-item:nth-child(4) { animation-delay: 0.3s; }
.leaderboard-item:nth-child(5) { animation-delay: 0.4s; }

@keyframes bounceIn {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.podium-item {
  animation: bounceIn 0.8s ease forwards;
}

.podium-item[data-position="1"] { animation-delay: 0.2s; }
.podium-item[data-position="2"] { animation-delay: 0.1s; }
.podium-item[data-position="3"] { animation-delay: 0.3s; }

/* Responsive */
@media (max-width: 768px) {
  .podium-avatar img {
    width: 3rem;
    height: 3rem;
  }

  .podium-avatar.gold img {
    width: 4rem;
    height: 4rem;
  }

  .podium-height {
    height: 30px !important;
  }

  .gold-height {
    height: 50px !important;
  }

  .silver-height {
    height: 40px !important;
  }

  .ranking-number {
    width: 30px;
    font-size: 1rem;
  }

  .medal-icon {
    font-size: 1.2rem;
  }
}
</style>