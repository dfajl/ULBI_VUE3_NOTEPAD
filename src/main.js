import { createApp } from 'vue';
import App from './App.vue';
import components from '@/components/UI/index'; // работает, если не указывать явно index в конце

//console.log(components);

const app = createApp(App);

// это и есть глобальная регистрация компонентов
components.forEach((component) => {
	app.component(component.name, component);
});

app.mount('#app');
