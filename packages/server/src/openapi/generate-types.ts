import { mkdir, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import { NestFactory } from "@nestjs/core"
import { SwaggerModule } from "@nestjs/swagger"
import openapiTS, { astToString } from "openapi-typescript"

import { createOpenApiConfig, createOpenApiOptions, OpenApiModule } from "./openapi.module.js"

const packageRoot = fileURLToPath(new URL("../../", import.meta.url))
const generatedDirectory = fileURLToPath(new URL("../_generated/", import.meta.url))
const openApiPath = fileURLToPath(new URL("../_generated/openapi.json", import.meta.url))
const generatedTypesPath = fileURLToPath(new URL("../_generated/api.ts", import.meta.url))

const generateTypes = async (): Promise<void> => {
	try {
		const app = await NestFactory.create(OpenApiModule, { logger: false })
		app.setGlobalPrefix("api")

		try {
			const document = SwaggerModule.createDocument(
				app,
				createOpenApiConfig(),
				createOpenApiOptions()
			)
			const ast = await openapiTS(Buffer.from(JSON.stringify(document)))

			await mkdir(generatedDirectory, { recursive: true })
			await Promise.all([
				writeFile(openApiPath, `${JSON.stringify(document, null, "\t")}\n`, "utf8"),
				writeFile(generatedTypesPath, astToString(ast), "utf8")
			])
		} finally {
			await app.close()
		}
	} catch (error) {
		process.exitCode = 1
		throw new Error(`API type generation failed for ${packageRoot}.`, { cause: error })
	}
}

void generateTypes()
