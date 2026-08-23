<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from "vue"

import styles from "./index.module.css"

const emit = defineEmits<{ close: [] }>()
const titleId = useId()
const descriptionId = useId()
const dialog = ref<HTMLElement | null>(null)

const handleKeydown = (event: KeyboardEvent): void => {
	if (event.key === "Escape") {
		emit("close")
	}
}

onMounted(() => {
	document.addEventListener("keydown", handleKeydown)
	dialog.value?.focus()
})

onBeforeUnmount(() => {
	document.removeEventListener("keydown", handleKeydown)
})
</script>

<template>
	<div
		:class="styles.backdrop"
		@click.self="emit('close')">
		<section
			ref="dialog"
			:aria-describedby="descriptionId"
			:aria-labelledby="titleId"
			:class="styles.modal"
			aria-modal="true"
			role="dialog"
			tabindex="-1">
			<div :class="styles.header">
				<div :id="titleId"><slot name="title" /></div>
				<div :id="descriptionId"><slot name="description" /></div>
			</div>
			<div :class="styles.content"><slot name="content" /></div>
			<div :class="styles.actions"><slot name="actions" /></div>
		</section>
	</div>
</template>
