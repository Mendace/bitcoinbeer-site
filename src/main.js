// src/main.js
import { createApp } from 'vue'
import { createHead } from '@vueuse/head';
import App from './App.vue'
import router from './router' // Importa il router
import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css';
import i18n from "./i18n";
// src/main.js
import 'animate.css';



const app = createApp(App)
const head = createHead();

app.use(head);
app.config.compilerOptions.isCustomElement = (tag) => tag === 'lottie-player';
app.use(router) // Usa il router
app.use(i18n);
app.mount('#app')
