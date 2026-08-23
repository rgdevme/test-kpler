import createClient from "openapi-fetch"
import type { Middleware } from "openapi-fetch"

import type { paths } from "@server/_generated/api"
import { useActorStore } from "@/stores/useActorStore.js"

const ACTOR_HEADER = "x-actor-user-id"

export class ApiRequestError extends Error {
	public constructor(public readonly status: number) {
		super(`The API request failed with status ${status}.`)
		this.name = "ApiRequestError"
	}
}

const provisionActor: Middleware = {
	onRequest: ({ request }) => {
		const { actorUserId } = useActorStore()

		if (actorUserId.value) {
			request.headers.set(ACTOR_HEADER, actorUserId.value)
		}
	}
}

const requireData: Middleware = {
	onResponse: ({ response }) => {
		if (!response.ok) {
			throw new ApiRequestError(response.status)
		}
	}
}

export const apiClient = createClient<paths>({ baseUrl: "" })

apiClient.use(provisionActor, requireData)
