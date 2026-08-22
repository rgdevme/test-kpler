<script setup lang="ts">
import { computed } from "vue";

import { AuditTable, BaseButton } from "@/components/index.js";
import { useAuditLogsQuery } from "@/composables/use-access-data.js";
import { strings } from "@/data/locale/en.js";
import styles from "./index.module.css";

const auditQuery = useAuditLogsQuery();
const auditLogs = computed(() => auditQuery.data.value ?? []);
</script>

<template>
	<div :class="styles.page">
		<header :class="styles.heading">
			<span>{{ strings.navigation.audit }}</span>
			<h1>{{ strings.audit.heading }}</h1>
			<p>{{ strings.audit.subheading }}</p>
		</header>
		<p v-if="auditQuery.isPending.value" role="status">{{ strings.common.loading }}</p>
		<div v-else-if="auditQuery.isError.value" :class="styles.error">
			<p role="alert">{{ strings.audit.loadError }}</p>
			<BaseButton variant="secondary" @click="auditQuery.refetch()">
				{{ strings.common.retry }}
			</BaseButton>
		</div>
		<AuditTable v-else-if="auditLogs.length > 0" :audit-logs="auditLogs" />
		<p v-else>{{ strings.audit.empty }}</p>
	</div>
</template>
