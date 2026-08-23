import { ref } from "vue";

const actorUserId = ref("");

export const useActorStore = () => {
	const setActorUserId = (userId: string): void => {
		actorUserId.value = userId;
	};

	return { actorUserId, setActorUserId };
};
