<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface HeroSlide {
  title: string
  description: string
  image: string
}

const slides = ref<HeroSlide[]>([
  {
    title: 'Tecnología del Futuro',
    description: 'Descubre las últimas tendencias en tecnología y desarrollo',
    image: new URL('@/assets/images/hero/comida.jpg', import.meta.url).href,
  },
  {
    title: 'Desarrollo Web Moderno',
    description: 'Aprende las mejores prácticas y herramientas para desarrollo web',
    image: new URL('@/assets/images/hero/postres.jpg', import.meta.url).href,
  },
  {
    title: 'Diseño y UX',
    description: 'Crea experiencias de usuario únicas y memorables',
    image: new URL('@/assets/images/hero/tortas.jpg', import.meta.url).href,
  },
])

const modules = [Navigation, Pagination, Autoplay]
</script>

<template>
  <div class="relative h-[600px] w-full overflow-hidden mb-10">
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="0"
      :navigation="true"
      :pagination="{ clickable: true }"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      class="w-full h-full"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <div class="relative h-full">
          <img :src="slide.image" class="w-full h-full object-cover" :alt="slide.title" />
          <!-- <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div> -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-white text-center px-4">
              <h1 class="text-5xl md:text-7xl font-bold mb-6">
                {{ slide.title }}
              </h1>
              <p class="text-xl md:text-2xl mb-10">
                {{ slide.description }}
              </p>
              <button
                class="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Explorar ahora
              </button>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
