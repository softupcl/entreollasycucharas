<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePosts } from '../firebase/posts'
import { useCategories } from '../firebase/categories'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '@/types'
import type { Category } from '@/types'

const { getPosts, deletePost } = usePosts()
const { getCategories } = useCategories()
const route = useRoute()
const router = useRouter()
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const loadPosts = async () => {
  try {
    loading.value = true
    error.value = null
    posts.value = await getPosts()
    categories.value = await getCategories()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar los datos'
  } finally {
    loading.value = false
  }
}

const handleDelete = async (postId: string) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este post?')) return

  try {
    await deletePost(postId)
    await loadPosts()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al eliminar el post'
  }
}

// Function to get category color
const getCategoryColor = (categoryName: string) => {
  const colors = {
    Noticias: 'bg-blue-500',
    Tecnología: 'bg-purple-500',
    Deportes: 'bg-green-500',
    Entretenimiento: 'bg-pink-500',
    Negocios: 'bg-orange-500',
    Ciencia: 'bg-yellow-500',
    Salud: 'bg-red-500',
    Educación: 'bg-gray-500',
  }
  return colors[categoryName] || 'bg-blue-500'
}

// Function to get category name from ID
const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'Categoría no encontrada'
}

onMounted(() => {
  loadPosts()
})
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Posts</h1>
      <router-link
        :to="{ name: 'dashboard-posts-new' }"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Nuevo Post</span>
      </router-link>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <svg class="animate-spin h-12 w-12 text-gray-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-600">Cargando posts...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <svg class="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="mt-2 text-red-600">{{ error }}</p>
      </div>
    </div>

    <!-- Posts table -->
    <div v-else class="bg-white shadow rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ post.title }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[getCategoryColor(getCategoryName(post.category)), 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium']">
                  {{ getCategoryName(post.category) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ new Date(post.createdAt).toLocaleDateString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="{ name: 'dashboard-posts-edit', params: { id: post.id }}"
                  class="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </router-link>
                <button
                  @click="handleDelete(post.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No posts state -->
    <div v-if="posts.length === 0" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay posts</h3>
      <p class="mt-1 text-sm text-gray-500">¡Crea tu primer post!</p>
    </div>
  </div>
</template>

<style scoped>
.prose {
  max-width: none;
}
</style>
