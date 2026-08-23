<script setup lang="ts">
import { computed, ref, watch } from "vue"

import { UserModal, UserSelector } from "@/components/index.js"
import { useRolesQuery, useUsersQuery } from "@/composables/use-access-data.js"
import { strings } from "@/data/locale/en.js"
import { useActorStore } from "@/stores/useActorStore.js"
import styles from "./index.module.css"

const usersQuery = useUsersQuery()
const rolesQuery = useRolesQuery()
const users = computed(() => usersQuery.data.value ?? [])
const roles = computed(() => rolesQuery.data.value ?? [])
const { actorUserId, setActorUserId } = useActorStore()
const isAddUserOpen = ref(false)

watch(
	users,
	nextUsers => {
		if (!nextUsers.some(user => user.id === actorUserId.value)) {
			setActorUserId(nextUsers[0]?.id ?? "")
		}
	},
	{ immediate: true }
)

const openAddUserModal = (): void => {
	isAddUserOpen.value = true
}

const closeAddUserModal = (): void => {
	isAddUserOpen.value = false
}

const handleUserCreated = (): void => {
	closeAddUserModal()
}
</script>

<template>
	<header :class="styles.header">
		<RouterLink
			:class="styles.brand"
			to="/users">
			<span :class="styles.mark">A</span>
			<span>
				<small>{{ strings.app.eyebrow }}</small>
				<strong>{{ strings.app.name }}</strong>
			</span>
		</RouterLink>
		<div :class="styles.navigation">
			<nav aria-label="Primary navigation">
				<RouterLink to="/users">{{ strings.navigation.users }}</RouterLink>
				<RouterLink to="/audit">{{ strings.navigation.audit }}</RouterLink>
			</nav>
		</div>
		<div :class="styles.menu">
			<UserSelector
				:disabled="
					usersQuery.isPending.value
					|| rolesQuery.isPending.value
					|| usersQuery.isError.value
					|| rolesQuery.isError.value
				"
				:model-value="actorUserId"
				:users="users"
				@add="openAddUserModal"
				@update:model-value="setActorUserId" />
		</div>
		<UserModal
			v-if="isAddUserOpen"
			:roles="roles"
			@close="closeAddUserModal"
			@saved="handleUserCreated" />
	</header>
</template>
