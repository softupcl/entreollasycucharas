<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosts } from '../firebase/posts'
import { useCategories } from '../firebase/categories'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import Editor from '@tinymce/tinymce-vue'

interface Category {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
}

interface Comment {
  id: number
  author: string
  content: string
  date: string
}

const route = useRoute()
const router = useRouter()
const { createPost, updatePost, getPostById } = usePosts()
const { getCategories, getCategoryById } = useCategories()

interface FormData {
  title: string
  content: string
  category: string
  categoryName: string
  imageUrl?: string
  excerpt?: string
  imageFile?: File
  author: string
  comments: Comment[]
}

const formData = ref<FormData>({
  title: '',
  content: '',
  category: '',
  categoryName: '',
  imageUrl: '',
  excerpt: '',
  imageFile: undefined,
  author: 'admin', // You might want to get this from user auth
  comments: [] as Comment[],
})

const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const isEditing = computed(() => route.params.id !== undefined)

const loadPost = async () => {
  if (!isEditing.value) return

  try {
    loading.value = true
    error.value = null
    const post = await getPostById(route.params.id as string)
    if (post) {
      formData.value = {
        title: post.title,
        content: post.content,
        category: post.category,
        categoryName: post.categoryName || '',
        imageUrl: post.imageUrl || '',
        excerpt: post.excerpt || '',
        imageFile: undefined,
        comments: post.comments || [],
        author: post.author || 'admin',
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar el post'
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = await getCategories()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar las categorías'
  }
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    formData.value.imageFile = file
    // Previsualizar la imagen
    formData.value.imageUrl = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  try {
    if (
      !formData.value.title.trim() ||
      !formData.value.content.trim() ||
      !formData.value.category
    ) {
      error.value = 'Por favor, completa todos los campos requeridos'
      return
    }

    loading.value = true
    error.value = null

    // Subir la imagen si hay una
    if (formData.value.imageFile) {
      const storage = getStorage()
      const fileRef = storageRef(storage, `posts/${formData.value.imageFile.name}`)
      await uploadBytes(fileRef, formData.value.imageFile)
      formData.value.imageUrl = await getDownloadURL(fileRef)
    }

    if (isEditing.value) {
      await updatePost(route.params.id as string, {
        title: formData.value.title,
        content: formData.value.content,
        category: formData.value.category,
        imageUrl: formData.value.imageUrl,
        excerpt: formData.value.excerpt,
        comments: formData.value.comments,
      })
    } else {
      await createPost({
        title: formData.value.title,
        content: formData.value.content,
        category: formData.value.category,
        imageUrl: formData.value.imageUrl,
        excerpt: formData.value.excerpt,
        author: formData.value.author,
        comments: formData.value.comments,
      })
    }
    router.push({ name: 'dashboard-posts' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al guardar el post'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([loadCategories(), loadPost()])
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar los datos'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        {{ route.params.id ? 'Editar Post' : 'Crear Post' }}
      </h1>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <svg
            class="animate-spin h-12 w-12 text-gray-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <svg
            class="w-12 h-12 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p class="mt-2 text-red-600">{{ error }}</p>
        </div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-700">Contenido</label>
          <Editor
            api-key="90mtwpzyyx7qzjjcajz6v4az72cnsln0p1p59oj3mzo0jflz"
            id="content"
            v-model="formData.content"
            :init="{
              height: 500,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
            }"
          />
        </div>

        <div>
          <label for="excerpt" class="block text-sm font-medium text-gray-700">Extracto</label>
          <textarea
            id="excerpt"
            v-model="formData.excerpt"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            id="category"
            v-model="formData.category"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="image" class="block text-sm font-medium text-gray-700">Imagen</label>
          <div
            class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
          >
            <div class="text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="mt-1 flex text-sm text-gray-600">
                <label
                  for="image"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Subir una imagen</span>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    class="sr-only"
                    accept="image/*"
                    @change="handleImageUpload"
                  />
                </label>
                <p class="pl-1">o arrastra y suelta</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
            </div>
          </div>
          <div v-if="formData.imageUrl" class="mt-4">
            <img :src="formData.imageUrl" class="w-full h-48 object-cover rounded-lg" />
          </div>
        </div>

        <div>
          <label for="author" class="block text-sm font-medium text-gray-700">Autor</label>
          <input
            type="text"
            id="author"
            v-model="formData.author"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :class="{ 'opacity-50 cursor-not-allowed': loading }"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ loading ? 'Guardando...' : route.params.id ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
