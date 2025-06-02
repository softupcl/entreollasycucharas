<script setup lang="ts">
import BlogPost from '@/components/BlogPost.vue'
import HeroSlider from '@/components/HeroSlider.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { db } from '@/firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import { usePosts } from '@/firebase/posts'
import type { Post, Category } from '@/types'

// Estado para los posts y categorías
const posts = ref<Post[]>([])
const loading = ref(true)
const selectedCategory = ref<string | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const postsPerPage = ref(12)

// Función para manejar el cambio de categoría
const handleCategoryChange = (category: string | null) => {
  selectedCategory.value = category
  currentPage.value = 1
}

// Función para verificar si una categoría está seleccionada
const isCategorySelected = (categoryId: string | null) => {
  return selectedCategory.value === categoryId
}

// Estado para las categorías
const categories = ref<Category[]>([])

// Función para obtener categorías
const fetchCategories = async () => {
  try {
    // Obtener todas las categorías únicas de los posts
    const allCategories = posts.value.map((post) => post.category)
    const categoryIds = [...new Set(allCategories)]

    // Obtener las categorías del Firestore
    const categoriesCollection = collection(db, 'categories')
    const categoriesSnapshot = await getDocs(categoriesCollection)

    // Crear un mapa de categorías
    const categoriesMap = categoriesSnapshot.docs.reduce(
      (acc, doc) => {
        acc[doc.id] = {
          id: doc.id,
          name: doc.data().name as string,
          color: doc.data().color as string,
          createdAt: doc.data().createdAt as string,
          updatedAt: doc.data().updatedAt as string,
        }
        return acc
      },
      {} as Record<string, Category>,
    )

    // Actualizar las categorías
    categories.value = categoryIds
      .map((id) => categoriesMap[id] || { 
        id, 
        name: id, 
        color: 'bg-gray-100',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error al obtener categorías:', error)
  }
}

// Obtener categorías al cargar los posts
watch(
  posts,
  () => {
    if (posts.value.length > 0) {
      fetchCategories()
    }
  },
  { immediate: true },
)

// Función para obtener posts de Firebase
const fetchPosts = async () => {
  try {
    loading.value = true
    console.log('Obteniendo posts...')
    const fetchedPosts = await usePosts().getPosts()
    console.log('Posts obtenidos:', fetchedPosts)
    posts.value = fetchedPosts
    console.log('Posts en ref:', posts.value)
    console.log('Tipo de posts:', typeof posts.value)
    console.log('Número de posts:', posts.value.length)
  } catch (error) {
    console.error('Error al obtener posts:', error)
  } finally {
    loading.value = false
    console.log('Estado de carga:', loading.value)
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
    filtered = filtered.filter((post) => post.category === selectedCategory.value)
  }

  // Filtrar por búsqueda si hay texto de búsqueda
  if (searchQuery.value) {
    filtered = filtered.filter(filterBySearch)
  }

  return filtered
})

// Posts paginados
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage.value
  const end = start + postsPerPage.value
  return filteredPosts.value.slice(start, end)
})

// Número total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage.value)
})

// Función para cambiar página
const changePage = (page: number) => {
  currentPage.value = page
}

// Función para ir a la página anterior
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Función para ir a la página siguiente
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<template>
  <div class="container mx-auto px-6 py-12">
    <!-- Hero Slider -->
    <HeroSlider />

    <!-- Campo de búsqueda -->
    <div class="mb-8">
      <div class="relative">
        <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 opacity-20"></div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Buscar recetas..."
          class="w-full px-8 py-4 pr-14 text-sm rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all relative z-10 shadow-lg"
        />
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          @click="searchQuery = ''"
          v-if="searchQuery"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Lista de categorías -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button
          class="px-8 py-2 rounded-full text-sm font-medium transition-colors"
          @click="handleCategoryChange(null)"
          :class="[
            selectedCategory === null ? 'text-white' : 'text-gray-200',
            'bg-black',
            !selectedCategory ? 'hover:opacity-500' : 'hover:bg-gray-500',
          ]"
        >
          Todas las categorias
        </button>

        <button
          v-for="category in categories"
          :key="category.id"
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          @click="handleCategoryChange(category.id)"
          :class="[
            isCategorySelected(category.id) ? 'text-white' : 'text-gray-800',
            category.color || 'bg-gray-100',
            isCategorySelected(category.id) ? 'hover:opacity-90' : 'hover:bg-gray-200',
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error message -->
    <div v-else-if="!posts.length" class="text-center text-red-500">
      No se pudieron cargar los posts
    </div>

    <!-- Posts -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <BlogPost
        v-for="post in paginatedPosts"
        :key="post.id"
        :post="{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || 'Sin resumen disponible',
          createdAt: post.createdAt,
          imageUrl: post.imageUrl || '/default-image.jpg',
          author: post.author,
          category: post.category,
          categoryName: post.categoryName,
          content: post.content,
          updatedAt: post.updatedAt,
          categoryColor: categories.find(c => c.id === post.category)?.color || 'bg-gray-100'
        }"
      />
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="flex justify-center items-center mt-8">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="[
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
          'bg-gray-100 text-gray-700'
        ]"
      >
        Anterior
      </button>

      <span class="mx-4 text-gray-600">
        Página {{ currentPage }} de {{ totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="[
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
          'bg-gray-100 text-gray-700'
        ]"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
