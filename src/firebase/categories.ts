import { db } from './config'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc
} from 'firebase/firestore'

const categoriesCollection = collection(db, 'categories')

interface Category {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
}

// Función para validar el color de la categoría
export const validateColor = (color: string): boolean => {
  const validColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-gray-500'
  ]
  return validColors.includes(color)
}

export const useCategories = () => {
  const createCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(categoriesCollection, {
        ...category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return docRef.id
    } catch (error) {
      throw error
    }
  }

  const getCategories = async (): Promise<Category[]> => {
    try {
      const q = query(categoriesCollection, orderBy('name'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<Category, 'id'>
        return {
          id: doc.id,
          name: data.name,
          color: data.color,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        }
      })
    } catch (error) {
      throw error
    }
  }

  const getCategoryById = async (id: string): Promise<Category | null> => {
    try {
      const docRef = doc(categoriesCollection, id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          name: data.name as string,
          color: data.color as string,
          createdAt: data.createdAt as string,
          updatedAt: data.updatedAt as string
        }
      }
      return null
    } catch (error) {
      throw error
    }
  }

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const categoryRef = doc(categoriesCollection, id)
      await updateDoc(categoryRef, {
        ...category,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const categoryRef = doc(categoriesCollection, id)
      await deleteDoc(categoryRef)
    } catch (error) {
      throw error
    }
  }

  return {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
  }
}
