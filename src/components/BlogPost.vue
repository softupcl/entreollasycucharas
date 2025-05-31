<script setup lang="ts">
type Category = string

interface BlogPost {
  id: string
  title: string
  excerpt: string
  createdAt: string
  imageUrl: string
  author: string
  category: Category
  content: string
  updatedAt: string
}

const props = defineProps<{
  post: BlogPost
}>()

// Mapeo de categorías a colores
const categoryColors = {
  Tecnología: 'bg-blue-500',
  Desarrollo: 'bg-purple-500',
  Diseño: 'bg-pink-500',
  Programación: 'bg-green-500',
  'UI/UX': 'bg-yellow-500',
  default: 'bg-gray-500'
}

// Función para obtener el color de la categoría
const getCategoryColor = (category: string) => {
  return categoryColors[category as keyof typeof categoryColors] || categoryColors.default
}
</script>

<template>
  <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <!-- Enlace a la página de detalle -->
    <router-link :to="`/blog/${post.id}`" class="block">
      <div class="h-48 bg-gray-200 relative">
        <div v-if="post.imageUrl" class="w-full h-full">
          <img :src="post.imageUrl || ''" 
               :alt="post.title" 
               class="w-full h-full object-cover"
               loading="lazy"
               @error="(e) => {
                 const img = e.target as HTMLImageElement
                 img.src = 'https://source.unsplash.com/random/800x600/?programming'
               }"
               @load="(e) => {
                 const img = e.target as HTMLImageElement
                 if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                   img.src = 'https://source.unsplash.com/random/800x600/?programming'
                 }
               }" />
        </div>
        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
      </div>
      <div class="p-6">
        <!-- Categoría -->
        <div
          class="inline-block px-3 py-1 rounded-full mb-4"
          :class="getCategoryColor(post.category) + ' text-white font-semibold text-sm'"
        >
          {{ post.category }}
        </div>

        <h3 class="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          {{ post.title }}
        </h3>

        <div class="flex items-center justify-between mb-4">
          <p class="text-gray-600 text-sm">{{ post.createdAt }}</p>
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ post.author }}
          </div>
        </div>

        <p class="text-gray-700 line-clamp-2">{{ post.excerpt }}</p>
      </div>
    </router-link>
  </article>
</template>
