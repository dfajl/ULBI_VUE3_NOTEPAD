<template>
	<div class="app">
		<h1 style="text-align: center">Страница с постами</h1>
		<div class="btn_wrapper">
			<my-button class="titleBtn" @click="showDialog"
				>Создать пост</my-button
			>
			<my-button @click="fetchPosts">Загрузить посты</my-button>
			<my-select
				v-model="selectedSort"
				:options="sortOptions"
			></my-select>
		</div>

		<my-dialog-window v-model:show="dialogVisible">
			<post-form @create="createPost"></post-form>
		</my-dialog-window>
		<my-input placeholder="Найти пост" v-model="searchQuery" />
		<post-list
			:posts="sortedAndSearchPosts"
			@delete="deletePostItem"
			v-if="!isPostsLoading"
		>
		</post-list>
		<div class="post-item_wrapper" v-else>Загружаю посты с сервера :)</div>

		<div class="observer"></div>
		<!-- это некий блок-маяк, долистав до которого, включится определенная логика -->

		<!-- <div class="page_wrapper">
			<div
				v-for="pageNumber in totalPages"
				:key="pageNumber"
				@click="changePage(pageNumber)"
				class="page"
				:class="{
					currentPage: pageNumber == page,
				}"
			>
				{{ pageNumber }}
			</div>
		</div> убрал данный блок и логику по нему в комментарии. реализуем бесонечную ленту с помощью 
		<div class="observer"></div>
	-->
	</div>
</template>

<script>
	import PostForm from '@/components/PostForm';
	import PostList from '@/components/PostList';
	import axios from 'axios';

	export default {
		components: {
			PostForm,
			PostList,
		},
		data() {
			return {
				posts: [],
				dialogVisible: false,
				isPostsLoading: false,
				selectedSort: '',
				searchQuery: '',
				page: 1, //номер страницы
				limit: 10, //кол-во постов на странице
				totalPages: 0, //кол-во страниц
				sortOptions: [
					{
						value: 'title',
						name: 'По названию',
					},
					{
						value: 'body',
						name: 'По содержанию',
					},
				],
			};
		},
		methods: {
			createPost(post) {
				this.posts.push(post);
				this.dialogVisible = false;
			},
			deletePostItem(post) {
				this.posts = this.posts.filter((item) => item.id != post.id);

				/* let filteredPosts = [];
				this.posts.forEach((item) => {
					if (item.id != post.id) {
						filteredPosts.push(item);
					}
				});
				this.posts = filteredPosts;

				более длинный вариант кода выше

				*/
			},
			showDialog() {
				this.dialogVisible = true;
			},
			fetchPosts() {
				try {
					this.isPostsLoading = true;
					setTimeout(async () => {
						const response = await axios.get(
							'https://jsonplaceholder.typicode.com/posts?',
							{
								//то есть передали параметры в строку с адресом
								// https://jsonplaceholder.typicode.com/posts?_page_limit
								params: {
									_page: this.page,
									_limit: this.limit,
								},
							},
						);
						this.totalPages = Math.ceil(
							// округлили в большую сторону
							response.headers['x-total-count'] / this.limit,
						);
						this.posts = response.data;
						this.isPostsLoading = false;
					}, 2000);
				} catch (error) {
					alert(`Ошибка: ${error}`);
				}
				/* finally {
					this.isPostsLoading = false; // по-хорошему, надо использовать блок finally
				} */
			},
			//changePage(number) {
			//this.page = number; реализую параллельно бесконечную ленту
			//},
			loadInfinityPosts() {
				// реализуем бесконечную ленту
				try {
					this.isPostsLoading = true;
					setTimeout(async () => {
						const response = await axios.get(
							'https://jsonplaceholder.typicode.com/posts?',
							{
								//то есть передали параметры в строку с адресом
								// https://jsonplaceholder.typicode.com/posts?_page_limit
								params: {
									_page: this.page,
									_limit: this.limit,
								},
							},
						);
						this.totalPages = Math.ceil(
							// округлили в большую сторону
							response.headers['x-total-count'] / this.limit,
						);

						this.posts = [...this.posts, ...response.data];
						//мы при прокрутке страницы складываем все подгруженные посты в единый массив

						this.isPostsLoading = false;
					}, 2000);
				} catch (error) {
					alert(`Ошибка: ${error}`);
				}
				/* finally {
					this.isPostsLoading = false; // по-хорошему, надо использовать блок finally
				} */
			},
		},
		watch: {
			//page() { реализую параллельно бесконечную ленту
			//this.fetchPosts();
			/* 
					следим за сменой номера страницы из метода changePage. при изменении модели page вызываем 
					подгрузку новых постов
				*/
			//},
		},
		mounted() {
			this.fetchPosts();
		},

		// ниже будет реализована сортировка массива posts через watch и computed для наглядности
		/* watch: {
			selectedSort(newValue) {
				// название вотчера должно совпадать с названием изменяемой модели
				// следим за примитивом, поэтому не надо делать глубокое слежение
				// newValue - модель = selectedSort
				this.posts.sort((post1, post2) => {
					return post1[newValue].localeCompare(post2[newValue]);
				});
			},
		}, */
		computed: {
			sortedPosts() {
				console.log('computed сработал в sortedPosts');
				return [...this.posts].sort((post1, post2) => {
					return post1[this.selectedSort]?.localeCompare(
						post2[this.selectedSort],
					);
				});

				/* почему важно сделать проверку на существование свойства: потому что у нас вначале идет сортировка по пустой строке(selectedSort: ''). без ? левая часть будет is nоt defined и будет ошибка, потому что метод localeCompare обращается к is nоt defined. у post2 проверка не нужна, т.к. к нему нет метода изначально
				 */
			},
			sortedAndSearchPosts() {
				console.log('computed сработал в sortedAndSearchPosts');
				console.log(this.sortedPosts); // [] при загрузке страницы

				return this.sortedPosts.filter((post) =>
					post.title
						.toLowerCase()
						.includes(this.searchQuery.toLowerCase()),
				);
			},

			/* 
				работа вычисляемых свойств sortedPosts() и sortedAndSearchPosts(): при первом запуске страницы   sortedAndSearchPosts() веренет пустой массив [], потому что посты еще не загружены из-за тайм-аута в 4 секунды, а в this.posts лежит пустой массив. Фильтрация по пустому массиву вернет пустой массив. Потом посты подгружаются. Цепочка повторяется: вызывается sortedAndSearchPosts(), потому что меняется привязка в виде this.posts. sortedAndSearchPosts() в свою очередь вызывает sortedPosts(), который клонирует массив this.posts, но сортировку не делает, т.к. post1[this.selectedSort]?.localeCompare() не проходит из-за this.selectedSort == "".
				
				
				
				но свойство отрабатывает: ведь был изменен массив this.posts(подвергся сортировке), за которым "следит" sortedPosts(). 
				Потом сразу же запускается sortedAndSearchPosts(), потому что сработало св-во  sortedPosts(), за которым и следит sortedAndSearchPosts(). Отфильтрованный пустой массив вернется данным свойством.

				потом проходит таймаут и посты грузятся. следовательно, массив this.posts изменяется, срабатывает sortedPosts(), но сортировка не запускается, потому что post1[this.selectedSort]?.localeCompare() не срабатывает,  т.к. this.selectedSort изначально равен пустой строке. ну и sortedAndSearchPosts(), соответственно, не вызывается, потому что this.posts
			*/
		},
	};
</script>

<style lang="scss">
	body {
		font-family: 'Montserrat', sans-serif;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.app {
		padding: 20px;
	}

	.btn_wrapper {
		margin-top: 50px;
		display: flex;
		justify-content: space-around;
	}

	.post-item_wrapper {
		margin-top: 50px;
	}

	.page_wrapper {
		display: flex;
		margin-top: 50px;
		justify-content: center;
		.page {
			font-size: 20px;
			border: 1px solid black;
			margin-right: 10px;
			padding: 5px;
			cursor: pointer;
		}
	}

	.currentPage {
		background: rgba(46, 139, 86, 0.684);
	}

	.observer {
		height: 10px;
		background-color: aquamarine;
	}
</style>
