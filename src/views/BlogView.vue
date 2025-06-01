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

// Función para manejar el cambio de categoría
const handleCategoryChange = (category: string | null) => {
  selectedCategory.value = category
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
        }
        return acc
      },
      {} as Record<string, { id: string; name: string; color: string }>,
    )

    // Actualizar las categorías
    categories.value = categoryIds
      .map((id) => categoriesMap[id] || { id, name: id, color: 'bg-gray-100' })
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
  console.log('Calculando filteredPosts...')
  console.log('Posts originales:', posts.value)
  console.log('Categoría seleccionada:', selectedCategory.value)
  console.log('Búsqueda:', searchQuery.value)

  let filtered = posts.value

  // Filtrar por categoría si hay una seleccionada
  if (selectedCategory.value) {
    filtered = filtered.filter((post) => post.category === selectedCategory.value)
    console.log('Posts después de filtrar por categoría:', filtered)
  }

  // Filtrar por búsqueda si hay texto de búsqueda
  if (searchQuery.value) {
    filtered = filtered.filter(filterBySearch)
    console.log('Posts después de filtrar por búsqueda:', filtered)
  }

  console.log('Posts filtrados finales:', filtered)
  return filtered
})
</script>

<template>
  <div class="container mx-auto px-6 py-12">
    <!-- Hero Slider -->
    <HeroSlider />

    <!-- Lista de categorías -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button
          class="px-8 py-2 rounded-full text-sm font-medium transition-colors"
          @click="handleCategoryChange(null)"
          :class="[
            !selectedCategory ? 'text-white' : 'text-gray-200',
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
        v-for="post in filteredPosts"
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
        }"
      />
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
