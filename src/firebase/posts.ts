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

const postsCollection = collection(db, 'posts')

interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  category: string
  categoryName: string
  imageUrl?: string
  excerpt?: string
  comments: Comment[]
}

interface Comment {
  id: number
  author: string
  content: string
  date: string
}

export const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(postsCollection, {
      ...post,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    return docRef.id
  } catch (error) {
    throw error
  }
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    const q = query(postsCollection, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post))

    // Obtener categorías
    const categoriesCollection = collection(db, 'categories')
    const categoriesSnapshot = await getDocs(categoriesCollection)
    const categoriesMap = new Map(
      categoriesSnapshot.docs.map(doc => [doc.id, doc.data().name as string])
    )

    // Actualizar posts con nombres de categorías
    return posts.map(post => ({
      ...post,
      categoryName: categoriesMap.get(post.category) || post.category
    }))
  } catch (error) {
    throw error
  }
}

export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const docRef = doc(postsCollection, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data
      } as Post
    }
    return null
  } catch (error) {
    throw error
  }
}

export const updatePost = async (id: string, post: Partial<Omit<Post, 'id' | 'createdAt'>>) => {
  try {
    const docRef = doc(postsCollection, id)
    await updateDoc(docRef, {
      ...post,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

export const deletePost = async (id: string) => {
  try {
    const docRef = doc(postsCollection, id)
    await deleteDoc(docRef)
  } catch (error) {
    throw error
  }
}

export const addComment = async (postId: string, comment: Comment) => {
  try {
    const postRef = doc(postsCollection, postId)
    const postSnap = await getDoc(postRef)
    
    if (!postSnap.exists()) {
      throw new Error('Post no encontrado')
    }

    const post = postSnap.data()
    const newComments = [...(post.comments || []), comment]
    
    await updateDoc(postRef, {
      comments: newComments,
      updatedAt: new Date().toISOString()
    })
    
    return newComments
  } catch (error) {
    throw error
  }
}

export const usePosts = () => {
  return {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
  }
}
