<script setup lang="ts">
import { NavigationHeader } from "@/components/index.js"
import { DashboardShell } from "@/components/index.js"
</script>

<template>
	<DashboardShell>
		<template #navigation>
			<NavigationHeader />
		</template>
		<template #content>
			<RouterView />
		</template>
	</DashboardShell>
</template>
