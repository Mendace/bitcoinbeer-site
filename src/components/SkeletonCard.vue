<template>
  <!-- Singola card scheletro, occupa tutta la larghezza del contenitore -->
  <div class="skeleton-card w-full mb-4 p-4 rounded-md bg-gray-700 animate-pulse">
    <!-- Titolo più grande -->
    <div class="h-4 bg-gray-600 rounded w-1/2 mb-3"></div>
    <!-- Riga più piccola -->
    <div class="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
    <div class="h-3 bg-gray-600 rounded w-2/4 mb-2"></div>
  </div>
</template>

<script>
export default {
  name: "SkeletonCard",
};
</script>

<style scoped>
/* Se vuoi scurire o schiarire i colori, modifica i tailwind classes
   o aggiungi le tue regole custom. */
</style>
