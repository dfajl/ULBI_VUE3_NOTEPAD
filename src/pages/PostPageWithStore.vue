<template>
	<div>
		<h1 style="text-align: center">Страница с постами</h1>
		<div class="btn_wrapper">
			<my-button class="titleBtn" @click="showDialog">
				Создать пост
			</my-button>

			<my-button @click="fetchPosts">Загрузить посты</my-button>
			<my-select
				:model-value="selectedSort"
				@update:model-value="setSelectedSort"
				:options="sortOptions"
			>
			</my-select>
		</div>

		<my-dialog-window v-model:show="dialogVisible">
			<post-form @create="createPost"></post-form>
		</my-dialog-window>
		<my-input
			placeholder="Найти пост"
			:model-value="searchQuery"
			@update:model-value="setSearchQuery"
			v-focus
		/>
		<post-list
			:posts="sortedAndSearchPosts"
			@delete="deletePostItem"
			v-if="!isPostsLoading"
		>
		</post-list>
		<div class="post-item_wrapper" v-else>Загружаю посты с сервера :)</div>

		<div class="observer" v-intersection="loadInfinityPosts"></div>
		<!-- это некий блок-маяк, долистав до которого, включится определенная логика 
		цвет ему задавать не надо. но я сделаю просто для наглядности-->

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
	import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

	export default {
		components: {
			PostForm,
			PostList,
		},
		data() {
			return {
				dialogVisible: false,
			};
		},
		methods: {
			//вызываем здесь через spread-оператор mapActions и mapMutations
			...mapMutations({
				setPage: 'post/setPage',
				setSearchQuery: 'post/setSearchQuery',
				setSelectedSort: 'post/setSelectedSort',
			}),
			...mapActions({
				fetchPosts: 'post/fetchPosts',
				loadInfinityPosts: 'post/loadInfinityPosts',
			}),

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

			//intersectionObserverAPI
			//console.log(this.$refs.observer);
			//комменчу тут код, связанный с intersectionObserverAPI, потому что он будет вынесен в отдельную директиву
			//const options = {
			//root: document.querySelector('#scrollArea'), //область видимости браузера
			//	rootMargin: '0px',
			//	threshold: 1.0,
			//};
			// эта функция будет срабатывать при пересечении блока-маяка
			//const callback = (entries, observer) => {
			//console.log(entries);
			/* 
					по умолчанию функция срабатывает при пересечении вверх и вниз. а нам надо только вниз.
					чтобы исправить это поведение, надо следить за свойством isIntersecting массива entries
				*/
			//	if (entries[0].isIntersecting) {
			//		console.log('crossed');
			//		this.loadInfinityPosts();
			//	}
			//};
			//const observer = new IntersectionObserver(callback, options);
			//observer.observe(this.$refs.observer); // указываем то, за чем будем следить
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
			...mapState({
				posts: (state) => state.post.posts, // обращаемся к стейту, потом к модулю, потом к самому полю
				isPostsLoading: (state) => state.post.isPostsLoading,
				selectedSort: (state) => state.post.selectedSort,
				searchQuery: (state) => state.post.searchQuery,
				page: (state) => state.post.page, //номер страницы
				limit: (state) => state.post.limit, //кол-во постов на странице
				totalPages: (state) => state.post.totalPages, //кол-во страниц
				sortOptions: (state) => state.post.sortOptions,
			}),
			...mapGetters({
				sortedPosts: 'post/sortedPosts',
				sortedAndSearchPosts: 'post/sortedAndSearchPosts',
			}),
		},
	};
</script>

<style lang="scss">
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
		//background-color: aquamarine;
	}
</style>
