<template>
  <div class="mb-16">
    <div class="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 overflow-hidden">
      <h2 class="text-xl md:text-2xl font-bold mb-6">I miei ticket</h2>

      <div v-if="loading" class="py-8 text-center text-gray-300">Caricamento…</div>

      <div v-else-if="needsEmail"
           class="rounded border border-amber-500/40 bg-amber-900/30 text-amber-100 px-4 py-3">
        Per mostrare i tuoi ticket devi impostare un'email nel profilo.
      </div>

      <div v-else-if="tickets.length === 0" class="text-gray-300">Nessun ticket trovato.</div>

      <div v-else class="space-y-4">
        <article
          v-for="t in tickets"
          :key="t.id"
          class="flex items-center gap-4 p-3 rounded bg-black/20 hover:bg-black/30 transition min-w-0"
        >
          <!-- poster 16:9 -->
          <div class="thumb-16-9 flex-shrink-0">
            <img v-if="t.event_poster" :src="t.event_poster" alt="poster" class="thumb-img" />
            <div v-else class="thumb-fallback">🎟️</div>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-white leading-tight truncate">
              {{ t.event_title || 'Evento' }}
            </h3>
            <p class="text-sm text-gray-300">
              {{ formatDate(t.event_date_iso) }} · {{ t.event_venue || '—' }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              Codice: <span class="font-mono">{{ t.ticket_code }}</span>
              <span class="ml-2 px-2 py-0.5 rounded-full text-[11px]" :class="badgeClass(t)">
                {{ badgeText(t) }}
              </span>
            </p>

            <div class="flex flex-wrap items-center gap-3 mt-2">
              <button
                @click="openDetails(t)"
                class="text-[#800020] hover:text-[#a10028] font-semibold inline-flex items-center gap-1 transition-colors"
                title="Dettagli ticket"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                </svg>
                Dettagli
              </button>

              <router-link
                v-if="t.event_status !== 'archived'"
                :to="`/event/${t.event_id}`"
                class="text-gray-300 hover:underline"
              >
                Vai all'evento
              </router-link>
            </div>
          </div>

        </article>
      </div>
    </div>

    <!-- MODAL TICKET -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="closeDetails"
    >
      <div class="w-full max-w-3xl bg-[#121212] text-white rounded-xl shadow-2xl p-0 overflow-hidden ticket-wrap">
        <div class="ticket">
          <!-- Fascia verticale -->
          <div class="ticket-band">
            <div class="band-text">ADMIT ONE</div>
          </div>

          <!-- Contenuto -->
          <div class="ticket-body">
            <!-- Header: poster + info -->
            <div class="flex gap-4 items-start">
              <div class="thumb-16-9 thumb-lg">
                <img v-if="selected?.event_poster" :src="selected.event_poster" class="thumb-img" />
                <div v-else class="thumb-fallback">🎟️</div>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-extrabold leading-tight">
                  {{ selected?.event_title || 'Evento' }}
                </h3>
                <p class="text-sm text-gray-300">
                  {{ formatDate(selected?.event_date_iso) }} · {{ selected?.event_venue || '—' }}
                </p>
                <p class="mt-2 text-xs text-gray-400">
                  Stato:
                  <span :class="badgeClass(selected)" class="px-2 py-0.5 rounded-full text-[11px]">
                    {{ badgeText(selected) }}
                  </span>
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  Quantità: <strong>{{ selected?.quantity }}</strong>
                  · Acquistato: {{ formatDate(selected?.purchase_date_iso) }}
                </p>
                <p class="text-xs text-gray-400 mt-1 break-all">
                  Order/Payment: <span class="font-mono">{{ selected?.payment_id || '—' }}</span>
                </p>
                <p class="text-xs text-gray-400 mt-1 break-all">
                  Ticket code: <span class="font-mono">{{ selected?.ticket_code }}</span>
                </p>
              </div>
            </div>

            <!-- Area codici -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <!-- Codice grande: PRIORITÀ BARCODE -->
              <div class="md:col-span-2 bg-black/30 rounded p-4 text-center">
                <div class="text-xs mb-2 text-gray-300">Codice</div>

                <!-- barcode -->
                <img
                  v-if="hasBarcode(selected) && !barcodeError"
                  :src="selected.barcode_path"
                  class="mx-auto max-h-32"
                  alt="barcode"
                  @error="onBarcodeError"
                />

                <!-- QR se non c'è barcode o errore -->
                <img
                  v-else-if="hasQR(selected)"
                  :src="selected.qr_code_path"
                  class="mx-auto max-h-40"
                  alt="qrcode"
                />

                <!-- QR di fallback dal ticket_code -->
                <img
                  v-else
                  :src="fallbackQr(selected?.ticket_code)"
                  class="mx-auto max-h-40"
                  alt="qrcode"
                />
              </div>

              <!-- Box info a destra -->
              <div class="bg-black/30 rounded p-4 text-sm">
                <div class="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span class="text-gray-400">Luogo</span>
                  <span class="font-semibold truncate max-w-[60%] text-right">
                    {{ selected?.event_venue || '—' }}
                  </span>
                </div>
                <div class="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span class="text-gray-400">Data</span>
                  <span class="font-semibold">{{ justDate(selected?.event_date_iso) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">Ora</span>
                  <span class="font-semibold">{{ justTime(selected?.event_date_iso) }}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-6 text-right">
              <button @click="closeDetails" class="px-4 py-2 rounded bg-white/10 hover:bg-white/20">
                Chiudi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  api: {
    type: Object,
    default: () => ({ TICKETS: 'https://api.bitcoinbeer.events/api/user_tickets.php' })
  },
  reloadKey: { type: [Number, String], default: 0 }
});

const tickets = ref([]);
const loading = ref(false);
const needsEmail = ref(false);

const showModal = ref(false);
const selected = ref(null);

// gestisco errore caricamento barcode per fallback automatico
const barcodeError = ref(false);

function hasBarcode(t) {
  const v = (t?.barcode_path || '').trim();
  return v.length > 0;
}
function hasQR(t) {
  const v = (t?.qr_code_path || '').trim();
  return v.length > 0;
}

function onBarcodeError() {
  barcodeError.value = true;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleString('it-IT', { dateStyle: 'medium', timeStyle: 'short' });
}
function justDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('it-IT', { dateStyle: 'medium' });
}
function justTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

function badgeText(t) {
  if ((t?.event_status || '').toLowerCase() === 'archived') return 'archiviato';
  return (t?.status || '').toLowerCase() || '—';
}
function badgeClass(t) {
  if ((t?.event_status || '').toLowerCase() === 'archived') return 'bg-purple-600/30 text-purple-200';
  switch ((t?.status || '').toLowerCase()) {
    case 'active':    return 'bg-emerald-600/30 text-emerald-200';
    case 'used':      return 'bg-gray-500/30 text-gray-200';
    case 'cancelled': return 'bg-red-600/30 text-red-200';
    case 'refunded':  return 'bg-orange-600/30 text-orange-200';
    default:          return 'bg-gray-600/30 text-gray-200';
  }
}

function openDetails(ticket) {
  selected.value = ticket;
  barcodeError.value = false; // reset eventuale errore
  showModal.value = true;
}
function closeDetails() {
  showModal.value = false;
  selected.value = null;
}

// QR di fallback se non esiste barcode/qr nel DB
function fallbackQr(code) {
  if (!code) return '';
  const data = encodeURIComponent(code);
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${data}`;
}

async function loadTickets() {
  loading.value = true;
  needsEmail.value = false;
  tickets.value = [];
  try {
    const token = localStorage.getItem('user_token');
    if (!token) { loading.value = false; return; }

    const res = await fetch(props.api.TICKETS, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ token })
    });
    const json = await res.json();
    if (!json?.success) throw new Error(json?.error || 'Errore caricamento');

    tickets.value = json.data?.tickets || [];
    needsEmail.value = !!json.data?.needs_email;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadTickets);
watch(() => props.reloadKey, () => loadTickets());
</script>

<style scoped>
/* thumb 16:9 */
.thumb-16-9 {
  width: 112px;           /* 16:9 ~ 112x63 */
  aspect-ratio: 16/9;
  background: rgba(255,255,255,0.06);
  border-radius: 6px;
  overflow: hidden;
  display: grid;
  place-items: center;
}
.thumb-lg { width: 240px; } /* nel modal */
.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.thumb-fallback { font-size: 22px; opacity: .8; }

/* stile ticket */
.ticket-wrap { border-radius: 14px; }
.ticket {
  display: grid;
  grid-template-columns: 88px 1fr; /* fascia + corpo */
  background: #181818;
  position: relative;
}
.ticket-band {
  background: linear-gradient(180deg, #111 0%, #202020 100%);
  border-right: 1px dashed rgba(255,255,255,0.15);
  display: grid;
  place-items: center;
  padding: 18px 8px;
}
.band-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  letter-spacing: 2px;
  font-weight: 800;
  color: #f0f0f0;
}
.ticket-body { padding: 18px; }

/* perforazione estetica */
.ticket::after {
  content: '';
  position: absolute;
  left: 88px;
  top: 12px;
  bottom: 12px;
  width: 0;
  border-left: 2px dotted rgba(255,255,255,0.1);
}
@media (max-width: 640px) {
  .ticket { grid-template-columns: 72px 1fr; }
  .ticket::after { left: 72px; }
}
</style>
