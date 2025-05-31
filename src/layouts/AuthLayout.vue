<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600"
  >
    <div class="w-full max-w-md mx-4">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isLogin = ref(true)

onMounted(() => {
  isLogin.value = route.name === 'login'
})
</script>

<style scoped>
/* Agregamos un fondo animado */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Estilos para el layout */
.bg-white {
  background-color: white;
}

.rounded-2xl {
  border-radius: 1rem;
}

.shadow-xl {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
