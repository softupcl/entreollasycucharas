<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>
    <footer class="bg-white shadow-lg mt-12">
      <div class="container mx-auto px-4 py-6">
        <div class="text-center text-gray-600">
          <p>&copy; 2025 Entre ollas y cucharas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
