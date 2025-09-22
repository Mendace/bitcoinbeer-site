<template>
  <div class="mb-12">
    <div class="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 overflow-hidden">
      <h2 class="text-xl md:text-2xl font-bold mb-2 flex items-center">
        <i class="fas fa-users text-rose-500 mr-3"></i>
        Il tuo Referral
      </h2>
      <p class="text-sm text-gray-300 mb-6">Invita amici e guadagna punti per ogni registrazione e acquisto.</p>

      <div v-if="loading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-rose-500 text-2xl"></i>
        <p class="mt-2 text-gray-400">Caricamento...</p>
      </div>

      <div v-else-if="error" class="bg-red-900/30 border border-red-500/40 text-red-200 p-4 rounded-xl mb-4">
        {{ error }}
      </div>

    <div v-else>
        <!-- Codice Referral -->
        <div class="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <i class="fas fa-code text-rose-500 mr-2"></i>
            Il tuo codice referral
          </h3>

          <div v-if="!referralData.referral_code" class="text-center">
            <p class="text-gray-400 mb-4">Non hai ancora un codice referral</p>
            <button @click="generateCode" :disabled="generating"
                    class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-500 hover:opacity-90 disabled:opacity-50 font-semibold">
              <i class="fas fa-plus mr-2"></i>
              {{ generating ? 'Generando...' : 'Genera codice' }}
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
              <code class="text-rose-400 font-mono text-xl">{{ referralData.referral_code }}</code>
              <button @click="copyCode" class="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg">
                <i class="fas fa-copy"></i>
              </button>
            </div>

            <!-- Bottoni di condivisione -->
            <div class="flex flex-wrap gap-3">
              <button @click="shareWhatsApp" class="share-btn bg-green-600 hover:bg-green-500">
                <i class="fab fa-whatsapp mr-2"></i>
                WhatsApp
              </button>
              <button @click="shareTelegram" class="share-btn bg-blue-500 hover:bg-blue-400">
                <i class="fab fa-telegram mr-2"></i>
                Telegram
              </button>
              <button @click="shareEmail" class="share-btn bg-gray-600 hover:bg-gray-500">
                <i class="fas fa-envelope mr-2"></i>
                Email
              </button>
              <button @click="copyShareUrl" class="share-btn bg-rose-600 hover:bg-rose-500">
                <i class="fas fa-link mr-2"></i>
                Copia URL
              </button>
            </div>
          </div>
        </div>

        <!-- Statistiche -->
        <div v-if="referralData.referral_code" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stats-card">
            <div class="text-2xl font-extrabold text-rose-400">{{ referralData.stats.successful_referrals }}</div>
            <div class="text-sm text-gray-400 mt-1">
              <i class="fas fa-user-plus mr-1"></i>
              Utenti invitati
            </div>
          </div>
          <div class="stats-card">
            <div class="text-2xl font-extrabold text-green-400">{{ referralData.stats.share_points }}</div>
            <div class="text-sm text-gray-400 mt-1">
              <i class="fas fa-share mr-1"></i>
              Punti share
            </div>
          </div>
          <div class="stats-card">
            <div class="text-2xl font-extrabold text-blue-400">{{ referralData.stats.purchase_points }}</div>
            <div class="text-sm text-gray-400 mt-1">
              <i class="fas fa-shopping-cart mr-1"></i>
              Punti acquisto
            </div>
          </div>
          <div class="stats-card">
            <div class="text-2xl font-extrabold text-yellow-400">{{ referralData.stats.grand_total }}</div>
            <div class="text-sm text-gray-400 mt-1">
              <i class="fas fa-trophy mr-1"></i>
              Totale punti
            </div>
          </div>
        </div>

        <!-- Lista utenti invitati -->
        <div v-if="referralData.referred_users && referralData.referred_users.length > 0" class="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <i class="fas fa-list text-rose-500 mr-2"></i>
            Utenti che hai invitato ({{ referralData.referred_users.length }})
          </h3>

          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="user in referralData.referred_users" :key="user.id"
                 class="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
              <div class="flex items-center">
                <img :src="`https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user.email)}`"
                     :alt="user.email" class="w-8 h-8 rounded-full mr-3">
                <div>
                  <div class="font-medium">{{ user.email }}</div>
                  <div class="text-sm text-gray-400">{{ formatDate(user.created_at) }}</div>
                </div>
              </div>
              <div class="flex items-center">
                <span v-if="user.has_purchased" class="bg-green-600 text-xs px-2 py-1 rounded-full">
                  <i class="fas fa-check mr-1"></i>
                  Acquistato
                </span>
                <span v-else class="bg-gray-600 text-xs px-2 py-1 rounded-full">
                  Registrato
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Messaggio se non ci sono utenti invitati -->
        <div v-else-if="referralData.referral_code" class="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <i class="fas fa-users text-gray-500 text-3xl mb-3"></i>
          <p class="text-gray-400">Non hai ancora invitato nessuno.</p>
          <p class="text-sm text-gray-500 mt-1">Condividi il tuo codice per iniziare a guadagnare punti!</p>
        </div>
      </div>

      <!-- Toast per notifiche -->
      <div v-if="toast.show"
           :class="['fixed top-4 right-4 px-4 py-2 rounded-xl transition-all duration-300 z-50',
                    toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']">
        <i :class="['mr-2', toast.type === 'success' ? 'fas fa-check' : 'fas fa-times']"></i>
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReferralProfile",
  props: {
    userEmail: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      generating: false,
      error: "",
      referralData: {
        referral_code: "",
        share_url: "",
        stats: {
          successful_referrals: 0,
          share_points: 0,
          purchase_points: 0,
          total_earned: 0,
          received_points: 0,
          grand_total: 0
        },
        referred_users: []
      },
      toast: {
        show: false,
        message: "",
        type: "success"
      },
      API_BASE: "https://api.bitcoinbeer.events/api/referral.php",
      API_KEY: "0215efb408569f4590cc2108cae33689b4901475a994d2ec5be1e59af0fc231a" // Se necessaria
    };
  },
  async created() {
    if (this.userEmail) {
      await this.loadReferralData();
    }
  },
  methods: {
    async loadReferralData() {
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

        const response = await fetch(`${this.API_BASE}?action=my_stats&email=${encodeURIComponent(this.userEmail)}`, {
          method: "GET",
          headers
        });

        // Gestione errori HTTP specifici
        if (response.status === 401) {
          this.error = "API key mancante o invalida";
          return;
        }

        if (response.status === 404) {
          this.error = "Utente non trovato nel sistema referral";
          return;
        }

        if (!response.ok) {
          this.error = `Errore HTTP: ${response.status} ${response.statusText}`;
          return;
        }

        const data = await response.json();

        // Controlla sempre response.success prima di usare data
        if (data.success) {
          this.referralData = data.data;
        } else {
          this.error = data.error || "Errore nel caricamento dei dati referral";
        }
      } catch (e) {
        console.error("Errore caricamento referral:", e);
        this.error = "Errore di connessione al server";
      } finally {
        this.loading = false;
      }
    },

    async generateCode() {
      this.generating = true;
      this.error = "";

      try {
        const headers = {
          "Content-Type": "application/json"
        };

        // Aggiungi API key se disponibile
        if (this.API_KEY) {
          headers["X-API-KEY"] = this.API_KEY;
        }

        const response = await fetch(`${this.API_BASE}?action=generate_code`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            email: this.userEmail
          })
        });

        // Gestione errori HTTP specifici
        if (response.status === 401) {
          this.error = "API key mancante o invalida";
          return;
        }

        if (response.status === 404) {
          this.error = "Utente non trovato";
          return;
        }

        if (!response.ok) {
          this.error = `Errore HTTP: ${response.status} ${response.statusText}`;
          return;
        }

        const data = await response.json();

        // Controlla sempre response.success prima di usare data
        if (data.success) {
          this.referralData.referral_code = data.code;
          this.referralData.share_url = data.share_url;
          this.showToast("Codice referral generato con successo!", "success");
          await this.loadReferralData();
        } else {
          this.error = data.error || "Errore nella generazione del codice";
        }
      } catch (e) {
        console.error("Errore generazione codice:", e);
        this.error = "Errore di connessione al server";
      } finally {
        this.generating = false;
      }
    },

    copyCode() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.referralData.referral_code);
        this.showToast("Codice copiato negli appunti!", "success");
      }
    },

    copyShareUrl() {
      if (navigator.clipboard && this.referralData.share_url) {
        navigator.clipboard.writeText(this.referralData.share_url);
        this.showToast("URL copiato negli appunti!", "success");
      }
    },

    shareWhatsApp() {
      const message = `🍺 Ciao! Ti invito agli eventi Bitcoin Beer! Usa il mio codice referral: ${this.referralData.referral_code}\n\n${this.referralData.share_url}`;
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    },

    shareTelegram() {
      const message = `🍺 Ciao! Ti invito agli eventi Bitcoin Beer! Usa il mio codice referral: ${this.referralData.referral_code}\n\n${this.referralData.share_url}`;
      const url = `https://t.me/share/url?url=${encodeURIComponent(this.referralData.share_url)}&text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    },

    shareEmail() {
      const subject = "Invito agli eventi Bitcoin Beer!";
      const body = `Ciao!\n\nTi invito a partecipare agli eventi Bitcoin Beer! Usa il mio codice referral: ${this.referralData.referral_code}\n\nRegistrati qui: ${this.referralData.share_url}\n\nCi vediamo agli eventi! 🍺`;
      const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(url);
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    showToast(message, type = "success") {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.stats-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.08);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.share-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  color: white;
  border: none;
  cursor: pointer;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* Animazioni */
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

.bg-white\/10 > * {
  animation: fadeInUp 0.6s ease forwards;
}

/* Responsive */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .share-btn {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>