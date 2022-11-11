<template>
	<button class="btn">
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name: 'my-button', // для глобальной регистрации компонента
	};
</script>

<style lang="scss">
	.btn {
		/* выровнял кнопку по правому краю */
		align-self: flex-end;
		margin-top: 15px;
		background: rgb(107, 233, 233);
		&:hover {
			cursor: pointer;
			background: rgb(47, 138, 138);
		}
	}
</style>
