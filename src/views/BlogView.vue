<script setup lang="ts">
import BlogPost from '@/components/BlogPost.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import { ref, computed, onMounted } from 'vue'
import { getPosts } from '@/firebase/posts'

// Estado para almacenar la categoría seleccionada
const selectedCategory = ref<string | null>(null)
// Estado para la búsqueda
const searchQuery = ref('')
// Estado para los posts
const posts = ref<Post[]>([])
// Estado de carga
const loading = ref(true)

// Definición del tipo Post
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
}

// Función para obtener posts de Firebase
const fetchPosts = async () => {
  try {
    const postsData = await getPosts()
    posts.value = postsData
  } catch (error) {
    console.error('Error al obtener posts:', error)
  } finally {
    loading.value = false
  }
}

// Obtener posts al montar el componente
onMounted(fetchPosts)

// Función para filtrar posts por búsqueda
const filterBySearch = (post: Post) => {
  const query = searchQuery.value.toLowerCase()
  return (
    post.title.toLowerCase().includes(query) ||
    post.excerpt?.toLowerCase().includes(query) ||
    post.category.toLowerCase().includes(query) ||
    post.author.toLowerCase().includes(query) ||
    post.createdAt.toLowerCase().includes(query)
  )
}

// Posts filtrados según la categoría y búsqueda
const filteredPosts = computed(() => {
  let filtered = posts.value
  
  // Filtrar por categoría si hay una seleccionada
  if (selectedCategory.value) {
    filtered = filtered.filter(post => post.category === selectedCategory.value)
  }
  
  // Filtrar por búsqueda si hay texto de búsqueda
  if (searchQuery.value) {
    filtered = filtered.filter(filterBySearch)
  }
  
  return filtered
})

// Función para manejar el cambio de categoría
const handleCategoryChange = (category: string | null) => {
  selectedCategory.value = category
}


</script>

<template>
  <div class="container mx-auto px-6 py-12">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 mb-12 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      <div class="relative">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">Bienvenido a nuestro blog</h1>
        <p class="text-xl mb-8">Descubre los últimos artículos sobre tecnología, desarrollo y diseño web</p>
        <button class="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all">
          Explorar ahora
        </button>
      </div>
    </div>

    <!-- Filtros por categoría -->
    <div class="mb-8">
      <CategoryFilter @update-category="handleCategoryChange" />
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Posts -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <BlogPost v-for="post in filteredPosts" :key="post.id" :post="{
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        createdAt: post.createdAt,
        imageUrl: post.imageUrl || '',
        author: post.author,
        category: post.category,
        content: post.content,
        updatedAt: post.updatedAt
      }" />
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
