import type { RouteRecordRaw } from "vue-router";

import { strings } from "./locale/en.js";

export const routes: RouteRecordRaw[] = [
	{
		component: () => import("@/components/pages/UsersPage/index.vue"),
		name: "users",
		path: "/users",
		meta: { title: strings.navigation.users },
	},
	{
		component: () => import("@/components/pages/AuditPage/index.vue"),
		name: "audit",
		path: "/audit",
		meta: { title: strings.navigation.audit },
	},
	{
		path: "/",
		redirect: "/users",
	},
];
