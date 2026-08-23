<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";

import type { User } from "@/api/types.js";
import { Button } from "@/components/index.js";
import { strings } from "@/data/locale/en.js";
import styles from "./index.module.css";

const props = withDefaults(
	defineProps<{
		disabled?: boolean;
		modelValue: string;
		users: User[];
	}>(),
	{ disabled: false },
);

const emit = defineEmits<{
	add: [];
	"update:modelValue": [value: string];
}>();

const root = ref<HTMLElement>();
const isOpen = ref(false);
const activeIndex = ref(0);
const listboxId = useId();
const selectedUser = computed(() => props.users.find((user) => user.id === props.modelValue));
const selectedIndex = computed(() => props.users.findIndex((user) => user.id === props.modelValue));
const activeOptionId = computed(() => {
	const user = props.users[activeIndex.value];
	return isOpen.value && user !== undefined ? `${listboxId}-${user.id}` : undefined;
});

const closeDropdown = (): void => {
	isOpen.value = false;
};

const openDropdown = (): void => {
	if (props.disabled || props.users.length === 0) {
		return;
	}
	activeIndex.value = Math.max(selectedIndex.value, 0);
	isOpen.value = true;
};

const toggleDropdown = (): void => {
	if (isOpen.value) {
		closeDropdown();
		return;
	}
	openDropdown();
};

const moveActiveOption = (direction: 1 | -1): void => {
	if (!isOpen.value) {
		openDropdown();
		return;
	}
	activeIndex.value = (activeIndex.value + direction + props.users.length) % props.users.length;
};

const selectUser = (user: User): void => {
	emit("update:modelValue", user.id);
	closeDropdown();
};

const selectActiveUser = (): void => {
	const user = props.users[activeIndex.value];
	if (user !== undefined) {
		selectUser(user);
	}
};

const handleTriggerKeydown = (event: KeyboardEvent): void => {
	switch (event.key) {
		case "ArrowDown":
			event.preventDefault();
			moveActiveOption(1);
			break;
		case "ArrowUp":
			event.preventDefault();
			moveActiveOption(-1);
			break;
		case "Enter":
		case " ":
			event.preventDefault();
			if (isOpen.value) {
				selectActiveUser();
			} else {
				openDropdown();
			}
			break;
		case "Escape":
			closeDropdown();
			break;
	}
};

const handleDocumentPointerDown = (event: PointerEvent): void => {
	if (event.target instanceof Node && !root.value?.contains(event.target)) {
		closeDropdown();
	}
};

onMounted(() => {
	document.addEventListener("pointerdown", handleDocumentPointerDown);
});

onBeforeUnmount(() => {
	document.removeEventListener("pointerdown", handleDocumentPointerDown);
});
</script>

<template>
	<div ref="root" :class="styles.selector">
		<div :class="styles.picker">
			<button
				:aria-activedescendant="activeOptionId"
				:aria-controls="listboxId"
				:aria-expanded="isOpen"
				:aria-label="strings.users.actorLabel"
				:class="styles.trigger"
				:disabled="disabled"
				aria-haspopup="listbox"
				role="combobox"
				type="button"
				@click="toggleDropdown"
				@keydown="handleTriggerKeydown"
			>
				<span :class="styles.selected">
					{{ selectedUser?.displayName ?? strings.users.selectActor }}
				</span>
				<span :class="styles.toggle" :data-open="isOpen" aria-hidden="true">
					<svg fill="none" viewBox="0 0 24 24">
						<path d="m6 9 6 6 6-6" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
					</svg>
				</span>
			</button>

			<Transition
				:enter-active-class="styles.dropdownEnterActive ?? ''"
				:enter-from-class="styles.dropdownEnterFrom ?? ''"
				:leave-active-class="styles.dropdownLeaveActive ?? ''"
				:leave-to-class="styles.dropdownLeaveTo ?? ''"
			>
				<ul v-if="isOpen" :id="listboxId" :class="styles.dropdown" role="listbox">
					<li
						v-for="(user, index) in users"
						:id="`${listboxId}-${user.id}`"
						:key="user.id"
						:aria-selected="user.id === modelValue"
						:class="styles.option"
						:data-active="index === activeIndex"
						role="option"
						@click="selectUser(user)"
						@mouseenter="activeIndex = index"
					>
						<strong>{{ user.displayName }}</strong>
						<span>{{ user.email }}</span>
					</li>
				</ul>
			</Transition>
		</div>

		<Button
			:aria-label="strings.users.addAction"
			:disabled="disabled"
			:title="strings.users.addAction"
			variant="icon"
			@click="emit('add')"
		>
			<svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
				<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
			</svg>
		</Button>
	</div>
</template>
