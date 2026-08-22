<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import { ref } from "vue";

import { ApiRequestError } from "@/api/client.js";
import type { Role, User } from "@/api/types.js";
import { BaseButton, RoleChecklist } from "@/components/index.js";
import { useCreateUserMutation } from "@/composables/use-access-data.js";
import { strings } from "@/data/locale/en.js";
import styles from "./index.module.css";

const props = defineProps<{
	actorUserId: string;
	roles: Role[];
}>();

const emit = defineEmits<{
	created: [user: User];
}>();

const feedback = ref("");
const mutation = useCreateUserMutation();
const form = useForm({
	defaultValues: {
		displayName: "",
		email: "",
		roleIds: [] as string[],
	},
	onSubmit: async ({ value }) => {
		feedback.value = "";
		try {
			const user = await mutation.mutateAsync({ actorUserId: props.actorUserId, input: value });
			feedback.value = strings.users.created;
			form.reset();
			emit("created", user);
		} catch (error) {
			feedback.value =
				error instanceof ApiRequestError && error.status === 409
					? strings.users.duplicateEmail
					: error instanceof ApiRequestError && error.status === 404
						? strings.users.validation.unknownActor
						: strings.users.validation.generic;
		}
	},
});

const canSubmit = form.useSelector((state) => state.canSubmit);
const isSubmitting = form.useSelector((state) => state.isSubmitting);

const readInputValue = (event: Event): string =>
	event.target instanceof HTMLInputElement ? event.target.value : "";
</script>

<template>
	<section :class="styles.panel">
		<header>
			<h2>{{ strings.users.addHeading }}</h2>
			<p>{{ strings.users.addDescription }}</p>
		</header>
		<form :class="styles.form" @submit.prevent.stop="form.handleSubmit()">
			<form.Field
				v-slot="{ field }"
				name="displayName"
				:validators="{
					onBlur: ({ value }) =>
						value.trim().length >= 2 ? undefined : strings.users.validation.displayName,
				}"
			>
				<label :class="styles.field">
					<span>{{ strings.users.displayName }}</span>
					<input
						:name="field.name"
						:placeholder="strings.users.displayNamePlaceholder"
						:value="field.state.value"
						@blur="field.handleBlur"
						@input="field.handleChange(readInputValue($event))"
					/>
					<small v-if="field.state.meta.errors[0]" role="alert">
						{{ field.state.meta.errors[0] }}
					</small>
				</label>
			</form.Field>
			<form.Field
				v-slot="{ field }"
				name="email"
				:validators="{
					onBlur: ({ value }) =>
						/^\S+@\S+\.\S+$/.test(value) ? undefined : strings.users.validation.email,
				}"
			>
				<label :class="styles.field">
					<span>{{ strings.users.email }}</span>
					<input
						:name="field.name"
						:placeholder="strings.users.emailPlaceholder"
						type="email"
						:value="field.state.value"
						@blur="field.handleBlur"
						@input="field.handleChange(readInputValue($event))"
					/>
					<small v-if="field.state.meta.errors[0]" role="alert">
						{{ field.state.meta.errors[0] }}
					</small>
				</label>
			</form.Field>
			<form.Field v-slot="{ field }" name="roleIds">
				<RoleChecklist
					:model-value="field.state.value"
					:roles="roles"
					@update:model-value="field.handleChange"
				/>
			</form.Field>
			<div :class="styles.footer">
				<p v-if="feedback" role="status">{{ feedback }}</p>
				<BaseButton :disabled="!canSubmit || isSubmitting || !actorUserId" type="submit">
					{{ strings.users.create }}
				</BaseButton>
			</div>
		</form>
	</section>
</template>
