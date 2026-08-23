<script setup lang="ts">
import { computed, ref } from "vue";

import type { User } from "@/api/types.js";
import { Button, UserModal, UsersTable } from "@/components/index.js";
import { useRolesQuery, useUsersQuery } from "@/composables/use-access-data.js";
import { strings } from "@/data/locale/en.js";
import { useActorStore } from "@/stores/useActorStore.js";
import styles from "./index.module.css";

const usersQuery = useUsersQuery();
const rolesQuery = useRolesQuery();
const users = computed(() => usersQuery.data.value ?? []);
const roles = computed(() => rolesQuery.data.value ?? []);
const { actorUserId } = useActorStore();
const selectedUser = ref<User>();

const selectUser = (user: User): void => {
	selectedUser.value = user;
};

const closeUserModal = (): void => {
	selectedUser.value = undefined;
};
</script>

<template>
	<div :class="styles.page">
		<header :class="styles.heading">
			<div>
				<span>{{ strings.navigation.users }}</span>
				<h1>{{ strings.users.heading }}</h1>
				<p>{{ strings.users.subheading }}</p>
			</div>
		</header>

		<p v-if="usersQuery.isPending.value || rolesQuery.isPending.value" role="status">
			{{ strings.common.loading }}
		</p>
		<div v-else-if="usersQuery.isError.value || rolesQuery.isError.value" :class="styles.error">
			<p role="alert">{{ strings.users.loadError }}</p>
			<Button variant="secondary" @click="usersQuery.refetch()">
				{{ strings.common.retry }}
			</Button>
		</div>
		<template v-else>
			<UsersTable
				v-if="users.length > 0"
				:selected-user-id="selectedUser?.id ?? ''"
				:users="users"
				@select="selectUser"
			/>
			<p v-else>{{ strings.users.empty }}</p>
			<UserModal
				v-if="selectedUser"
				:key="selectedUser.id"
				:actor-user-id="actorUserId"
				:roles="roles"
				:user="selectedUser"
				@close="closeUserModal"
				@saved="closeUserModal"
			/>
		</template>
	</div>
</template>
