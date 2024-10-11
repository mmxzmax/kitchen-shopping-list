import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/profileView.vue';
import RegisterView from '../views/registerView.vue';
import LoginView from '../views/loginView.vue';
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
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
  if (to.meta.requiresAuth) {
    const isAuthorized = await axios
      .get('/api/auth/status')
      .then((response) => response.data as boolean)
      .catch((e) => false);
    if (isAuthorized) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
