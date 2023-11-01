import uView from './uni_modules/vk-uview-ui';
import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import piniaPersist from 'pinia-plugin-persist-uni'
import App from "./App.vue";
export function createApp() {
	const pinia = Pinia.createPinia()
	pinia.use(piniaPersist)
	const app = createSSRApp(App);
	app.use(pinia);
	app.use(uView);
	return {
		app,
		Pinia
	};
}