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
import DashboardUsersView from '../views/DashboardUsersView.vue'
import { auth } from '../firebase/config'
import { useAuth } from '../composables/useAuth'

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
        },
        {
          path: 'users',
          name: 'dashboard-users',
          component: DashboardUsersView
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
  const { user, isAdmin, isEditor, loading } = useAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Esperar a que se carguen los roles del usuario
  if (loading.value) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Verificar autenticación para rutas que requieren login
  if (requiresAuth) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        next('/auth/login')
        return
      }

      // Verificar permisos según la ruta
      if (to.path.startsWith('/dashboard')) {
        if (!isAdmin.value) {
          alert('Solo los administradores pueden acceder al panel de control')
          next('/')
          return
        }
      }

      // Aquí podrías agregar más verificaciones de roles según necesites
      // Por ejemplo, para rutas que requieren ser editor
      if (to.path.startsWith('/editor')) {
        if (!isEditor.value) {
          alert('Solo los editores pueden acceder a esta sección')
          next('/')
          return
        }
      }

    } catch (error) {
      console.error('Error en la autenticación:', error)
      next('/auth/login')
      return
    }
  }

  next()
})

export default router
