<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 ml-64 bg-gray-100">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-96">
            <h1 class="text-2xl font-bold text-gray-900 mb-4">Panel de Administración</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4">Posts</h2>
                <div class="space-y-4">
                  <router-link 
                   :to="{ name: 'dashboard-posts-new' }"
                   class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                 >
                   Crear nuevo post
                 </router-link>
                </div>
              </div>
              <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4">Categorías</h2>
                <div class="space-y-4">
                  <router-link 
                   :to="{ name: 'dashboard-categories' }"
                   class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                 >
                   Ver y gestionar categorías
                 </router-link>
                </div>
              </div>
              <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4">Estadísticas</h2>
                <div class="space-y-4">
                  <div class="text-center">
                    <p class="text-3xl font-bold text-indigo-600">{{ posts.length }}</p>
                    <p class="text-gray-500">Posts totales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Render child components -->
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePosts } from '../firebase/posts'
import Sidebar from '../components/Sidebar.vue'
import type { Post } from '@/types'

const { getPosts } = usePosts()
const posts = ref<Post[]>([])

const createPost = () => {
  // Implementar la lógica para crear un nuevo post
  console.log('Crear nuevo post')
}

onMounted(async () => {
  posts.value = await getPosts()
})
</script>
