import { DocumentBuilder } from "@nestjs/swagger";
import type { OpenAPIObject, SwaggerDocumentOptions } from "@nestjs/swagger";

export const createOpenApiConfig = (): Omit<OpenAPIObject, "paths"> =>
	new DocumentBuilder()
		.setTitle("Access Provisioning and Audit API")
		.setDescription("Manage user access levels and inspect the immutable access audit history.")
		.setVersion("1.0.0")
		.addTag("users")
		.addTag("roles")
		.addTag("audit")
		.addTag("health")
		.build();

export const createOpenApiOptions = (): SwaggerDocumentOptions => ({
	operationIdFactory: (controllerKey, methodKey) => `${controllerKey}_${methodKey}`,
});
