declare module 'textarea-caret';
declare module 'v-click-outside';

declare global {
	import Shepherd from 'shepherd.js';
	interface Window {
		Shepherd: Shepherd;
	}
}
