import { auth } from './config'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { ref, computed } from 'vue'

// Configurar persistencia de sesión
// Usamos browserLocalPersistence para mantener la sesión entre recargas
setPersistence(auth, browserLocalPersistence)

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    throw error
  }
}

// Estado de autenticación
const currentUser = ref<User | null>(null)

// Observar cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

// Exportar el estado de autenticación
export const useAuth = () => {
  return {
    user: currentUser,
    login,
    register,
    logout,
    isAuthenticated: computed(() => !!currentUser.value)
  }
}
