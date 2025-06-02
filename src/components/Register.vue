<template>
  <div class="p-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
      <p class="text-gray-600">Regístrate para empezar</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-6">
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

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
          Confirmar contraseña
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
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

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          <span v-if="!loading">Crear cuenta</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>

      <div class="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?
        <router-link to="auth-login" class="font-medium text-blue-600 hover:text-blue-500">
          Inicia sesión aquí
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../firebase/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = null

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    loading.value = false
    return
  }

  try {
    await register(email.value, password.value)
    // Redirigir al home
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al crear la cuenta'
  } finally {
    loading.value = false
  }
}
</script>
