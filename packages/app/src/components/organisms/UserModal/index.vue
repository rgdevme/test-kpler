<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { computed, ref, useId } from "vue"

import { ApiRequestError } from "@/api/client.js"
import type { Role, User } from "@/api/types.js"
import { Button, Heading, Modal, RoleChecklist, Text } from "@/components/index.js"
import { useCreateUserMutation, useUpdateUserMutation } from "@/composables/useAccessData.js"
import { strings } from "@/data/locale/en.js"
import styles from "./index.module.css"

const props = defineProps<{
	roles: Role[]
	user?: User
}>()

const emit = defineEmits<{
	close: []
	saved: []
}>()

const formId = useId()
const feedback = ref("")
const isEditing = computed(() => props.user !== undefined)
const createMutation = useCreateUserMutation()
const updateMutation = useUpdateUserMutation()
const form = useForm({
	defaultValues: {
		displayName: props.user?.displayName ?? "",
		email: props.user?.email ?? "",
		roleIds: props.user?.roles.map(role => role.id) ?? []
	},
	onSubmit: async ({ value }) => {
		feedback.value = ""
		try {
			if (props.user === undefined) {
				await createMutation.mutateAsync(value)
			} else {
				await updateMutation.mutateAsync({
					input: { displayName: value.displayName, roleIds: value.roleIds },
					userId: props.user.id
				})
			}
			form.reset()
			emit("saved")
		} catch (error) {
			feedback.value =
				error instanceof ApiRequestError && error.status === 409
					? strings.users.duplicateEmail
					: error instanceof ApiRequestError && error.status === 404
						? strings.users.validation.unknownActor
						: strings.users.validation.generic
		}
	}
})

const canSubmit = form.useSelector(state => state.canSubmit)
const isSubmitting = form.useSelector(state => state.isSubmitting)

const readInputValue = (event: Event): string =>
	event.target instanceof HTMLInputElement ? event.target.value : ""
</script>

<template>
	<Modal @close="emit('close')">
		<template #title>
			<Heading>{{ isEditing ? strings.users.editHeading : strings.users.addHeading }}</Heading>
		</template>
		<template #description>
			<Text>{{ isEditing ? strings.users.editDescription : strings.users.addDescription }}</Text>
		</template>
		<template #content>
			<form
				:id="formId"
				:class="styles.form"
				@submit.prevent.stop="form.handleSubmit()">
				<form.Field
					v-slot="{ field }"
					name="displayName"
					:validators="{
						onBlur: ({ value }) =>
							value.trim().length >= 2 ? undefined : strings.users.validation.displayName
					}">
					<label :class="styles.field">
						<span>{{ strings.users.displayName }}</span>
						<input
							:name="field.name"
							:placeholder="strings.users.displayNamePlaceholder"
							:value="field.state.value"
							@blur="field.handleBlur"
							@input="field.handleChange(readInputValue($event))" />
						<small
							v-if="field.state.meta.errors[0]"
							role="alert">
							{{ field.state.meta.errors[0] }}
						</small>
					</label>
				</form.Field>
				<form.Field
					v-slot="{ field }"
					name="email"
					:validators="{
						onBlur: ({ value }) =>
							/^\S+@\S+\.\S+$/.test(value) ? undefined : strings.users.validation.email
					}">
					<label :class="styles.field">
						<span>{{ strings.users.email }}</span>
						<input
							:disabled="isEditing"
							:name="field.name"
							:placeholder="strings.users.emailPlaceholder"
							type="email"
							:value="field.state.value"
							@blur="field.handleBlur"
							@input="field.handleChange(readInputValue($event))" />
						<small
							v-if="field.state.meta.errors[0]"
							role="alert">
							{{ field.state.meta.errors[0] }}
						</small>
					</label>
				</form.Field>
				<form.Field
					v-slot="{ field }"
					name="roleIds">
					<RoleChecklist
						:model-value="field.state.value"
						:roles="roles"
						@update:model-value="field.handleChange" />
				</form.Field>
				<p
					v-if="feedback"
					:class="styles.feedback"
					role="status">
					{{ feedback }}
				</p>
			</form>
		</template>
		<template #actions>
			<Button
				variant="secondary"
				@click="emit('close')"
				>{{ strings.common.cancel }}</Button
			>
			<Button
				:disabled="!canSubmit || isSubmitting"
				:form="formId"
				type="submit">
				{{ isEditing ? strings.common.save : strings.users.create }}
			</Button>
		</template>
	</Modal>
</template>
