<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()

// Función para manejar el clic en el enlace del dashboard
const handleDashboardClick = () => {
  if (!auth.isAdmin.value) {
    alert('Solo los administradores pueden acceder al panel de control')
    return
  }
  router.push('/dashboard')
}
</script>

<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-gray-800">
            Blog
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <router-link 
            to="/about" 
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sobre Nosotros
          </router-link>

          <!-- Enlace al dashboard solo para administradores -->
          <button
            v-if="auth.isAdmin"
            @click="handleDashboardClick"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Panel de Control
          </button>

          <!-- Enlace al dashboard para no administradores -->
          <button
            v-else
            @click="handleDashboardClick"
            class="text-gray-600 hover:text-gray-900 transition-colors cursor-not-allowed"
            disabled
          >
            Panel de Control
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
