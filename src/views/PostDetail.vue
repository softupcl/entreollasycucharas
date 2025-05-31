<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePosts, addComment } from '../firebase/posts'
import { useCategories } from '../firebase/categories'
import { getAuth } from 'firebase/auth'
import type { Category } from '@/types'

interface Comment {
  id: number
  author: string
  content: string
  date: string
}

interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  category: string
  imageUrl?: string
  excerpt?: string
  comments?: Comment[]
}

const route = useRoute()
const { getPostById } = usePosts()
const { getCategories } = useCategories()
const auth = getAuth()
const newComment = ref('')
const comments = ref<Comment[]>([])
const post = ref<Post | null>(null)
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isSaving = ref(false)
const commentError = ref<string | null>(null)
const canSubmitComment = computed(() => {
  return newComment.value.trim().length > 0 && newComment.value.length <= 500
})

// Función para obtener el nombre de la categoría
const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'Categoría no encontrada'
}

// Función para cargar el post
const loadPost = async () => {
  try {
    loading.value = true
    error.value = null
    const postId = route.params.id as string
    
    // Cargar el post y las categorías
    const [postData, categoriesData] = await Promise.all([
      getPostById(postId),
      getCategories()
    ])

    post.value = postData
    categories.value = categoriesData
    
    if (post.value) {
      comments.value = post.value.comments || []
    } else {
      error.value = 'No se encontró el post'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar el post'
  } finally {
    loading.value = false
  }
}

// Cargar el post al montar el componente
onMounted(() => {
  loadPost()
})

// Obtener el post al montar el componente
onMounted(async () => {
  try {
    const postId = route.params.id as string
    console.log('Intentando cargar post con ID:', postId)
    post.value = await getPostById(postId)
    if (post.value) {
      console.log('Post cargado exitosamente:', post.value)
      comments.value = post.value.comments
    } else {
      console.log('No se encontró post con ID:', postId)
      error.value = 'No se encontró el post'
    }
  } catch (err) {
    console.error('Error detallado:', err)
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    loading.value = false
  }
})

// Función para agregar un nuevo comentario
const validateComment = () => {
  if (newComment.value.trim().length === 0) {
    commentError.value = 'El comentario no puede estar vacío'
  } else if (newComment.value.length > 500) {
    commentError.value = 'El comentario no puede exceder los 500 caracteres'
  } else {
    commentError.value = null
  }
}

const handleAddComment = async () => {
  if (!canSubmitComment.value) return

  try {
    isSaving.value = true
    if (!post.value) {
      throw new Error('Post no encontrado')
    }

    const comment: Comment = {
      id: comments.value.length + 1,
      author: auth.currentUser?.email || 'Usuario',
      content: newComment.value,
      date: new Date().toISOString(),
    }

    // Actualizar comentarios en Firebase
    try {
      const updatedComments = await addComment(post.value.id, comment)
      comments.value = updatedComments
    } catch (error) {
      console.error('Error al actualizar comentarios en Firebase:', error)
      throw error
    }
    newComment.value = ''
    commentError.value = null
  } catch (err) {
    console.error('Error al agregar comentario:', err)
    error.value = err instanceof Error ? err.message : 'Error al agregar el comentario'
  } finally {
    isSaving.value = false
  }
}

// Mapeo de categorías a colores
type Category = 'Tecnología' | 'Desarrollo' | 'Diseño' | 'Programación' | 'UI/UX'

const categoryColors: Record<Category, string> = {
  Tecnología: 'bg-blue-500',
  Desarrollo: 'bg-purple-500',
  Diseño: 'bg-pink-500',
  Programación: 'bg-green-500',
  'UI/UX': 'bg-yellow-500',
}

// Función para obtener el color de una categoría
const getCategoryColor = (category: string): string => {
  return categoryColors[category as Category] || 'bg-gray-500'
}

// Formatear fecha
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <svg
          class="animate-spin h-12 w-12 text-gray-600 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="mt-2 text-gray-600">Cargando el post...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <svg
          class="w-12 h-12 text-red-500 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p class="mt-2 text-red-600">{{ error }}</p>
        <button
          @click="loadPost"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>

    <!-- Post content -->
    <div v-else-if="post">
      <!-- Header con botón de regreso -->
      <div class="flex items-center mb-8">
        <router-link
          to="/blog"
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al blog
        </router-link>
      </div>

      <article class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Información del post -->
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div
              class="inline-block px-3 py-1 rounded-full mr-4"
              :class="getCategoryColor(post.category) + ' text-white font-semibold text-sm'"
            >
              {{ getCategoryName(post.category) }}
            </div>
            <div class="flex items-center text-gray-600 text-sm">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {{ post.author }}
            </div>
          </div>

          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            {{ post.title }}
          </h1>

          <div class="text-gray-600 text-sm mb-6">
            Publicado el {{ formatDate(post.createdAt) }}
          </div>
        </div>

        <!-- Imagen del post -->
        <div class="relative aspect-video bg-gray-200 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          <img
            v-if="post.imageUrl"
            :src="post.imageUrl"
            :alt="post.title"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            @error="
              (e) => {
                const img = e.target as HTMLImageElement
                img.src = 'https://source.unsplash.com/random/800x600/?programming'
              }
            "
            @load="
              (e) => {
                const img = e.target as HTMLImageElement
                if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                  img.src = 'https://source.unsplash.com/random/800x600/?programming'
                }
              }
            "
          />
        </div>

        <!-- Contenido del post -->
        <div class="p-8 prose max-w-none">
          <div v-html="post.content" class="text-gray-900 leading-relaxed"></div>
        </div>
      </article>

      <!-- Formulario de comentarios -->
      <div v-if="post" class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Comentarios</h2>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="mb-6">
            <textarea
              v-model="newComment"
              placeholder="Escribe tu comentario..."
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              @input="validateComment"
            ></textarea>
            <p v-if="commentError" class="text-red-500 text-sm mt-1">
              {{ commentError }}
            </p>
          </div>
          <button
            @click="handleAddComment"
            :disabled="!canSubmitComment || isSaving"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              v-if="isSaving"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Publicar comentario
          </button>
        </div>
      </div>

      <!-- Lista de comentarios -->
      <div v-if="post">
        <div class="mt-8">
          <div v-if="comments && comments.length > 0">
            <div v-for="comment in comments" :key="comment.id" class="bg-white rounded-lg shadow-md p-6 mb-4">
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mr-4">
                  <svg class="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-semibold">{{ comment.author }}</span>
                    <span class="text-sm text-gray-500">{{ formatDate(comment.date) }}</span>
                  </div>
                  <p class="text-gray-700 line-clamp-3">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-500">
            <div class="flex flex-col items-center">
              <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p class="text-sm">No hay comentarios aún</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  max-width: none;
}
</style>
