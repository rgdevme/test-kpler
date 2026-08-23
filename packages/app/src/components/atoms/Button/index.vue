<script setup lang="ts">
import styles from "./index.module.css";

withDefaults(
	defineProps<{
		disabled?: boolean;
		form?: string | undefined;
		type?: "button" | "submit";
		variant?: "icon" | "primary" | "secondary" | "quiet";
	}>(),
	{
		disabled: false,
		form: undefined,
		type: "button",
		variant: "primary",
	},
);
</script>

<template>
	<button
		:class="styles.button"
		:data-variant="variant"
		:disabled="disabled"
		:form="form"
		:type="type"
	>
		<slot />
	</button>
</template>
