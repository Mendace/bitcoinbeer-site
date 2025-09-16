<template>
  <div class="container main mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-6">{{ $t('privacy.title') }}</h1>
    <p class="text-gray-700 text-center mb-4">{{ $t('privacy.last_updated') }}</p>
    
    <section v-for="(section, index) in privacySections" :key="index" class="mb-6">
      <h2 class="text-2xl font-semibold mb-2">{{ section.title }}</h2>
      <div class="text-gray-600 mb-2" v-html="section.content"></div>
    </section>
  </div>
</template>

<script>
export default {
  computed: {
    privacySections() {
      return [
        {
          title: this.$t('privacy.who_we_are.title'),
          content: this.$t('privacy.who_we_are.content')
        },
        {
          title: this.$t('privacy.data_collected.title'),
          content: this.$t('privacy.data_collected.content')
        },
        {
          title: this.$t('privacy.cookies.title'),
          content: this.$t('privacy.cookies.content')
        },
        {
          title: this.$t('privacy.data_storage.title'),
          content: this.$t('privacy.data_storage.content')
        },
        {
          title: this.$t('privacy.security.title'),
          content: this.$t('privacy.security.content')
        },
        {
          title: this.$t('privacy.user_rights.title'),
          content: this.$t('privacy.user_rights.content')
        },
        {
          title: this.$t('privacy.changes.title'),
          content: this.$t('privacy.changes.content')
        },
        {
          title: this.$t('privacy.contact.title'),
          content: this.$t('privacy.contact.content')
        }
      ];
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.main {
  margin-top: 6rem;
}
</style>
