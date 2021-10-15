import  { createRouter, createWebHistory } from 'vue-router';

import NotFound from './components/pages/NotFound';
import UserLogin from './components/pages/auth/UserLogin';
import UserRegister from './components/pages/auth/UserRegister';
import Dashboard from './components/pages/views/Logged/Dashboard';
import Account from './components/pages/views/Logged/Account';
import Month from './components/pages/views/Logged/Month';
import Kid from './components/pages/views/Logged/Kid';
import store from './store/index.js';

const router = createRouter({
    history: createWebHistory(),
    base: '/acollida',
    routes: [
        { path: '/acollida', redirect:'/dashboard' },
        { path: '/dashboard', component: Dashboard, meta:{requiresAuth: true} },
        { path: '/login' , component: UserLogin, meta:{requiresUnauth: true}},
        { path: '/register' , component: UserRegister, meta:{requiresUnauth: true}},
        { path: '/account' , component: Account, meta:{requiresAuth: true}},
        { path: '/month/:name/:year/:monthId' ,name: 'month', component: Month, props:true ,meta:{requiresAuth: true}},
        { path: '/kid/:name/:kidId/:monthId' ,name: 'kid', component: Kid, props:true ,meta:{requiresAuth: true}},
        { path: '/:noFound(.*)' , component: NotFound }
    ]
});

router.beforeEach(function (to, _, next){
    console.log('is authenticated',store.getters.token, );
    if(to.meta.requiresAuth && !store.getters.isAuthenticated){
        next('/login');
    }else if( to.meta.requiresUnauth && store.getters.isAuthenticated){
        next('/dashboard');
    }else{
        next();
    }

});

export default router;