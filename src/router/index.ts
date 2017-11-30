import Vue from 'vue'
import Router from 'vue-router'
import FrontPage from '@/components/FrontPage.vue'


Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'FrontPage',
		component: FrontPage
	}]
})