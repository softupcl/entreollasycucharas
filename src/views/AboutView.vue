<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <section class="mb-16">
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Sobre Entre Ollas y Cucharas
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre la pasión por la cocina y el arte culinario en cada receta
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Nuestra Misión</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="md:order-2">
          <p class="text-gray-600 leading-relaxed mb-6">
            En Entre Ollas y Cucharas, nos dedicamos recopilar y compartir recetas de nuestras
            familias deliciosas y fáciles de preparar. Nuestro objetivo es inspirar a las personas a
            explorar nuevas recetas y a disfrutar de la cocina como una forma de expresión creativa.
          </p>
          <p class="text-gray-600 leading-relaxed">
            Creemos que la cocina es más que preparar alimentos; es una forma de conectar con la
            cultura, la familia y los amigos. Cada receta que compartimos está llena de amor y
            dedicación, y esperamos que te inspire a crear momentos memorables en tu cocina.
          </p>
          <p class="text-gray-600 leading-relaxed mt-6">
            Si tienes recetas que quieras compartir con nosotros no dudes en contactarnos y la
            publicaremos dando crédito a la persona que nos lo envió.
          </p>
        </div>
        <div class="md:order-1">
          <img
            src="@/assets/images/about.jpg"
            alt="Receta culinaria"
            class="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Nuestros Valores</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center p-6 bg-gray-50 rounded-lg">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Calidad</h3>
          <p class="text-gray-600">Recetas probadas y aprobadas por nuestros usuarios</p>
        </div>
        <div class="text-center p-6 bg-gray-50 rounded-lg">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Creatividad</h3>
          <p class="text-gray-600">Innovación en cada plato</p>
        </div>
        <div class="text-center p-6 bg-gray-50 rounded-lg">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Tradición</h3>
          <p class="text-gray-600">
            Respeto a las recetas clásicas y a las que nos envían los usuarios
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section>
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Contáctanos</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <p class="text-gray-600 mb-4">
            ¿Tienes alguna sugerencia o quieres compartir tus recetas? ¡No dudes en contactarnos!
          </p>
          <div class="flex items-center gap-2 mb-4">
            <svg
              class="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <a
              href="mailto:entreollasycucharas@gmail.com"
              class="text-blue-600 hover:text-blue-700"
            >
              entreollasycucharas@gmail.com
            </a>
          </div>
        </div>
        <div>
          <div class="flex items-center gap-4">
            <a href="#" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0C8.745 0 8.333.015 7.053.072 5.77.129 5.107.278 4.143.53a4.97 4.97 0 00-2.458 1.112A4.97 4.97 0 00.53 4.142C.278 5.107.129 5.77.072 7.053.015 8.333 0 8.745 0 12c0 3.142.015 3.51.072 4.797.057 1.283.206 2.28.458 3.102.254.822.558 1.55.988 2.188l.015.015c.418.619 1.006 1.112 1.732 1.453.726.34 1.542.517 2.458.578a5.006 5.006 0 002.11-.117 4.962 4.962 0 002.923-.832c.89-.518 1.539-1.12 1.92-1.873.382-.753.574-1.65.574-2.71s-.192-1.957-.575-2.71a4.98 4.98 0 00-1.92-1.873 4.993 4.993 0 00-2.922-.832c-.81-.06-1.634-.18-2.457-.578a4.954 4.954 0 00-1.732-1.453l-.015-.015c-.43-.608-.734-1.28-.987-2.188a4.988 4.988 0 00-1.113-2.458C.015 15.487 0 15.258 0 12c0-3.257.015-3.71-.072-4.797-.057-1.283-.206-2.28-.457-3.102A4.97 4.97 0 00.53 4.142c-.964-.255-1.628-.558-2.458-.988C.129 1.23.072.652.015.143.01.083.008.042.008.021.008 0 .005 0 0 0zm12 18c-1.93 0-3.54-.744-4.89-1.92l-8.53-8.53L8 12l3.536 3.537 8.53-8.532a6.84 6.84 0 011.92-1.065 6.957 6.957 0 011.065 1.92l-8.53 8.53 8.53 8.53z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Estilos adicionales */
</style>
