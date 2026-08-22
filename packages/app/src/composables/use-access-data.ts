import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

import {
	createUser,
	fetchAuditLogs,
	fetchRoles,
	fetchUsers,
	replaceUserRoles,
} from "@/api/client.js";
import type { CreateUserInput, ReplaceUserRolesInput } from "@/api/types.js";

const queryKeys = {
	audit: ["access", "audit"] as const,
	roles: ["access", "roles"] as const,
	users: ["access", "users"] as const,
};

export const useUsersQuery = () =>
	useQuery({
		queryFn: fetchUsers,
		queryKey: queryKeys.users,
	});

export const useRolesQuery = () =>
	useQuery({
		queryFn: fetchRoles,
		queryKey: queryKeys.roles,
	});

export const useAuditLogsQuery = () =>
	useQuery({
		queryFn: fetchAuditLogs,
		queryKey: queryKeys.audit,
	});

export const useCreateUserMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ actorUserId, input }: { actorUserId: string; input: CreateUserInput }) =>
			createUser(actorUserId, input),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.users }),
				queryClient.invalidateQueries({ queryKey: queryKeys.audit }),
			]);
		},
	});
};

export const useReplaceRolesMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			actorUserId,
			input,
			userId,
		}: {
			actorUserId: string;
			input: ReplaceUserRolesInput;
			userId: string;
		}) => replaceUserRoles(actorUserId, userId, input),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.users }),
				queryClient.invalidateQueries({ queryKey: queryKeys.audit }),
			]);
		},
	});
};
