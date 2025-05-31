<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePosts } from '../firebase/posts'

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
  image?: string
  excerpt?: string
  comments: Comment[]
}

const route = useRoute()
const { getPostById } = usePosts()
const newComment = ref('')
const comments = ref<Comment[]>([])
const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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
const addComment = async () => {
  if (!newComment.value.trim()) return

  const comment: Comment = {
    id: comments.value.length + 1,
    author: 'Usuario',
    content: newComment.value,
    date: new Date().toISOString()
  }

  comments.value.push(comment)
  newComment.value = ''
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
    day: 'numeric'
  })
}
</script>

<template>
  <div v-if="post" class="max-w-4xl mx-auto">
    <!-- Header con botón de regreso -->
    <div class="flex items-center mb-8">
      <router-link 
        to="/blog" 
        class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al blog
      </router-link>
    </div>

    <article class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Imagen del post -->
      <div class="h-64 bg-gray-200 relative">
        <img 
          v-if="post.image"
          :src="post.image" 
          :alt="post.title" 
          class="w-full h-full object-cover"
      </div>

      <!-- Contenido del post -->
      <div class="p-8">
        <div v-html="post.content"></div>
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
          ></textarea>
        </div>
        <button
          @click="addComment"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Publicar comentario
        </button>
      </div>
    </div>

    <!-- Lista de comentarios -->
    <div v-if="post">
      <div v-if="comments.length > 0">
        <div v-for="comment in comments" :key="comment.id" class="bg-white rounded-lg shadow-md p-6 mb-4">
          <div class="flex items-start">
            <div class="flex-1">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold">{{ comment.author }}</span>
                <span class="text-sm text-gray-500">{{ formatDate(comment.date) }}</span>
              </div>
              <p class="text-gray-700">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-6 text-gray-500">
        No hay comentarios aún
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  max-width: none;
}
</style>
