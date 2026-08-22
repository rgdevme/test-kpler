import { ValidationPipe } from "@nestjs/common";
import type { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";

import { createOpenApiConfig, createOpenApiOptions } from "./openapi.js";

export const configureApplication = (app: INestApplication): void => {
	app.setGlobalPrefix("api");
	app.useGlobalPipes(
		new ValidationPipe({
			forbidNonWhitelisted: true,
			transform: true,
			whitelist: true,
		}),
	);

	const documentFactory = () =>
		SwaggerModule.createDocument(app, createOpenApiConfig(), createOpenApiOptions());
	SwaggerModule.setup("docs", app, documentFactory, {
		jsonDocumentUrl: "openapi.json",
		useGlobalPrefix: true,
	});
};
