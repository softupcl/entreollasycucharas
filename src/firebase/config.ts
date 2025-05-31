import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDxOWKhn12dJVTzjbk7prfSGjC9g51TdeQ",
  authDomain: "trivia-app-69733.firebaseapp.com",
  projectId: "trivia-app-69733",
  storageBucket: "trivia-app-69733.firebasestorage.app",
  messagingSenderId: "1045478666058",
  appId: "1:1045478666058:web:1f3d47b1eb0c01dc365bb3",
  measurementId: "G-B7GVENP8NQ"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Para usar en desarrollo local, puedes usar:
// import { initializeApp } from 'firebase/app'
// const app = initializeApp({ projectId: 'my-project' })
// export const auth = getAuth(app)
// export const db = getFirestore(app)
