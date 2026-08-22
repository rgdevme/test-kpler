import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import openapiTS, { astToString } from "openapi-typescript";

import { createOpenApiConfig, createOpenApiOptions } from "../bootstrap/openapi.js";
import { OpenApiApplicationModule } from "./openapi-application.module.js";

export type GeneratedTypes = {
	openApiDocument: string;
	types: string;
};

export const createGeneratedTypes = async (): Promise<GeneratedTypes> => {
	const app = await NestFactory.create(OpenApiApplicationModule, { logger: false });
	app.setGlobalPrefix("api");

	try {
		const document = SwaggerModule.createDocument(
			app,
			createOpenApiConfig(),
			createOpenApiOptions(),
		);
		const ast = await openapiTS(Buffer.from(JSON.stringify(document)));
		return {
			openApiDocument: `${JSON.stringify(document, null, "\t")}\n`,
			types: astToString(ast),
		};
	} finally {
		await app.close();
	}
};
