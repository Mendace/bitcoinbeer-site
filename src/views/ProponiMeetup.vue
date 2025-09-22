<template>
  <section class="min-h-screen bg-neutral-950 text-white pt-20 pb-16 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">{{ t('propose.title') }}</h1>
      <p class="text-white/70 mb-8">{{ t('propose.subtitle') }}</p>

      <form @submit.prevent="submit" class="space-y-5">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">{{ t('propose.name') }}</label>
            <input v-model.trim="form.name" type="text" required class="bb-input" />
          </div>
          <div>
            <label class="block text-sm mb-1">{{ t('propose.email') }}</label>
            <input v-model.trim="form.email" type="email" required class="bb-input" />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">{{ t('propose.city') }}</label>
            <input v-model.trim="form.city" type="text" required class="bb-input" />
          </div>
          <div>
            <label class="block text-sm mb-1">{{ t('propose.when') }}</label>
            <input v-model="form.when" type="date" class="bb-input" />
          </div>
        </div>

        <div>
          <label class="block text-sm mb-1">{{ t('propose.venue') }}</label>
          <input v-model.trim="form.venue" type="text" placeholder="Bar / spazio / indirizzo" class="bb-input" />
        </div>

        <div>
          <label class="block text-sm mb-1">{{ t('propose.details') }}</label>
          <textarea v-model.trim="form.details" rows="5" required class="bb-input resize-y" />
        </div>

        <div class="flex items-start gap-3">
          <input id="privacy" v-model="form.privacy" type="checkbox" required class="mt-1" />
          <label for="privacy" class="text-sm text-white/80">
            {{ t('propose.consent') }}
          </label>
        </div>

        <div class="flex flex-wrap gap-3 pt-2">
          <button :disabled="loading" class="bb-btn">
            {{ loading ? t('propose.sending') : t('propose.send') }}
          </button>
          <a :href="mailtoHref" class="bb-btn-secondary">{{ t('propose.emailInstead') }}</a>
        </div>

        <p v-if="ok" class="text-emerald-400 text-sm">{{ t('propose.ok') }}</p>
        <p v-if="err" class="text-red-400 text-sm">{{ t('propose.error') }}</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const API_URL = import.meta.env.VITE_PROPOSE_MEETUP_API || '' // es. https://api.bitcoinbeer.events/api/propose_meetup.php

const form = reactive({
  name: '', email: '', city: '', when: '', venue: '', details: '', privacy: false,
})
const loading = ref(false)
const ok = ref(false)
const err = ref(false)

const mailtoHref = computed(() => {
  const subject = encodeURIComponent('Proposta meetup')
  const body = encodeURIComponent(
    `Nome: ${form.name}\nEmail: ${form.email}\nCittà: ${form.city}\nQuando: ${form.when}\nLuogo: ${form.venue}\nDettagli:\n${form.details}`
  )
  return `mailto:hello@bitcoinbeer.events?subject=${subject}&body=${body}`
})

async function submit() {
  ok.value = false; err.value = false
  if (!API_URL) { window.location.href = mailtoHref.value; return }
  try {
    loading.value = true
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        name: form.name, email: form.email, city: form.city, when: form.when,
        venue: form.venue, details: form.details
      }).toString(),
    })
    const j = await res.json().catch(() => ({}))
    if (res.ok && (j.success ?? true)) {
      ok.value = true
      // reset soft
      form.when = ''; form.venue=''; form.details=''
    } else throw new Error('fail')
  } catch {
    err.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bb-input{
  @apply w-full rounded-xl border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20;
}
.bb-btn{
  @apply inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition disabled:opacity-60;
}
.bb-btn-secondary{
  @apply inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#111214] px-4 py-2 text-sm text-white hover:bg-[#15161a] transition;
}
</style>
