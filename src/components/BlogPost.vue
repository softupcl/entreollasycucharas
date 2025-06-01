<script setup lang="ts">
interface BlogPost {
  id: string
  title: string
  excerpt: string
  createdAt: string
  imageUrl: string
  author: string
  category: string
  categoryName: string
  content: string
  updatedAt: string
  featured?: boolean
  categoryColor?: string
}

const props = defineProps<{
  post: BlogPost
}>()
</script>

<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
    <router-link :to="`/blog/${post.id}`" class="block">
      <div :class="{
        'h-48': !post.featured,
        'h-64 lg:h-96': post.featured
      }" class="bg-gray-200 relative">
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
      <div class="p-6" :class="{
        'lg:p-8': post.featured
      }">
        <div class="inline-flex items-center gap-2 mb-2">
          <span class="inline-block px-3 py-1 rounded-full text-sm font-medium"
                :class="[
                  post.categoryColor || 'bg-gray-100',
                  'text-white'
                ]">
            {{ post.categoryName }}
          </span>
        </div>

        <h3 class="text-xl md:text-2xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors" :class="{
          'lg:text-3xl': post.featured
        }">
          {{ post.title }}
        </h3>

        <p class="text-gray-600 mb-4 line-clamp-3" :class="{
          'lg:text-lg': post.featured
        }">
          {{ post.excerpt }}
        </p>

        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ post.author }}
          </span>
          <span>
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ new Date(post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>
