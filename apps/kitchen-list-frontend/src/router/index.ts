import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/profileView.vue';
import RegisterView from '../views/registerView.vue';
import LoginView from '../views/loginView.vue';
import axios from 'axios';
import List from '../components/list.vue';
import AdminView from '../views/adminView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '/',
          component: List,
        },
        {
          path: '/profile',
          name: 'profile',
          component: ProfileView,
        },
        {
          path: '/admin',
          name: 'admin',
          component: AdminView,
          meta: {
            isAdmin: true,
          },
        },
      ],
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to?.meta?.requiresAuth) {
    const isAuthorized = await axios
      .get('/api/auth/status')
      .then((response) => response.data as boolean)
      .catch((e) => false);
    if (isAuthorized) {
      if (to?.meta?.isAdmin) {
        const isAdmin = await axios
          .get('/api/auth/is-admin')
          .then((response) => response.data as boolean)
          .catch((e) => false);
          if(isAdmin) {
            next();
          } else {
            next('/');
          }
      } else {
        next();
      }
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
