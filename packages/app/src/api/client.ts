import createClient from "openapi-fetch"

import type { paths } from "@server/_generated/api"
import type {
	AuditLog,
	CreateUserInput,
	ReplaceUserRolesInput,
	Role,
	UpdateUserInput,
	User
} from "./types.js"

const client = createClient<paths>({ baseUrl: "" })

export class ApiRequestError extends Error {
	public constructor(public readonly status: number) {
		super(`The API request failed with status ${status}.`)
		this.name = "ApiRequestError"
	}
}

const requireData = <T>(data: T | undefined, status: number): T => {
	if (data === undefined) {
		throw new ApiRequestError(status)
	}
	return data
}

export const fetchUsers = async (): Promise<User[]> => {
	const { data, response } = await client.GET("/api/users")
	return requireData(data, response.status)
}

export const fetchRoles = async (): Promise<Role[]> => {
	const { data, response } = await client.GET("/api/roles")
	return requireData(data, response.status)
}

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
	const { data, response } = await client.GET("/api/audit-logs")
	return requireData(data, response.status)
}

export const createUser = async (actorUserId: string, body: CreateUserInput): Promise<User> => {
	const { data, response } = await client.POST("/api/users", {
		body,
		params: { header: { "x-actor-user-id": actorUserId } }
	})
	return requireData(data, response.status)
}

export const updateUser = async (
	actorUserId: string,
	userId: string,
	body: UpdateUserInput
): Promise<User> => {
	const { data, response } = await client.PUT("/api/users/{userId}", {
		body,
		params: {
			header: { "x-actor-user-id": actorUserId },
			path: { userId }
		}
	})
	return requireData(data, response.status)
}

export const replaceUserRoles = async (
	actorUserId: string,
	userId: string,
	body: ReplaceUserRolesInput
): Promise<User> => {
	const { data, response } = await client.PUT("/api/users/{userId}/roles", {
		body,
		params: {
			header: { "x-actor-user-id": actorUserId },
			path: { userId }
		}
	})
	return requireData(data, response.status)
}
