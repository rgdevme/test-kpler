<script setup lang="ts">
import { computed, ref, watch } from "vue";

import type { User } from "@/api/types.js";
import {
	ActorSelector,
	AddUserPanel,
	BaseButton,
	RoleEditor,
	UsersTable,
} from "@/components/index.js";
import { useRolesQuery, useUsersQuery } from "@/composables/use-access-data.js";
import { strings } from "@/data/locale/en.js";
import styles from "./index.module.css";

const usersQuery = useUsersQuery();
const rolesQuery = useRolesQuery();
const users = computed(() => usersQuery.data.value ?? []);
const roles = computed(() => rolesQuery.data.value ?? []);
const actorUserId = ref("");
const selectedUserId = ref("");
const selectedUser = computed(() => users.value.find((user) => user.id === selectedUserId.value));

watch(
	users,
	(nextUsers) => {
		if (!nextUsers.some((user) => user.id === actorUserId.value)) {
			actorUserId.value = nextUsers[0]?.id ?? "";
		}
	},
	{ immediate: true },
);

const selectUser = (user: User): void => {
	selectedUserId.value = user.id;
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
			<BaseButton variant="secondary" @click="usersQuery.refetch()">
				{{ strings.common.retry }}
			</BaseButton>
		</div>
		<template v-else>
			<ActorSelector v-model="actorUserId" :users="users" />
			<div :class="styles.workspace">
				<AddUserPanel :actor-user-id="actorUserId" :roles="roles" @created="selectUser" />
				<RoleEditor
					v-if="selectedUser"
					:key="selectedUser.id"
					:actor-user-id="actorUserId"
					:roles="roles"
					:user="selectedUser"
				/>
				<div v-else :class="styles.placeholder">{{ strings.users.selectUser }}</div>
			</div>
			<UsersTable
				v-if="users.length > 0"
				:selected-user-id="selectedUserId"
				:users="users"
				@select="selectUser"
			/>
			<p v-else>{{ strings.users.empty }}</p>
		</template>
	</div>
</template>
