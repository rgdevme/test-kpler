<script setup lang="ts">
import styles from "./index.module.css";

withDefaults(
	defineProps<{
		disabled?: boolean;
		type?: "button" | "submit";
		variant?: "primary" | "secondary" | "quiet";
	}>(),
	{
		disabled: false,
		type: "button",
		variant: "primary",
	},
);
</script>

<template>
	<button :class="styles.button" :data-variant="variant" :disabled="disabled" :type="type">
		<slot />
	</button>
</template>
