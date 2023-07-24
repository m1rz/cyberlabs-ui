import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const checkAdmin = (to, from, next) => {
	const settings = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Access-Control-Allow-Origin': import.meta.env.VITE_API_ENDPOINT,
'ngrok-skip-browser-warning': true,
			'Authorization': 'Bearer ' + localStorage.getItem('usersession')
		},
	}
	var role
	fetch(import.meta.env.VITE_API_ENDPOINT + '/user/', settings)
		.then(res => res.json())
		.then(res => {
			role = res.role
			console.log(role)
			if (role === undefined || role !== 'admin') {
				console.log('Unauthorized')
				next({name: 'Home'})
			} else {
				next()
			}
		})
}

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import('../views/Login.vue')
		},
		{
			path: '/search',
			component: () => import('../views/Search.vue')
		},
		{
			path: '/machines',
			component: () => import('../views/Machines.vue')
		},
		{
			path: '/templates',
			component: () => import('../views/Templates.vue')
		},
		{
			path: '/courses',
			component: () => import('../views/Courses.vue')
		},
		{
			path: '/settings',
			component: () => import('../views/Settings.vue')
		},
		{
			path: '/logout',
			component: () => import('../views/Logout.vue')
		},
		{
			path: '/admin',
			name: 'AdminHome',
			beforeEnter: checkAdmin,
			component: () => import('../views/AdminHome.vue')
		},
		{
			path: '/accounts',
			name: 'AdminAccounts',
			beforeEnter: checkAdmin,
			component: () => import('../views/AdminAccounts.vue')
		},
		{
			path: '/announce',
			name: 'AdminAnnouncements',
			beforeEnter: checkAdmin,
			component: () => import('../views/AdminAnnouncements.vue')
		},
	],
})

router.beforeEach((to, from) => {
	if (to.name !== 'Login' && localStorage.getItem('usersession') == null) {
		return { name: 'Login' }
	}
})

export default router