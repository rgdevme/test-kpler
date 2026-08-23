import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query"
import { createApp } from "vue"

import App from "./App.vue"
import { router } from "./router.js"
import "./styles/globals.css"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			staleTime: 15_000
		}
	}
})

createApp(App).use(router).use(VueQueryPlugin, { queryClient }).mount("#app")
