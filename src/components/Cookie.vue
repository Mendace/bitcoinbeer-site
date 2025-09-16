<template>
    <div v-if="showBanner" class="fixed bottom-0 w-full p-4 flex justify-between items-center"
         style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-top: 4px solid transparent; background-clip: padding-box, border-box; border-image: linear-gradient(to right, yellow, orange) 1;">
      <p class="text-white">{{ $t('cookies.message') }}</p>
      <div class="flex gap-2">
        <button @click="acceptCookies" class="polyglass-btn border-green-500 hover:border-green-400 hover:shadow-green-500">{{ $t('cookies.accept') }}</button>
        <button @click="declineCookies" class="polyglass-btn border-red-500 hover:border-red-400 hover:shadow-red-500">{{ $t('cookies.decline') }}</button>
        <button @click="showPreferences" class="polyglass-btn border-blue-500 hover:border-blue-400 hover:shadow-blue-500">{{ $t('cookies.preferences') }}</button>
      </div>
    </div>
  
    <div v-if="showPreferencesModal" class="fixed bottom-16 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h2 class="text-lg font-semibold">{{ $t('cookies.preferences_title') }}</h2>
      <div class="mt-2">
        <label><input type="checkbox" v-model="analyticsConsent" /> {{ $t('cookies.analytics') }}</label>
        <br/>
        <label><input type="checkbox" v-model="marketingConsent" /> {{ $t('cookies.marketing') }}</label>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="savePreferences" class="polyglass-btn border-green-500 hover:border-green-400 hover:shadow-green-500">{{ $t('cookies.save') }}</button>
        <button @click="showPreferencesModal = false" class="polyglass-btn border-red-500 hover:border-red-400 hover:shadow-red-500">{{ $t('cookies.close') }}</button>
      </div>
    </div>
  
    <button v-if="!showBanner" @click="showBanner = true" class="fixed bottom-4 right-4 bg-gray-700 text-white px-4 py-2 rounded-full">
      🍪
    </button>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showBanner: false,
        showPreferencesModal: false,
        analyticsConsent: false,
        marketingConsent: false,
      };
    },
    methods: {
      acceptCookies() {
        localStorage.setItem('cookie_consent', 'accepted');
        localStorage.setItem('analytics_consent', 'true');
        localStorage.setItem('marketing_consent', 'true');
        this.showBanner = false;
        this.enableTracking();
      },
      declineCookies() {
        localStorage.setItem('cookie_consent', 'declined');
        localStorage.setItem('analytics_consent', 'false');
        localStorage.setItem('marketing_consent', 'false');
        this.showBanner = false;
        this.disableTracking();
      },
      showPreferences() {
        this.analyticsConsent = localStorage.getItem('analytics_consent') === 'true';
        this.marketingConsent = localStorage.getItem('marketing_consent') === 'true';
        this.showPreferencesModal = true;
      },
      savePreferences() {
        localStorage.setItem('analytics_consent', this.analyticsConsent);
        localStorage.setItem('marketing_consent', this.marketingConsent);
        this.showPreferencesModal = false;
      },
      checkConsent() {
        const consent = localStorage.getItem('cookie_consent');
        if (consent === 'accepted') {
          this.enableTracking();
        } else if (consent === null) {
          this.showBanner = true;
        }
      },
      enableTracking() {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://your-umami-instance.com/script.js';
        script.dataset.websiteId = 'YOUR_UMAMI_WEBSITE_ID';
        document.head.appendChild(script);
      },
      disableTracking() {
        const umamiScript = document.querySelector('script[src*="umami"]');
        if (umamiScript) umamiScript.remove();
      }
    },
    mounted() {
      this.checkConsent();
    }
  };
  </script>
  
  <style scoped>
  .polyglass-btn {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    padding: 0.5rem 1rem;
    border: 2px solid transparent;
    border-radius: 8px;
    color: white;
    transition: all 0.3s ease-in-out;
    position: relative;
  }
  .polyglass-btn:hover {
    box-shadow: 0 0 8px currentColor;
  }
  .polyglass-btn.border-green-500:hover {
    box-shadow: 0 0 12px rgba(0, 255, 0, 0.7);
  }
  .polyglass-btn.border-red-500:hover {
    box-shadow: 0 0 12px rgba(255, 0, 0, 0.7);
  }
  .polyglass-btn.border-blue-500:hover {
    box-shadow: 0 0 12px rgba(0, 128, 255, 0.7);
  }
  </style>
