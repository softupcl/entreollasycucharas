<script setup lang="ts">
import { ref } from 'vue'

const categories = [
  { id: 1, name: 'Tecnología', color: 'bg-blue-500' },
  { id: 2, name: 'Desarrollo', color: 'bg-purple-500' },
  { id: 3, name: 'Diseño', color: 'bg-pink-500' },
  { id: 4, name: 'Programación', color: 'bg-green-500' },
  { id: 5, name: 'UI/UX', color: 'bg-yellow-500' },
]

const selectedCategory = ref<string | null>(null)

// Evento para emitir la categoría seleccionada
const emit = defineEmits(['update-category'])

const selectCategory = (category: string | null) => {
  selectedCategory.value = category
  emit('update-category', category)
}
</script>

<template>
  <div class="flex flex-wrap gap-3 mb-8">
    <button
      @click="selectCategory(null)"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition-all',
        selectedCategory === null
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      ]"
    >
      Todo
    </button>
    <button
      v-for="category in categories"
      :key="category.id"
      @click="selectCategory(category.name)"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition-all',
        selectedCategory === category.name
          ? `${category.color} text-white`
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      ]"
    >
      {{ category.name }}
    </button>
  </div>
</template>
