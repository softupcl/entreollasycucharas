<template>
  <div class="p-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Bienvenido</h1>
      <p class="text-gray-600">Inicia sesión para continuar</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :class="[
              'w-full px-4 py-3 pl-10 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            ]"
            placeholder="ejemplo@email.com"
          />
          <p v-if="error" class="mt-1 text-sm text-red-500">
            {{ error }}
          </p>
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            :class="[
              'w-full px-4 py-3 pl-10 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            ]"
            placeholder="••••••••"
          />
          <p v-if="error" class="mt-1 text-sm text-red-500">
            {{ error }}
          </p>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="rememberMe"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">
            Recordarme
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          <span v-if="!loading">Iniciar sesión</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>

      <div class="text-center text-sm text-gray-600">
        ¿No tienes cuenta?
        <router-link to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
          Regístrate aquí
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref<string | null>(null)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    // Redirigir al home y actualizar el estado de autenticación
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
