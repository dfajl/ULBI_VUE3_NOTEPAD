/* создаем собственную переиспользуемую директиву */

export default {
	mounted(el, binding) {
		console.log(el, binding); // <div class="observer"></div>
		// binding - функция, которую я передаю при вызове директивы

		//intersectionObserverAPI

		const options = {
			root: document.querySelector('#scrollArea'), //область видимости браузера
			rootMargin: '0px',
			threshold: 1.0,
		};

		// эта функция будет срабатывать при пересечении блока-маяка
		const callback = (entries, observer) => {
			console.log(entries);
			/* 
					по умолчанию функция срабатывает при пересечении вверх и вниз. а нам надо только вниз.
					чтобы исправить это поведение, надо следить за свойством isIntersecting массива entries
				*/
			if (entries[0].isIntersecting) {
				console.log('crossed');
				binding.value(); // вызываем функцию, которую передали в объект binding
			}
		};

		const observer = new IntersectionObserver(callback, options);
		observer.observe(el); // указываем то, за чем будем следить
	},
	name: 'intersection',
};
