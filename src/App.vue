<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer />
    <Cookie />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Cookie from './components/Cookie.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer, 
    Cookie
  }
}
</script>

<style>
/* Eventuali stili globali */
</style>
