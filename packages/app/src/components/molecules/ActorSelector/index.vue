<script setup lang="ts">
import type { User } from "@/api/types.js";
import { strings } from "@/data/locale/en.js";
import styles from "./index.module.css";

defineProps<{
	modelValue: string;
	users: User[];
}>();

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const handleChange = (event: Event): void => {
	const target = event.target;
	if (target instanceof HTMLSelectElement) {
		emit("update:modelValue", target.value);
	}
};
</script>

<template>
	<label :class="styles.selector">
		<span :class="styles.copy">
			<strong>{{ strings.users.actorLabel }}</strong>
			<small>{{ strings.users.actorDescription }}</small>
		</span>
		<select
			aria-label="Acting user"
			:class="styles.select"
			:value="modelValue"
			@change="handleChange"
		>
			<option disabled value="">{{ strings.users.selectActor }}</option>
			<option v-for="user in users" :key="user.id" :value="user.id">
				{{ user.displayName }}
			</option>
		</select>
	</label>
</template>
