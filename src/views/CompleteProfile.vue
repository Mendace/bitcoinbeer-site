<template>
  <AppLayout>
    <div class="w-full max-w-3xl mx-auto px-4">
      <!-- Header profilo: sempre visibile -->
      <ProfileHeader :tickets="tickets" />

      <!-- Tabs sotto header -->
      <div class="flex items-center justify-start md:justify-center gap-3 md:gap-6 text-sm mt-2 overflow-x-auto no-scrollbar -mx-4 px-4 whitespace-nowrap">
        <button
          :aria-selected="activeTab==='settings'"
          @click="activeTab='settings'"
          class="px-3 py-1 rounded-full border transition min-w-max"
          :class="activeTab==='settings' ? 'border-white bg-white/10 text-white' : 'border-white/20 text-gray-300 hover:text-white hover:border-white/40'"
        >Impostazioni</button>
        <button
          :aria-selected="activeTab==='tickets'"
          @click="activeTab='tickets'"
          class="px-3 py-1 rounded-full border transition min-w-max"
          :class="activeTab==='tickets' ? 'border-white bg-white/10 text-white' : 'border-white/20 text-gray-300 hover:text-white hover:border-white/40'"
        >Ticket</button>
        <button
          :aria-selected="activeTab==='newsletter'"
          @click="activeTab='newsletter'"
          class="px-3 py-1 rounded-full border transition min-w-max"
          :class="activeTab==='newsletter' ? 'border-white bg-white/10 text-white' : 'border-white/20 text-gray-300 hover:text-white hover:border-white/40'"
        >Newsletter</button>
      </div>
      
      <!-- Contenuto tab selezionata -->
      <div class="mt-6">
        <ProfileSettingsSection v-if="activeTab==='settings'" />
        <ProfileTickets v-else-if="activeTab==='tickets'" :tickets="tickets" />
        <NewsletterSettings v-else />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout              from '@/components/profile/AppLayout.vue'
import ProfileHeader          from '@/components/profile/ProfileHeader.vue'
import ProfileSettingsSection from '@/components/profile/ProfileSettingsSection.vue'
import ProfileTickets         from '@/components/profile/ProfileTickets.vue'
import NewsletterSettings     from '@/components/profile/NewsletterSettings.vue'

const tickets = ref([])
const activeTab = ref('settings')

async function loadTickets () {
  try {
    const token = localStorage.getItem('user_token')
    if (!token) return
    const res = await fetch('https://api.bitcoinbeer.events/api/user_tickets.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    const json = await res.json()
    if (json?.success) {
      tickets.value = json.data?.tickets || []
    } else {
      tickets.value = []
      console.warn('user_tickets error', json?.error)
    }
  } catch (e) {
    console.error(e)
    tickets.value = []
  }
}

const route = useRoute()

onMounted(() => {
  loadTickets()
  // Soft refresh quando la finestra torna in focus o la tab diventa visibile
  window.addEventListener('focus', loadTickets)
  const visHandler = () => { if (document.visibilityState === 'visible') loadTickets() }
  document.addEventListener('visibilitychange', visHandler)

  // Soft refresh anche al cambio di rotta interno
  watch(() => route.fullPath, () => loadTickets())

  // Cleanup listeners su unmount
  onUnmounted(() => {
    window.removeEventListener('focus', loadTickets)
    document.removeEventListener('visibilitychange', visHandler)
  })
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
