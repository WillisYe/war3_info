import uView from './uni_modules/vk-uview-ui';
import { createSSRApp } from 'vue';
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	app.use(uView);
	return {
		app,
	};
}