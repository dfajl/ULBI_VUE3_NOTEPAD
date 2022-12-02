import { createApp } from 'vue';
import App from './App.vue';
import components from '@/components/UI/exportComponents'; // импортируем пользовательские компоненты
import router from '@/router/router';
import store from '@/vuex/store';
import directives from '@/directives/exportDirectives'; // импортируем пользовательские директивы
console.log(components);

const app = createApp(App);

// это и есть глобальная регистрация компонентов
components.forEach((component) => {
	app.component(component.name, component);
});

// это и есть глобальная регистрация директивы/ 'intersection' - is a string with an our own directive's name
directives.forEach((directive) => {
	app.directive(directive.name, directive);
});

app.use(router).use(store).mount('#app');
