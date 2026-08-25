import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"

import { apiClient } from "@/api/client.js"
import type { CreateUserInput, ReplaceUserRolesInput, UpdateUserInput } from "@/api/types.js"

const queryKeys = {
	audit: ["access", "audit"] as const,
	roles: ["access", "roles"] as const,
	users: ["access", "users"] as const
}

export const useUsersQuery = () =>
	useQuery({
		queryFn: async () => (await apiClient.GET("/api/users")).data,
		queryKey: queryKeys.users
	})

export const useRolesQuery = () =>
	useQuery({
		queryFn: async () => (await apiClient.GET("/api/roles")).data,
		queryKey: queryKeys.roles
	})

export const useAuditLogsQuery = () =>
	useQuery({
		queryFn: async () => (await apiClient.GET("/api/audit-logs")).data,
		queryKey: queryKeys.audit
	})

export const useCreateUserMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (input: CreateUserInput) =>
			(await apiClient.POST("/api/users", { body: input })).data,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.users }),
				queryClient.invalidateQueries({ queryKey: queryKeys.audit })
			])
		}
	})
}

export const useUpdateUserMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ input, userId }: { input: UpdateUserInput; userId: string }) =>
			(
				await apiClient.PUT("/api/users/{userId}", {
					body: input,
					params: { path: { userId } }
				})
			).data,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.users }),
				queryClient.invalidateQueries({ queryKey: queryKeys.audit })
			])
		}
	})
}

export const useReplaceRolesMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ input, userId }: { input: ReplaceUserRolesInput; userId: string }) =>
			(
				await apiClient.PUT("/api/users/{userId}/roles", {
					body: input,
					params: { path: { userId } }
				})
			).data,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKeys.users }),
				queryClient.invalidateQueries({ queryKey: queryKeys.audit })
			])
		}
	})
}
