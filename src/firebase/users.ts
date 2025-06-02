import { db } from './config'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import type { User } from 'firebase/auth'

interface UserDoc {
  email: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export const createUserDocument = async (user: User, roles: string[] = ['user']) => {
  try {
    const userDocRef = doc(db, 'users', user.uid)
    await setDoc(userDocRef, {
      email: user.email || '',
      roles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

export const getUserDocument = async (uid: string): Promise<UserDoc | null> => {
  try {
    const userDocRef = doc(db, 'users', uid)
    const docSnap = await getDoc(userDocRef)
    return docSnap.exists() ? docSnap.data() as UserDoc : null
  } catch (error) {
    throw error
  }
}

export const updateUserDocument = async (uid: string, data: Partial<UserDoc>) => {
  try {
    const userDocRef = doc(db, 'users', uid)
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}
