<script setup lang="ts">
import { strings } from "@/data/locale/en.js";
import styles from "./index.module.css";
</script>

<template>
	<header :class="styles.header">
		<RouterLink :class="styles.brand" to="/users">
			<span :class="styles.mark">A</span>
			<span>
				<small>{{ strings.app.eyebrow }}</small>
				<strong>{{ strings.app.name }}</strong>
			</span>
		</RouterLink>
		<nav :class="styles.navigation" aria-label="Primary navigation">
			<RouterLink to="/users">{{ strings.navigation.users }}</RouterLink>
			<RouterLink to="/audit">{{ strings.navigation.audit }}</RouterLink>
		</nav>
	</header>
</template>
