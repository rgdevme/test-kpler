<script setup lang="ts">
import {
	FlexRender,
	createSortedRowModel,
	rowSortingFeature,
	sortFns,
	tableFeatures,
	useTable,
} from "@tanstack/vue-table";
import type { ColumnDef } from "@tanstack/vue-table";
import { computed, h } from "vue";

import type { AuditLog } from "@/api/types.js";
import { Pill } from "@/components/index.js";
import { strings } from "@/data/locale/en.js";
import styles from "./index.module.css";

const props = defineProps<{ auditLogs: AuditLog[] }>();

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns,
});

const renderUser = (displayName: string, email: string) =>
	h("div", { class: styles.identity }, [h("strong", displayName), h("span", email)]);

const renderRoles = (roles: AuditLog["beforeRoles"]) =>
	h(
		"div",
		{ class: styles.roles },
		roles.length === 0
			? [h("span", { class: styles.none }, "—")]
			: roles.map((role) => h(Pill, { key: role.id, name: role.name })),
	);

const columns: ColumnDef<typeof features, AuditLog>[] = [
	{
		accessorKey: "createdAt",
		header: strings.audit.time,
		cell: ({ row }) =>
			new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
				new Date(row.original.createdAt),
			),
	},
	{
		accessorKey: "action",
		header: strings.audit.action,
		cell: ({ row }) => strings.audit.actions[row.original.action],
	},
	{
		accessorFn: (auditLog) => auditLog.actor.displayName,
		header: strings.audit.actor,
		id: "actor",
		cell: ({ row }) => renderUser(row.original.actor.displayName, row.original.actor.email),
	},
	{
		accessorFn: (auditLog) => auditLog.target.displayName,
		header: strings.audit.target,
		id: "target",
		cell: ({ row }) => renderUser(row.original.target.displayName, row.original.target.email),
	},
	{
		header: strings.audit.before,
		id: "beforeRoles",
		cell: ({ row }) => renderRoles(row.original.beforeRoles),
	},
	{
		header: strings.audit.after,
		id: "afterRoles",
		cell: ({ row }) => renderRoles(row.original.afterRoles),
	},
];

const data = computed(() => props.auditLogs);
const table = useTable({ columns, data, features, key: "audit-table" });
</script>

<template>
	<div :class="styles.container">
		<table :class="styles.table">
			<thead>
				<tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
					<th v-for="header in headerGroup.headers" :key="header.id">
						<button
							v-if="!header.isPlaceholder && header.column.getCanSort()"
							type="button"
							@click="header.column.getToggleSortingHandler()?.($event)"
						>
							<FlexRender :header="header" />
						</button>
						<FlexRender v-else-if="!header.isPlaceholder" :header="header" />
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in table.getRowModel().rows" :key="row.id">
					<td v-for="cell in row.getAllCells()" :key="cell.id">
						<FlexRender :cell="cell" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
