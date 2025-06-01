<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
      <button 
        @click="openCreateUserModal"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Nuevo Usuario
      </button>
    </div>

    <!-- Tabla de usuarios -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.uid">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-for="role in user.roles" :key="role" 
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getRoleColor(role)
                ]"
              >
                {{ role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button 
                @click="openEditUserModal(user)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Editar
              </button>
              <button 
                @click="deleteUser(user.uid)"
                class="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar usuario -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
          {{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h3>
        <form @submit.prevent="saveUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                v-model="currentUser.email"
                :disabled="editingUser"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Roles</label>
              <div class="mt-2 space-y-2">
                <label v-for="role in availableRoles" :key="role" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="role"
                    v-model="currentUser.roles"
                    class="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ role }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="mt-5 flex justify-end space-x-3">
            <button 
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {{ editingUser ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { db, auth } from '../firebase/config'
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'

// Estados
const users = ref<any[]>([])
const showModal = ref(false)
const editingUser = ref(false)
const currentUser = ref({
  email: '',
  roles: []
})
const availableRoles = ['admin', 'editor', 'moderator']

// Funciones auxiliares
const getRoleColor = (role: string) => {
  const colors = {
    admin: 'bg-indigo-100 text-indigo-800',
    editor: 'bg-green-100 text-green-800',
    moderator: 'bg-yellow-100 text-yellow-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

// Obtener todos los usuarios
const fetchUsers = async () => {
  try {
    const q = query(collection(db, 'users'))
    const querySnapshot = await getDocs(q)
    users.value = querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  }
}

// Crear nuevo usuario
const saveUser = async () => {
  try {
    const userDocRef = doc(db, 'users', editingUser.value ? currentUser.value.uid : auth.currentUser?.uid)
    await setDoc(userDocRef, {
      email: currentUser.value.email,
      roles: currentUser.value.roles
    })
    closeModal()
    await fetchUsers()
  } catch (error) {
    console.error('Error al guardar usuario:', error)
  }
}

// Eliminar usuario
const deleteUser = async (uid: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return

  try {
    await deleteDoc(doc(db, 'users', uid))
    await fetchUsers()
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
  }
}

// Abrir modal de crear usuario
const openCreateUserModal = () => {
  currentUser.value = {
    email: '',
    roles: []
  }
  editingUser.value = false
  showModal.value = true
}

// Abrir modal de editar usuario
const openEditUserModal = (user: any) => {
  currentUser.value = { ...user }
  editingUser.value = true
  showModal.value = true
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  editingUser.value = false
}

// Cargar usuarios al montar el componente
fetchUsers()
</script>
