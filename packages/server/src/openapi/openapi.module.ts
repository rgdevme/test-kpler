import { Module } from "@nestjs/common"
import { DocumentBuilder } from "@nestjs/swagger"
import type { OpenAPIObject, SwaggerDocumentOptions } from "@nestjs/swagger"

import { AuditController } from "../domains/audit/audit.controller.js"
import { AuditService } from "../domains/audit/audit.service.js"
import { ACTOR_HEADER, ACTOR_SECURITY_SCHEME } from "../decorators/xActorUserId.decorator.js"
import { HealthController } from "../domains/health/health.controller.js"
import { RolesController } from "../domains/roles/roles.controller.js"
import { RolesService } from "../domains/roles/roles.service.js"
import { UsersController } from "../domains/users/users.controller.js"
import { UsersService } from "../domains/users/users.service.js"

export const createOpenApiConfig = (): Omit<OpenAPIObject, "paths"> =>
	new DocumentBuilder()
		.setTitle("Access Provisioning and Audit API")
		.setDescription("Manage user access levels and inspect the immutable access audit history.")
		.setVersion("1.0.0")
		.addApiKey({ in: "header", name: ACTOR_HEADER, type: "apiKey" }, ACTOR_SECURITY_SCHEME)
		.addTag("users")
		.addTag("roles")
		.addTag("audit")
		.addTag("health")
		.build()

export const createOpenApiOptions = (): SwaggerDocumentOptions => ({
	operationIdFactory: (controllerKey, methodKey) => `${controllerKey}_${methodKey}`
})

@Module({
	controllers: [UsersController, RolesController, AuditController, HealthController],
	providers: [
		{ provide: UsersService, useValue: {} },
		{ provide: RolesService, useValue: {} },
		{ provide: AuditService, useValue: {} }
	]
})
export class OpenApiModule {}
