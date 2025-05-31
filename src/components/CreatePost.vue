<template>
  <div class="p-8">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Crear nuevo post</h1>
      <p class="text-gray-600">Comparte tus ideas con el mundo</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Título
        </label>
        <input
          id="title"
          v-model="title"
          type="text"
          required
          :class="[
            'w-full px-4 py-3 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          ]"
          placeholder="Escribe un título atractivo..."
        />
        <p v-if="error" class="mt-1 text-sm text-red-500">
          {{ error }}
        </p>
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <select
          id="category"
          v-model="category"
          required
          :class="[
            'w-full px-4 py-3 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          ]"
        >
          <option value="">Selecciona una categoría</option>
          <option value="tecnologia">Tecnología</option>
          <option value="programacion">Programación</option>
          <option value="ciencia">Ciencia</option>
          <option value="negocios">Negocios</option>
          <option value="arte">Arte</option>
        </select>
        <p v-if="error" class="mt-1 text-sm text-red-500">
          {{ error }}
        </p>
      </div>

      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
          Contenido
        </label>
        <textarea
          id="content"
          v-model="content"
          rows="6"
          required
          :class="[
            'w-full px-4 py-3 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          ]"
          placeholder="Escribe el contenido de tu post..."
        ></textarea>
        <p v-if="error" class="mt-1 text-sm text-red-500">
          {{ error }}
        </p>
      </div>

      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
          Imagen
        </label>
        <div class="flex items-center space-x-4">
          <input
            id="image"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            :class="[
              'w-full px-4 py-3 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            ]"
          />
          <div v-if="previewImage" class="w-24 h-24 rounded-lg overflow-hidden">
            <img :src="previewImage" alt="Preview" class="w-full h-full object-cover">
          </div>
        </div>
        <p v-if="error" class="mt-1 text-sm text-red-500">
          {{ error }}
        </p>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="published"
            v-model="published"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="published" class="ml-2 block text-sm text-gray-700">
            Publicar inmediatamente
          </label>
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          <span v-if="!loading">Crear post</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addDoc, collection } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase/config'
import { useAuth } from '../firebase/auth'

const router = useRouter()
const { user } = useAuth()

const title = ref('')
const category = ref('')
const content = ref('')
const published = ref(false)
const error = ref<string | null>(null)
const loading = ref(false)
const previewImage = ref<string | null>(null)
const imageFile = ref<File | null>(null)

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0]
    previewImage.value = URL.createObjectURL(target.files[0])
  }
}

const uploadImage = async (): Promise<string | null> => {
  if (!imageFile.value) return null

  try {
    const storage = getStorage()
    const imageRef = storageRef(storage, `posts/${Date.now()}-${imageFile.value.name}`)
    await uploadBytes(imageRef, imageFile.value)
    return await getDownloadURL(imageRef)
  } catch (err) {
    console.error('Error al subir imagen:', err)
    return null
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    if (!user.value) {
      throw new Error('No hay usuario autenticado')
    }

    let imageUrl = null
    if (imageFile.value) {
      imageUrl = await uploadImage()
      if (!imageUrl) {
        throw new Error('Error al subir la imagen')
      }
    }

    const postsCollection = collection(db, 'posts')
    const newPost = {
      title: title.value,
      category: category.value,
      content: content.value,
      imageUrl,
      author: user.value.email,
      published: published.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await addDoc(postsCollection, newPost)
    router.push('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al crear el post'
  } finally {
    loading.value = false
  }
}
</script>
