<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import SearchBar from './SearchBar.vue'
import { auth } from '../firebase/config'
import type { User } from 'firebase/auth'

const menuOpen = ref(false)
const searchQuery = ref('')
const router = useRouter()
const user = ref<User | null>(null)

// Verificar el estado de autenticación
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    user.value = firebaseUser
  } else {
    user.value = null
  }
})

// Watch para detectar cambios en el estado de autenticación
watch(
  () => auth.currentUser,
  (newUser) => {
    if (newUser) {
      user.value = newUser
    } else {
      user.value = null
    }
  },
)

// Evento para manejar la búsqueda
const handleSearch = (query: string) => {
  searchQuery.value = query
}

// Función para iniciar sesión
const login = () => {
  router.push('/auth/login')
}

// Función para cerrar sesión
const logout = () => {
  auth.signOut().then(() => {
    router.push('/')
  })
}

const isAuthenticated = computed(() => user.value !== null)
</script>

<template>
  <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
    <nav class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-4xl font-bold tracking-tight"
            ><img src="../assets/images/food.svg" alt="Logo" class="w-16 h-16"
          /></span>
          <span class="text-3xl font-bold tracking-tight">Entre ollas y cucharas</span>
        </router-link>

        <!-- Search -->
        <!-- <div class="hidden md:flex items-center space-x-4">
          <SearchBar @search="handleSearch" />
        </div> -->

        <!-- Mobile menu button -->
        <button @click="menuOpen = !menuOpen" class="md:hidden">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              v-if="!menuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Desktop menu -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <span class="text-lg font-medium">Inicio</span>
          </router-link>

          <router-link to="/about" class="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <span class="text-lg font-medium">Acerca de</span>
          </router-link>

          <template v-if="isAuthenticated">
            <router-link
              to="/dashboard"
              class="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span class="text-lg font-medium">Dashboard</span>
            </router-link>
            <button
              @click="logout"
              class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span class="text-lg font-medium">Cerrar Sesión</span>
            </button>
          </template>
          <template v-else>
            <button
              @click="login"
              class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span class="text-lg font-medium">Iniciar Sesión</span>
            </button>
          </template>
        </div>
      </div>

      <!-- Mobile menu -->
      <div
        v-if="menuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4"
      >
        <router-link to="/" class="block mb-2 text-lg hover:text-white/80 transition-colors">
          Inicio
        </router-link>
        <router-link to="/blog" class="block mb-2 text-lg hover:text-white/80 transition-colors">
          Blog
        </router-link>
        <template v-if="isAuthenticated">
          <button
            @click="logout"
            class="block mb-2 w-full text-left text-lg hover:text-white/80 transition-colors"
          >
            Cerrar Sesión
          </button>
        </template>
        <template v-else>
          <button
            @click="login"
            class="block mb-2 w-full text-left text-lg hover:text-white/80 transition-colors"
          >
            Iniciar Sesión
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>
