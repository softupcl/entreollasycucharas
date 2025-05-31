<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

// Evento para emitir la búsqueda
const emit = defineEmits(['search'])

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <div class="relative">
    <input
      type="text"
      v-model="searchQuery"
      @keyup.enter="handleSearch"
      placeholder="Buscar artículos..."
      class="w-full px-4 py-2 pl-10 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
    <button
      @click="handleSearch"
      class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
input {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
