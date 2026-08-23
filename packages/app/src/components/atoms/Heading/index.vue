<script setup lang="ts">
import { computed } from "vue"

import styles from "./index.module.css"

const props = withDefaults(defineProps<{ level?: 1 | 2 | 3 }>(), { level: 2 })
const tag = computed(() => `h${props.level}`)
</script>

<template>
	<component
		:is="tag"
		:class="styles.heading"
		><slot
	/></component>
</template>
