import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import PostDetailView from '../views/PostDetail.vue'
import LoginView from '../components/Login.vue'
import RegisterView from '../components/Register.vue'
import DashboardView from '../views/DashboardView.vue'
import AboutView from '../views/AboutView.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import { auth } from '../firebase/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blog',
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
      name: 'dashboard',
      component: DashboardView,
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
