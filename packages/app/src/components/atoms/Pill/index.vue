<script setup lang="ts">
import styles from "./index.module.css"

defineProps<{ name: string }>()
</script>

<template>
	<span :class="styles.pill">{{ name }}</span>
</template>
