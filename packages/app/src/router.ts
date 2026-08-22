import { createRouter, createWebHistory } from "vue-router";

import { routes } from "./data/routes.js";

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
