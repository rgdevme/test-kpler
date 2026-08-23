import UsersPage from "@/components/pages/UsersPage/index.vue";
import AuditPage from "@/components/pages/AuditPage/index.vue";
import type { RouteRecordRaw } from "vue-router";

import { strings } from "./locale/en.js";

export const routes: RouteRecordRaw[] = [
	{
		component: UsersPage,
		name: "users",
		path: "/users",
		meta: { title: strings.navigation.users },
	},
	{
		component: AuditPage,
		name: "audit",
		path: "/audit",
		meta: { title: strings.navigation.audit },
	},
	{
		path: "/",
		redirect: "/users",
	},
];
