import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Register from '@/views/auth/Register.vue'
import Login from '@/views/auth/Login.vue'
import CampaignsList from '@/views/campaigns/List.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guest: true }
    },
    {
      path: '/campaigns',
      meta: { auth: true },
      children: [
        {
          path: '',
          name: 'campaigns',
          component: CampaignsList
        },
        {
          path: 'create',
          name: 'campaign-create',
          component: () => import('@/views/campaigns/Form.vue')
        },
        {
          path: ':id/edit',
          name: 'campaign-edit',
          component: () => import('@/views/campaigns/Edit.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  await authStore.getUser();

  if (authStore.isAuthenticated && to.meta.guest) {
    return next({ name: 'home' })
  }

  if (!authStore.isAuthenticated && to.meta.auth) {
    return next({ name: 'login' })
  }

  next();
})

export default router
