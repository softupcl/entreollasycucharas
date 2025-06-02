import { ref, computed } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import { useAuth as useFirebaseAuth } from '../firebase/auth'
import type { User } from 'firebase/auth'

export function useAuth() {
  const { user } = useFirebaseAuth()
  const userRoles = ref<string[]>([])
  const loading = ref(true)

  // Verificar si el usuario es administrador
  const isAdmin = computed(() => {
    return userRoles.value.includes('admin')
  })

  // Verificar si el usuario es editor
  const isEditor = computed(() => {
    return userRoles.value.includes('editor')
  })

  // Verificar si el usuario es moderador
  const isModerator = computed(() => {
    return userRoles.value.includes('moderator')
  })

  // Obtener roles del usuario desde Firestore
  const fetchUserRoles = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        const userData = userDoc.data()
        userRoles.value = userData.roles || []
      } else {
        // Si no existe el documento, crear uno con roles por defecto
        await setDoc(userDocRef, {
          roles: ['user'] // Rol por defecto
        })
        userRoles.value = ['user']
      }
    } catch (error) {
      console.error('Error al obtener roles del usuario:', error)
      userRoles.value = ['user'] // En caso de error, asumir rol de usuario normal
    } finally {
      loading.value = false
    }
  }

  // Inicializar el usuario cuando cambia
  auth.onAuthStateChanged(async (authUser: User | null) => {
    user.value = authUser
    if (authUser) {
      await fetchUserRoles(authUser.uid)
    } else {
      userRoles.value = []
    }
  })

  return {
    user,
    isAdmin,
    isEditor,
    isModerator,
    loading
  }
}
