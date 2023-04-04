import Main from '@/pages/Main';
import PostPage from '@/pages/PostPage';
import About from '@/pages/About';
import PostIdPage from '@/pages/PostIdPage';
import PostPageWithStore from '@/pages/PostPageWithStore';
import { createRouter, createWebHistory } from 'vue-router';

//маршруты
const routes = [
	{
		path: '/',
		component: Main, //компонент, который будет отрисован по данному маршруту
	},
	{
		path: '/posts',
		component: PostPage, //компонент, который будет отрисован по данному маршруту
	},
	{
		path: '/about',
		component: About, //компонент, который будет отрисован по данному маршруту
	},
	{
		path: '/posts/:id', //динамическая навигация. :id - динамический параметр прехода
		component: PostIdPage, //компонент, который будет отрисован по данному маршруту
	},
	{
		path: '/postPageWithStore', //динамическая навигация
		component: PostPageWithStore, //компонент, который будет отрисован по данному маршруту
	},
];

//создаем роутер
const router = createRouter({
	routes: routes,
	history: createWebHistory(process.env.BASE_URL),
});

export default router;
