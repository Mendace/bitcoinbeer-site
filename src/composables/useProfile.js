import { ref, computed, onMounted, watch } from 'vue';

// Token condiviso a livello di modulo: viene utilizzato da tutte le chiamate a useProfile
const token = ref(localStorage.getItem('user_token') || '');

export function useProfile() {
  const API = 'https://api.bitcoinbeer.events/api'
  const API_KEY = '0215efb408569f4590cc2108cae33689b4901475a994d2ec5be1e59af0fc231a'
  const profile = ref({});
  const comments = ref([]);
  const defaultAvatar = '/assets/default-avatar.png';
  const gamification = ref({ points: 0, level: 0, events: 0, cities: 0, badges: [], referral: {}, rank: null, total: null });

  // Formattazioni data
  const formatDate = d => new Date(d).toLocaleString('it-IT');
  const formatMonthYear = d => new Date(d).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });

  // Totali reazioni
  const totalLikes      = computed(() => comments.value.reduce((s, c) => s + (c.like_count     || 0), 0));
  const totalHeart      = computed(() => comments.value.reduce((s, c) => s + (c.heart_count    || 0), 0));
  const totalStar       = computed(() => comments.value.reduce((s, c) => s + (c.star_count     || 0), 0));
  const totalThumbsUp   = computed(() => comments.value.reduce((s, c) => s + (c.thumbsup_count|| 0), 0));
  const totalThumbsDown = computed(() => comments.value.reduce((s, c) => s + (c.thumbsdown_count|| 0), 0));
  const totalReactions  = computed(() =>
    totalLikes.value + totalHeart.value + totalStar.value + totalThumbsUp.value + totalThumbsDown.value
  );

  const stats = computed(() => [
    { label: 'like',       value: totalLikes.value,      color: 'blue-400',   icon: '👍' },
    { label: 'heart',      value: totalHeart.value,      color: 'pink-400',   icon: '❤️' },
    { label: 'star',       value: totalStar.value,       color: 'yellow-400', icon: '⭐' },
    { label: 'thumbsUp',   value: totalThumbsUp.value,   color: 'green-400',  icon: '👍🏼' },
    { label: 'thumbsDown', value: totalThumbsDown.value,  color: 'red-500',    icon: '👎' },
  ]);

  // Caricamento profilo + commenti
  async function loadProfile() {
    if (!token.value) {
      profile.value = {};
      comments.value = [];
      gamification.value = { points: 0, level: 0, events: 0, cities: 0, badges: [], referral: {}, rank: null, total: null };
      return;
    }
    try {
      const res = await fetch(`${API}/get_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.value })
      });
      const j = await res.json();
      if (j.success) {
        profile.value = j.data.user;
        comments.value = j.data.comments || [];
        // Carica gamification dal backend usando l'email del profilo
        const email = (profile.value.email || '').trim();
        if (email) await loadGamification(email);
      } else {
        console.error('Errore API:', j);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  async function loadGamification(email) {
    try {
      const url = `${API}/gamification.php?action=profile&email=${encodeURIComponent(email)}&api_key=${API_KEY}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('gamification fetch failed');
      const data = await res.json();
      // Atteso: { email, points, level, rank, leaderboard_total, events, cities, badges:[], referral:{} }
      gamification.value = {
        points: Number(data.points || 0),
        level: Number(data.level || 0),
        rank: (data.rank != null ? Number(data.rank) : null),
        total: (data.leaderboard_total != null ? Number(data.leaderboard_total) : null),
        events: Number(data.events || 0),
        cities: Number(data.cities || 0),
        badges: Array.isArray(data.badges) ? data.badges : [],
        referral: data.referral || {}
      };

      // Fallback rank (se backend non lo fornisce): calcolo client con top 200
      const norm = (em) => {
        try {
          const s = String(em || '').trim().toLowerCase();
          const [loc, dom] = s.split('@');
          if (!loc || !dom) return s;
          if (dom === 'gmail.com' || dom === 'googlemail.com') {
            const main = loc.split('+')[0].replaceAll('.', '');
            return `${main}@${dom}`;
          }
          return `${loc}@${dom}`;
        } catch { return String(em || '').toLowerCase(); }
      };
      if (gamification.value.rank == null || gamification.value.total == null) {
        try {
          const lbUrl = `${API}/gamification.php?action=leaderboard&limit=200&api_key=${API_KEY}`;
          const lr = await fetch(lbUrl, { cache: 'no-store' });
          if (lr.ok) {
            const arr = await lr.json();
            const target = norm(email);
            const idx = Array.isArray(arr) ? arr.findIndex(r => norm(r.email) === target) : -1;
            if (idx >= 0) {
              gamification.value.rank = idx + 1;
              gamification.value.total = arr.length;
            }
          }
        } catch {}
      }
    } catch (e) {
      console.error('Gamification error:', e);
      gamification.value = { points: 0, level: 0, events: 0, cities: 0, badges: [], referral: {}, rank: null, total: null };
    }
  }

  // Ricarica il profilo quando cambia il token (es. dopo il login)
  watch(token, loadProfile);
  // Carica al montaggio
  onMounted(loadProfile);

  return {
    token,
    profile,
    comments,
    defaultAvatar,
    formatDate,
    formatMonthYear,
    stats,
    gamification,
    loadProfile,
    loadGamification
  };
}
