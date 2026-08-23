<script setup lang="ts">
import styles from "./index.module.css";
</script>

<template>
	<p :class="styles.text"><slot /></p>
</template>
