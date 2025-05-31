export interface Category {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  category: string
  author: string
  createdAt: string
  updatedAt: string
  excerpt?: string
  imageUrl?: string
  comments?: Comment[]
}

export interface Comment {
  id: number
  author: string
  content: string
  date: string
}
