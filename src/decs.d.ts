declare module 'textarea-caret';

declare global {
	import Shepherd from 'shepherd.js';
	interface Window {
		Shepherd: Shepherd;
	}
}