<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import { ref } from "vue";

import type { Role, User } from "@/api/types.js";
import { BaseButton, RoleChecklist } from "@/components/index.js";
import { useReplaceRolesMutation } from "@/composables/use-access-data.js";
import { strings } from "@/data/locale/en.js";
import styles from "./index.module.css";

const props = defineProps<{
	actorUserId: string;
	roles: Role[];
	user: User;
}>();

const feedback = ref("");
const mutation = useReplaceRolesMutation();
const form = useForm({
	defaultValues: {
		roleIds: props.user.roles.map((role) => role.id),
	},
	onSubmit: async ({ value }) => {
		feedback.value = "";
		try {
			await mutation.mutateAsync({
				actorUserId: props.actorUserId,
				input: value,
				userId: props.user.id,
			});
			feedback.value = strings.users.updated;
		} catch {
			feedback.value = strings.users.validation.generic;
		}
	},
});

const isSubmitting = form.useSelector((state) => state.isSubmitting);
</script>

<template>
	<section :class="styles.panel">
		<header>
			<span>{{ strings.users.rolesHeading }}</span>
			<h2>{{ user.displayName }}</h2>
			<p>{{ strings.users.rolesDescription }}</p>
		</header>
		<form :class="styles.form" @submit.prevent.stop="form.handleSubmit()">
			<form.Field v-slot="{ field }" name="roleIds">
				<RoleChecklist
					:model-value="field.state.value"
					:roles="roles"
					@update:model-value="field.handleChange"
				/>
			</form.Field>
			<div :class="styles.footer">
				<p v-if="feedback" role="status">{{ feedback }}</p>
				<BaseButton :disabled="isSubmitting || !actorUserId" type="submit">
					{{ strings.common.save }}
				</BaseButton>
			</div>
		</form>
	</section>
</template>
