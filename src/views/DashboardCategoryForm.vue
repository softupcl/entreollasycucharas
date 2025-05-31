<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategories } from '../firebase/categories'

const route = useRoute()
const router = useRouter()
const { createCategory, updateCategory, getCategoryById } = useCategories()

interface FormData {
  name: string
  color: string
}

const formData = ref<FormData>({
  name: '',
  color: 'bg-blue-500',
})

const validColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-gray-500',
]

const loading = ref(true)
const error = ref<string | null>(null)
const isEditing = computed(() => route.params.id !== undefined)

const loadCategory = async () => {
  if (!isEditing.value) return

  try {
    loading.value = true
    error.value = null
    const category = await getCategoryById(route.params.id as string)
    if (category) {
      formData.value = {
        name: category.name,
        color: category.color,
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar la categoría'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    if (!formData.value.name.trim()) {
      error.value = 'Por favor, ingresa un nombre para la categoría'
      return
    }

    if (!validColors.includes(formData.value.color)) {
      error.value = 'Por favor, selecciona un color válido'
      return
    }

    if (isEditing.value) {
      await updateCategory(route.params.id as string, formData.value)
    } else {
      await createCategory(formData.value)
    }
    router.push({ name: 'dashboard-categories' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al guardar la categoría'
  }
}

onMounted(() => {
  loadCategory()
})
</script>

<template>
  <div class="p-6">
    <div class="max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">
          {{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h1>
        <router-link
          :to="{ name: 'dashboard-categories' }"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Volver
        </router-link>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Color</label>
          <div class="mt-1 flex space-x-2">
            <button
              v-for="color in validColors"
              :key="color"
              @click="formData.color = color"
              :class="[
                'px-4 py-2 rounded-md border shadow-sm cursor-pointer',
                formData.color === color ? color : 'border-gray-300',
              ]"
            >
              <span class="inline-block w-4 h-4 rounded-full mr-2" :class="color"></span>
              {{ color }}
            </button>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="loading"
          >
            {{ isEditing ? 'Actualizar' : 'Crear' }} Categoría
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
