<script setup lang="ts">
import type { Role } from "@/api/types.js"
import { strings } from "@/data/locale/en.js"
import styles from "./index.module.css"

defineProps<{
	modelValue: string[]
	roles: Role[]
}>()

const emit = defineEmits<{
	"update:modelValue": [value: string[]]
}>()

const handleChange = (roleId: string, checked: boolean, currentValue: string[]): void => {
	const nextValue = checked
		? [...currentValue, roleId]
		: currentValue.filter(currentRoleId => currentRoleId !== roleId)
	emit("update:modelValue", nextValue)
}
</script>

<template>
	<fieldset :class="styles.fieldset">
		<legend>{{ strings.users.roles }}</legend>
		<label
			v-for="role in roles"
			:key="role.id"
			:class="styles.option">
			<input
				:checked="modelValue.includes(role.id)"
				type="checkbox"
				@change="handleChange(role.id, ($event.target as HTMLInputElement).checked, modelValue)" />
			<span>{{ role.name }}</span>
		</label>
	</fieldset>
</template>
