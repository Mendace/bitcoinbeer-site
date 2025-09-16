import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import Contact from '../views/Contact.vue';
import Explore from '../views/Explore.vue'; 
import Chapters from '../views/Start.vue';
import Edu from '../views/Edu.vue';
import Pub from '../views/Pub.vue';
import Logos from '../views/Logos.vue';
import Typography from '../views/Typography.vue';
import Colors from '../views/Colors.vue';
import Brands from '../views/Brands.vue';
import Partners from '../views/Partners.vue';
import About from '../views/About.vue';
import Faq from '../views/Faq.vue';
import ComingSoon from '../views/ComingSoon.vue';
import Articles from '../views/Articles.vue';
import NotFound from '../views/NotFound.vue';
import BlogMain from '../views/BlogMain.vue';
import AllEvents from '../views/AllEvents.vue';
import EventDetailPage from '../views/EventDetailPage.vue';
import CompleteProfile from '../views/CompleteProfile.vue';
import Privacy from '../views/Privacy.vue';
import SearchPage from '../views/SearchPage.vue';
import ResultsPage from '../views/ResultsPage.vue';
import FyndraSearch from '../components/FyndraSearch.vue';
import QrCode from '../views/QrCode.vue';
import RegisterPage from '../views/RegisterPage.vue';
import LoginPage from '../views/LoginPage.vue';
import BeerLoginUnified from '@/views/BeerLoginUnified.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import NewsletterPage from '../views/NewsletterPage.vue';
import BoltsViewer from '../views/BoltsViewer.vue'

const myReels = [
  'https://peertube.uno/videos/embed/vouhzfXDksWyBPENMK2PDg',
  'https://peertube.uno/videos/embed/ikzsdapcyima26X5ewHznM',
  'https://peertube.uno/videos/embed/esYjLmeKSTkZ27U9bqKZEB',
  'https://peertube.uno/videos/embed/fAABMNStVpjqZgkMBMhQYy',
]
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../views/Leaderboard.vue'),
    meta: {
      title: 'Bitcoin Beer - Leaderboard',
      description: 'Classifica livelli e punti della community Bitcoin Beer.',
    },
  },
  {
    path: '/bolts/:index?',
    name: 'bolts-viewer',
    component: BoltsViewer,
    meta: { embeds: myReels }
  },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/login-unified-bb', name: 'BeerLoginUnified', component: BeerLoginUnified, meta: { guestOnly: true } },
  { path: '/newsletter', name: 'Newsletter', component: NewsletterPage },
  {
    path: '/CompleteProfile',
    name: 'Profile',
    component: CompleteProfile,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { guestOnly: true, title: 'Password dimenticata' }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { guestOnly: true, title: 'Reimposta password' }
  },
  {
    path: '/Privacy',
    name: 'Privacy',
    component: Privacy,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/all-events',
    name: 'AllEvents',
    component: AllEvents
  },
  {
    path: '/event/:id',
    name: 'EventDetailPage',
    component: EventDetailPage,
    props: true
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'Bitcoin Beer - Contatti',
      description: 'Contattaci per qualsiasi domanda o collaborazione con Bitcoin Beer.',
      ogTitle: 'Bitcoin Beer - Contatti',
      ogDescription: 'Contattaci per qualsiasi domanda o collaborazione con Bitcoin Beer.',
      ogImage: '/assets/blog.webp',
    },
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore,
  },
  {
    path: '/brands',
    name: 'Brands',
    component: Brands,
    meta: {
      title: 'Bitcoin Beer - Brands',
      description: 'Loghi e risorse ufficiali di Bitcoin Beer per il branding.',
      ogTitle: 'Bitcoin Beer - Brands',
      ogDescription: 'Loghi e risorse ufficiali di Bitcoin Beer per il branding.',
      ogImage: '/src/assets/img/og-brands.png',
    },
  },
  // RIMOSSA rotta duplicata su '/event/:id' che puntava a components/EventDetail.vue
  {
    path: '/start',
    name: 'Start',
    component: Chapters,
  },
  {
    path: '/edu',
    name: 'Edu',
    component: Edu,
  },
  {
    path: '/pub',
    name: 'Pub',
    component: Pub,
  },
  {
    path: '/qrcode',
    name: 'qrcode',
    component: QrCode,
  },
  {
    path: '/logos',
    name: 'Logos',
    component: Logos,
    meta: {
      title: 'Bitcoin Beer - Loghi',
      description: 'Scarica i loghi ufficiali di Bitcoin Beer.',
      ogTitle: 'Bitcoin Beer - Loghi',
      ogDescription: 'Scarica i loghi ufficiali di Bitcoin Beer.',
      ogImage: '/assets/blog.webp',
    },
  },
  {
    path: '/typography',
    name: 'Typography',
    component: Typography,
    meta: {
      title: 'Bitcoin Beer - Tipografia',
      description: 'Esplora la tipografia ufficiale di Bitcoin Beer.',
      ogTitle: 'Bitcoin Beer - Tipografia',
      ogDescription: 'Esplora la tipografia ufficiale di Bitcoin Beer.',
      ogImage: '/assets/blog.webp',
    },
  },
  {
    path: '/colors',
    name: 'Colors',
    component: Colors,
    meta: {
      title: 'Bitcoin Beer - Colori',
      description: 'Scopri la palette colori ufficiale di Bitcoin Beer.',
      ogTitle: 'Bitcoin Beer - Colori',
      ogDescription: 'Scopri la palette colori ufficiale di Bitcoin Beer.',
      ogImage: '/assets/blog.webp',
    },
  },
  {
    path: '/partners',
    name: 'Partners',
    component: Partners,
    meta: {
      title: 'Bitcoin Beer - Partners',
      description: 'I partner ufficiali che supportano Bitcoin Beer.',
      ogTitle: 'Bitcoin Beer - Partners',
      ogDescription: 'I partner ufficiali che supportano Bitcoin Beer.',
      ogImage: '/assets/blog.webp',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'Bitcoin Beer - About',
      description: 'Scopri di più sull’organizzazione Bitcoin Beer e la sua missione.',
      ogTitle: 'Bitcoin Beer - About',
      ogDescription: 'Scopri di più sull’organizzazione Bitcoin Beer e la sua missione.',
      ogImage: '/assets/blog.webp',
    },
  },
  {
    path: '/faq',
    name: 'Faq',
    component: Faq,
    meta: {
      title: 'Bitcoin Beer - FAQ',
      description: 'Risposte alle domande più frequenti su Bitcoin Beer.',
      ogTitle: 'Bitcoin Beer - FAQ',
      ogDescription: 'Risposte alle domande più frequenti su Bitcoin Beer.',
      ogImage: '/assets/blog.webp',
    },
  },
  {
    path: '/comingsoon',
    name: 'ComingSoon',
    component: ComingSoon,
    meta: {
      title: 'Bitcoin Beer - In Arrivo',
      description: 'Funzionalità e aggiornamenti in arrivo su Bitcoin Beer.',
      ogTitle: 'Bitcoin Beer - In Arrivo',
      ogDescription: 'Funzionalità e aggiornamenti in arrivo su Bitcoin Beer.',
      ogImage: '/assets/blog.webp',
    },
  },
  {
    path: '/article/:id',
    name: 'Articles',
    component: Articles,
    props: true,
    meta: {
      title: 'Bitcoin Beer - Articolo',
      description: 'Leggi l\'articolo sul blog Bitcoin Beer.',
      ogTitle: 'Bitcoin Beer - Articolo',
      ogDescription: 'Leggi l\'articolo sul blog Bitcoin Beer.',
      ogImage: '/src/assets/img/og-article.png',
    }
  },
  {
    path: '/blogmain',
    name: 'BlogMain',
    component: BlogMain,
    meta: {
      title: 'Bitcoin Beer - Articolo',
      description: 'Leggi l\'articolo sul blog Bitcoin Beer.',
      ogTitle: 'Bitcoin Beer - Articolo',
      ogDescription: 'Leggi l\'articolo sul blog Bitcoin Beer.',
      ogImage: '/src/assets/img/og-article.png',
    }
  },
  {
    path: '/searchpage',
    name: 'searchpage',
    component: SearchPage,
  },
  {
    path: '/resultspage',
    name: 'Results',
    component: ResultsPage,
  },
  { path: '/fyndrasearch', name:'fyndrasearch', component: FyndraSearch},
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Pagina Non Trovata',
      description: 'Siamo spiacenti, la pagina che stai cercando non esiste.',
      ogTitle: 'Pagina Non Trovata',
      ogDescription: 'Siamo spiacenti, la pagina che stai cercando non esiste.',
      ogImage: '/src/assets/img/og-notfound.png',
    },
  },
];

const router = createRouter({
  history: createWebHistory('/'), // Puoi usare '/' direttamente
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const { title, description, ogTitle, ogDescription, ogImage } = to.meta || {};

  // Set page title
  if (title) {
    document.title = title;
  }

  // Set meta description
  const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
  metaDescription.name = 'description';
  metaDescription.content = description || '';
  document.head.appendChild(metaDescription);

  // Set Open Graph meta tags
  const setOgMeta = (property, content) => {
    const metaTag = document.querySelector(`meta[property="${property}"]`) || document.createElement('meta');
    metaTag.setAttribute('property', property);
    metaTag.setAttribute('content', content || '');
    document.head.appendChild(metaTag);
  };

  setOgMeta('og:title', ogTitle || title);
  setOgMeta('og:description', ogDescription || description);
  setOgMeta('og:image', ogImage || '/assets/blog.webp');
  setOgMeta('og:type', 'website');
  setOgMeta('og:url', window.location.href);

  next();
});

export default router;
