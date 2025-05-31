<script setup lang="ts">
import BlogPost from '@/components/BlogPost.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import { ref, computed } from 'vue'

// Estado para almacenar la categoría seleccionada
const selectedCategory = ref<string | null>(null)
// Estado para la búsqueda
const searchQuery = ref('')

// Datos de ejemplo (en un proyecto real, estos vendrían de una API)
type Post = {
  id: number
  title: string
  excerpt: string
  date: string
  image: string
  author: string
  category: 'Tecnología' | 'Desarrollo' | 'Programación' | 'Diseño' | 'UI/UX'
}

const posts: Post[] = [
  {
    id: 1,
    title: 'Cómo empezar con Vue 3',
    excerpt: 'Aprende los fundamentos de Vue 3 y cómo crear aplicaciones modernas con este framework.',
    date: '28 de mayo, 2025',
    image: 'https://source.unsplash.com/random/800x600/?programming',
    author: 'Juan Pérez',
    category: 'Tecnología'
  },
  {
    id: 2,
    title: 'Tailwind CSS: Guía completa',
    excerpt: 'Descubre cómo usar Tailwind CSS para crear diseños modernos y responsive sin escribir CSS.',
    date: '25 de mayo, 2025',
    image: 'https://source.unsplash.com/random/800x600/?web-development',
    author: 'María García',
    category: 'Desarrollo'
  },
  {
    id: 3,
    title: 'Mejores prácticas en Vue.js',
    excerpt: 'Consejos y mejores prácticas para desarrollar aplicaciones Vue.js escalables y mantenibles.',
    date: '20 de mayo, 2025',
    image: 'https://source.unsplash.com/random/800x600/?coding',
    author: 'Carlos López',
    category: 'Programación'
  },
  {
    id: 4,
    title: 'Diseño responsivo con Vue',
    excerpt: 'Aprende a crear diseños responsivos usando Vue y Tailwind CSS.',
    date: '18 de mayo, 2025',
    image: 'https://source.unsplash.com/random/800x600/?design',
    author: 'Ana Martínez',
    category: 'Diseño'
  },
  {
    id: 5,
    title: 'UX para aplicaciones modernas',
    excerpt: 'Consejos para mejorar la experiencia de usuario en tus aplicaciones web.',
    date: '15 de mayo, 2025',
    image: 'https://source.unsplash.com/random/800x600/?ux',
    author: 'Luis Ramírez',
    category: 'UI/UX'
  }
]

// Función para filtrar posts por búsqueda
const filterBySearch = (post: Post) => {
  const query = searchQuery.value.toLowerCase()
  return (
    post.title.toLowerCase().includes(query) ||
    post.excerpt.toLowerCase().includes(query) ||
    post.category.toLowerCase().includes(query) ||
    post.author.toLowerCase().includes(query) ||
    post.date.toLowerCase().includes(query)
  )
}

// Posts filtrados según la categoría y búsqueda
const filteredPosts = computed(() => {
  let filtered = posts
  
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

    <!-- Posts -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <BlogPost v-for="post in filteredPosts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
