import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import {auth} from '../services/firebase.ts';
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        alias: '/city-search',
        name: 'city-search',
        component: () => import('../views/city-search.vue'),
    },
    {
        path: '/login',
        alias: '/login',
        name: 'login',
        component: ()=>import('../views/login.vue')
    },
    {
        path: '/register',
        alias: '/register',
        name: 'register',
        component: ()=>import('../views/register.vue')
    },
    {
      path: '/dashboard',
      alias: '/dashboard',
      name: 'dashboard',
      meta: {requiresAuth: true},
      component: ()=>import('../views/dashboard-trip.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/not-found.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    await auth.authStateReady();

    const currentUser = auth.currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !currentUser) {
        return { name: 'login' };
    }
    if ((to.name === 'login' || to.name === 'register') && currentUser) {
        return { name: 'dashboard' };
    }
});
export default router;