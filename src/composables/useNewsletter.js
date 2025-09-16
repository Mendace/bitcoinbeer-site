import { ref, reactive } from 'vue';

export function useNewsletter() {
  const PROXY = 'https://api.bitcoinbeer.events/api/proxy.php';
  const token = localStorage.getItem('user_token') || '';

  const newsletters = [
    { id:'news',   listId:5, uuid:'3c9e5f42-ab46-49b9-a6e5-646db929fcbc', schedule:'Ad ogni novità',   title:'News',   description:'Gli aggiornamenti di Bitcoin Beer: novità fresche, cambi di programma, notizie importanti. Senza spam, solo cose che vale la pena sapere.', image:'/assets/beer-newsletter.png' },
    { id:'events', listId:3, uuid:'818b4ea2-ea1f-48c1-843f-2f40c62604f6', schedule:'Ad ogni nuovo evento', title:'Events',description:"Gli eventi di Bitcoin Beer, dal vivo e senza troppi giri di parole. Incontri, chiacchiere e birre fresche: ti avvisiamo quando c'è qualcosa di bello.",                image:'/assets/events-newsletter.png' },
    { id:'blog',   listId:4, uuid:'8c2f9139-e995-4e96-82ea-a30852361428', schedule:'Quando pubblichiamo',   title:'Blog',   description:'Una newsletter per restare in contatto, leggere storie, scoprire novità. Poche cose, scelte bene.', image:'/assets/blog-newsletter.png' },
    { id:'atlas21',   listId:8, uuid:'566d846b-09af-4af6-9a1d-abc84fdbceec', schedule:'Una volta al mese',   title:'Atlas21 Brief',   description:'Una volta al mese, le cinque notizie su Bitcoin che vale la pena leggere. Scelte e riassunte da Atlas21.', image:'/assets/atlas-newsletter.png' },
    { id:'op_return',   listId:6, uuid:'cb71bcba-ea57-4c03-aa4e-c39ca0015c18', schedule:'Una volta al mese',   title:'Op_return',   description:'Una volta al mese Mauro Pili ci racconta cosa succede nel mondo dei developer Bitcoin. Tra novità, bug, miglioramenti e idee che potrebbero cambiare tutto. O niente.', image:'/assets/opreturn.jpg' },
    { id:'exit',   listId:7, uuid:'61381a5b-6a01-4468-be0b-7ec706ccba21', schedule:'Una volta al mese',   title:'Exit',   description:'Una newsletter per scoprire app, software e progetti alternativi nati in Europa.', image:'/assets/europe-newsletter.png' },
  ];

  const emailForm       = ref('');
  const newsletterEmail = ref('');
  const subscriptions   = reactive({ news:false, events:false, blog:false });
  const subscriberId    = ref(null);
  const isUpdating      = ref(false);

  function extractIdUuid(o) {
    const id   = o.id ?? o.list_id ?? o.listId ?? (o.list?.id) ?? null;
    const uuid = o.uuid ?? (o.list?.uuid) ?? '';
    return { id: id!==null ? Number(id) : null, uuid };
  }

  async function callProxy(endpoint, { method='GET', query, json } = {}) {
    let url = `${PROXY}?endpoint=${encodeURIComponent(endpoint)}`;
    if (query) url += `&query=${encodeURIComponent(query)}`;
    const opts = { method, headers:{ 'Authorization': `token ${token}` } };
    if (json) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(json);
    }
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`${method} ${endpoint} → ${res.status}`);
    return res.json();
  }

  // 1) crea o recupera subscriber
  async function ensureSubscriberExists() {
    if (subscriberId.value) return true;

    // ricerca CON apici
    const q = `email='${newsletterEmail.value}'`;
    let j = await callProxy('/subscribers', { query: q });
    if (j.data?.results?.length) {
      subscriberId.value = j.data.results[0].id;
      return true;
    }

    // non esiste → crealo senza liste, preconfirm
    j = await callProxy('/subscribers', {
      method: 'POST',
      json: {
        email: newsletterEmail.value,
        name:  newsletterEmail.value.split('@')[0],
        status:'enabled',
        preconfirm_subscriptions: true
      }
    });
    if (j.data?.id) {
      subscriberId.value = j.data.id;
      return true;
    }
    return false;
  }

  // 2) carica lo stato delle liste
  async function loadSubscriptions() {
    Object.keys(subscriptions).forEach(k => subscriptions[k] = false);
    subscriberId.value = null;
    newsletterEmail.value = emailForm.value.trim();
    if (!newsletterEmail.value) return;

    await ensureSubscriberExists();

    const j = await callProxy(`/subscribers/${subscriberId.value}`);
    (j.data.lists || []).forEach(item => {
      const { id, uuid } = extractIdUuid(item);
      const m = newsletters.find(n =>
        (id!==null && id===n.listId) || (uuid && uuid===n.uuid)
      );
      if (m) subscriptions[m.id] = true;
    });
  }

  // 3) salva/aggiorna email (solo creazione, niente PUT per non sbattere sul unique)
  async function saveNewsletterEmail() {
    if (!token) return alert('Devi essere loggato');
    isUpdating.value = true;
    try {
      newsletterEmail.value = emailForm.value.trim();
      if (!newsletterEmail.value) return alert('Inserisci un\'email');
      await ensureSubscriberExists();
      await loadSubscriptions();  // riallinea subito
    } catch (e) {
      console.error(e);
      alert('Errore di rete o duplicato');
    } finally {
      isUpdating.value = false;
    }
  }

  // 4) toggle iscrizione
  async function toggleNewsletter(key) {
    if (isUpdating.value) return;
    newsletterEmail.value = emailForm.value.trim();
    if (!newsletterEmail.value) {
      alert('Prima premi "Salva" per impostare la mail');
      return;
    }
    subscriptions[key] = !subscriptions[key];
    isUpdating.value = true;
    try {
      await ensureSubscriberExists();
      const listId = newsletters.find(n=>n.id===key).listId;
      const action = subscriptions[key] ? 'add' : 'remove';

      await callProxy('/subscribers/lists', {
        method:'PUT',
        json:{
          ids: [subscriberId.value],
          action,
          target_list_ids: [listId],
          status: 'confirmed'
        }
      });

      await loadSubscriptions();  // riallinea dopo il toggle
    } catch (e) {
      console.error(e);
      subscriptions[key] = !subscriptions[key];
      alert('Errore aggiornamento sottoscrizioni');
    } finally {
      isUpdating.value = false;
    }
  }

  return {
    newsletters,
    emailForm,
    isUpdating,
    subscriptions,
    saveNewsletterEmail,
    toggleNewsletter
  };
}
