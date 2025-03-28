import { createRouter, createWebHistory } from 'vue-router';
import ComHome from '@/components/ComHome.vue';
import ComProductList from '@/components/ComProductList.vue';
import ComCart from '@/components/ComCart.vue';
import Register from '@/components/Register.vue';
import Login from '@/components/Login.vue';
import ComAbout from '@/components/ComAbout.vue';
import ComContact from '@/components/ComContact.vue';
import ComProfile from '@/components/ComProfile.vue';
import ComProductDetails from '@/components/ComProductDetails.vue';
import Dashboard from '@/components/Dashboard.vue';
import OrderHistory from '@/components/OrderHistory.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: ComHome,
  },
  {
    path: '/products',
    name: 'Products',
    component: ComProductList,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: ComCart,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/about',
    name: 'About',
    component: ComAbout,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ComContact,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ComProfile,
  },
  {
    path: '/products/:id',
    name: 'ComProductDetails',
    component: ComProductDetails,
    props: true,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/order-history',
    name: 'OrderHistory',
    component: OrderHistory,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
