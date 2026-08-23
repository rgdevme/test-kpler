<script setup lang="ts">
import {
	FlexRender,
	createSortedRowModel,
	rowSortingFeature,
	sortFns,
	tableFeatures,
	useTable
} from "@tanstack/vue-table"
import type { ColumnDef } from "@tanstack/vue-table"
import { computed, h } from "vue"

import type { User } from "@/api/types.js"
import { Pill } from "@/components/index.js"
import { strings } from "@/data/locale/en.js"
import styles from "./index.module.css"

const props = defineProps<{
	selectedUserId: string
	users: User[]
}>()

const emit = defineEmits<{
	select: [user: User]
}>()

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns
})

const columns: ColumnDef<typeof features, User>[] = [
	{
		accessorKey: "displayName",
		header: strings.users.user,
		cell: ({ row }) =>
			h("div", { class: styles.identity }, [
				h("strong", row.original.displayName),
				h("span", row.original.email)
			])
	},
	{
		accessorFn: user => user.roles.map(role => role.name).join(", "),
		header: strings.users.roles,
		id: "roles",
		cell: ({ row }) =>
			h(
				"div",
				{ class: styles.roles },
				row.original.roles.map(role => h(Pill, { key: role.id, name: role.name }))
			)
	}
]

const data = computed(() => props.users)
const table = useTable({ columns, data, features, key: "users-table" })
</script>

<template>
	<div :class="styles.container">
		<table :class="styles.table">
			<thead>
				<tr
					v-for="headerGroup in table.getHeaderGroups()"
					:key="headerGroup.id">
					<th
						v-for="header in headerGroup.headers"
						:key="header.id">
						<button
							v-if="!header.isPlaceholder && header.column.getCanSort()"
							type="button"
							@click="header.column.getToggleSortingHandler()?.($event)">
							<FlexRender :header="header" />
						</button>
						<FlexRender
							v-else-if="!header.isPlaceholder"
							:header="header" />
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row in table.getRowModel().rows"
					:key="row.id"
					:aria-label="strings.users.editUserLabel(row.original.displayName)"
					:aria-selected="selectedUserId === row.original.id"
					tabindex="0"
					@click="emit('select', row.original)"
					@keydown.enter="emit('select', row.original)"
					@keydown.space.prevent="emit('select', row.original)">
					<td
						v-for="cell in row.getAllCells()"
						:key="cell.id">
						<FlexRender :cell="cell" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
