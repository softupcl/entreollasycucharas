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
    title: 'Comida Chilena',
    description: 'Descubre recetas de la cocina chilena',
    image: new URL('@/assets/images/hero/comida.jpg', import.meta.url).href,
  },
  {
    title: 'Postres',
    description: 'Las mejores recetas de postres para disfrutar',
    image: new URL('@/assets/images/hero/postres.jpg', import.meta.url).href,
  },
  {
    title: 'Tortas y pasteles',
    description: 'Compartimos las mejores recetas de tortas y pasteles para disfrutar',
    image: new URL('@/assets/images/hero/tortas.jpg', import.meta.url).href,
  },
])

const modules = [Navigation, Pagination, Autoplay]
</script>

<template>
  <div class="relative h-[200px] w-full overflow-hidden mb-10 md:h-[600px]">
    <!-- Overlay sutil para mejorar visibilidad en móvil -->
    <div class="absolute inset-0 bg-gray-50 bg-opacity-10 md:bg-opacity-0"></div>
    <div class="relative h-[200px] md:h-[600px]">
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
          <div class="relative w-full">
            <img :src="slide.image" class="w-full h-full object-cover" :alt="slide.title" />
            <div class="absolute inset-0 bg-transparent bg-opacity-95 backdrop-blur-sm"></div>

            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-gray-50 text-center px-4">
                <h1 class="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
                  {{ slide.title }}
                </h1>
                <p class="text-lg md:text-xl lg:text-2xl mb-10">
                  {{ slide.description }}
                </p>
                <button
                  class="bg-gray-50 text-blue-600 hidden md:block md:items-center md:justify-center px-6 py-3 rounded-full font-semibold text-base md:text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
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

@media (max-width: 768px) {
  .swiper-slide {
    height: 100%;
  }
}
</style>
