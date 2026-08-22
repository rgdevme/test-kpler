import { createParamDecorator } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";

type RequestWithHeaders = {
	headers: Record<string, string | string[] | undefined>;
};

export const ACTOR_HEADER = "x-actor-user-id";

export const ActorUserId = createParamDecorator(
	(_data: unknown, context: ExecutionContext): string | undefined => {
		const request = context.switchToHttp().getRequest<RequestWithHeaders>();
		const value = request.headers[ACTOR_HEADER];
		return Array.isArray(value) ? value[0] : value;
	},
);
