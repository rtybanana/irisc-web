declare module 'textarea-caret';
declare module 'v-click-outside';

declare global {
	import Shepherd from 'shepherd.js';
	interface Window {
		Shepherd: Shepherd;
	}
}

// declare module 'vue-shepherd';

// declare module 'vue/types/vue' {
// 	import Shepherd from 'shepherd.js';

//   // this.$myInjectedFunction inside Vue components
//   interface Vue {
//     $shepherd: (...args: any[]) => Shepherd
//   }
// }