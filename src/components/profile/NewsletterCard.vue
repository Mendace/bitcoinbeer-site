<template>
  <div
    class="relative flex bg-black/20 rounded-lg p-4"
    :class="disabled ? 'pointer-events-none opacity-60' : ''"
  >
    <!-- da: hidden sm:block -->
    <!-- a: block sm:block (oppure semplicemente block) -->
    <img
      v-if="data.image"
      :src="data.image"
      class="block sm:block w-20 h-20 object-cover rounded mr-4"
      alt=""
    />

    <div class="flex-1 pr-12">
      <p class="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
        {{ data.schedule }}
      </p>
      <h3 class="font-bold text-lg">{{ data.title }}</h3>
      <p class="text-gray-300 text-sm">{{ data.description }}</p>
    </div>

    <label class="absolute top-4 right-4 cursor-pointer">
      <input
        type="checkbox"
        class="sr-only"
        :checked="checked"
        :disabled="disabled"
        @change="$emit('toggle')"
      />
      <div
        class="w-10 h-6 bg-gray-400 rounded-full relative transition-colors"
        :class="checked ? 'bg-sky-500' : ''"
      >
        <div
          class="h-5 w-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"
          :style="checked ? 'transform:translateX(16px)' : ''"
        />
      </div>
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  data:     { type: Object,  required: true },
  checked:  { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});
const emit = defineEmits(['toggle']);
</script>
