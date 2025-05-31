import { createRouter, createWebHistory } from 'vue-router'
import BlogView from '../views/BlogView.vue'
import PostDetailView from '../views/PostDetail.vue'
import LoginView from '../components/Login.vue'
import RegisterView from '../components/Register.vue'
import AboutView from '../views/AboutView.vue'
import CreatePostView from '../components/CreatePost.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import DashboardPostsView from '../views/DashboardPostsView.vue'
import DashboardPostForm from '../views/DashboardPostForm.vue'
import DashboardCategoriesView from '../views/DashboardCategoriesView.vue'
import DashboardCategoryForm from '../views/DashboardCategoryForm.vue'
import { auth } from '../firebase/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'blog',
      component: BlogView
    },
    {
      path: '/blog/:id',
      name: 'post',
      component: PostDetailView,
      props: true
    },
    {
      path: '/auth',
      component: AuthLayout,
      meta: { layout: 'auth' },
      children: [
        {
          path: 'login',
          name: 'auth-login',
          component: LoginView
        },
        {
          path: 'register',
          name: 'auth-register',
          component: RegisterView
        }
      ]
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-posts',
          component: DashboardPostsView
        },
        {
          path: 'posts/new',
          name: 'dashboard-posts-new',
          component: DashboardPostForm
        },
        {
          path: 'posts/:id/edit',
          name: 'dashboard-posts-edit',
          component: DashboardPostForm,
          props: true
        },
        {
          path: 'categories',
          name: 'dashboard-categories',
          component: DashboardCategoriesView
        },
        {
          path: 'categories/new',
          name: 'dashboard-categories-create',
          component: DashboardCategoryForm
        },
        {
          path: 'categories/:id/edit',
          name: 'dashboard-categories-edit',
          component: DashboardCategoryForm,
          props: true
        }
      ]
    },
    {
      path: '/create-post',
      name: 'create-post',
      component: CreatePostView,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthRoute = to.path.startsWith('/auth')

  // Esperar a que Firebase termine de restaurar la sesión
  await new Promise(resolve => setTimeout(resolve, 1000))

  if (requiresAuth) {
    try {
      const user = auth.currentUser
      if (!user) {
        next('/auth/login')
        return
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error)
      next('/auth/login')
      return
    }
  } else if (isAuthRoute && auth.currentUser) {
    // Si el usuario está autenticado y trata de acceder a /auth/*, redirigir a home
    next('/')
    return
  }
  next()
})

export default router
