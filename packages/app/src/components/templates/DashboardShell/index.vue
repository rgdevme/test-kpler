<script setup lang="ts">
import styles from "./index.module.css"
</script>

<template>
	<div :class="styles.shell">
		<slot name="navigation" />
		<main :class="styles.main">
			<slot name="content" />
		</main>
	</div>
</template>
