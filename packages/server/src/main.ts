import "reflect-metadata"

import { NestFactory } from "@nestjs/core"

import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module.js"

import { createOpenApiConfig, createOpenApiOptions } from "./openapi/openapi.module.js"

const bootstrap = async (): Promise<void> => {
	try {
		const app = await NestFactory.create(AppModule)

		app.setGlobalPrefix("api")
		app.useGlobalPipes(
			new ValidationPipe({
				forbidNonWhitelisted: true,
				transform: true,
				whitelist: true
			})
		)

		SwaggerModule.setup(
			"docs",
			app,
			SwaggerModule.createDocument(app, createOpenApiConfig(), createOpenApiOptions()),
			{
				jsonDocumentUrl: "openapi.json",
				useGlobalPrefix: true
			}
		)

		const configuredPort = Number(process.env.PORT ?? "3000")
		await app.listen(configuredPort, "0.0.0.0")
	} catch (error) {
		throw new Error("The access provisioning server failed to start.", { cause: error })
	}
}

void bootstrap()
