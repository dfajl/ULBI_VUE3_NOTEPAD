<template>
	<form @submit.prevent>
		<h4>Создание поста</h4>
		<my-input
			type="text"
			placeholder="Название"
			v-model:modelValue="post.title"
		/>
		<!-- v-model="post.title" можно заменить на v-model:value="post.title" -->
		<my-input
			type="text"
			placeholder="Описание"
			v-model:modelValue="post.body"
		/>
		<!-- 
            отличие v-bind от v-model в том, что последняя директива получает запись из инупта и кладет в указанную модель.  эта директива работает только в элементах формы.
        -->
		<my-button @click="createPost">Создать пост</my-button>
	</form>
</template>

<script>
	export default {
		components: {},
		props: {},
		data() {
			return {
				post: {
					title: '',
					body: '',
				},
			};
		},
		methods: {
			createPost() {
				//event.preventDefault(); // можно с помощью модификатора на форме @submit.prevent
				this.post.id = Date.now();
				this.$emit('create', this.post);
				console.log(this.post);
				/* this.post.title = '';
				this.post.body = '';
				данный способ запишет пустые поля в новый созданный инпут. т.е. мы добавляем пустые поля в уже имеющийся объект. другими словами, перезаписываем наш новосозданный пост. чтобы обнулить инпуты из заголовка, нужно обнулять именно саму дату полностью новым значением */

				this.post = {
					title: '',
					body: '',
				};
			},
		},
		watch: {
			// для эксперимента посмотрим, как работает вотчер с НЕ примитивами
			/* post(newValue) {
				console.log(newValue); // в консоль вывелся объект с пустыми полями, т.е вотчер отработал тогда, когда новый объект создался впервые, но на изменения не реагирует 
				// тут нужно юзать глубокое отслеживание объекта. смотри ниже
			}, */
			post: {
				handler(newValue) {
					console.log(newValue);
				},
				deep: true, //включаем глубокое отслеживание
			}, // теперь вотчер следит за каждым изменением объекта
		},
	};
</script>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
	}
</style>
