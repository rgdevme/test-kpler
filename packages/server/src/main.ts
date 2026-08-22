import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { configureApplication } from "./bootstrap/configure-application.js";

const bootstrap = async (): Promise<void> => {
	try {
		const app = await NestFactory.create(AppModule);
		configureApplication(app);

		const configuredPort = Number(process.env.PORT ?? "3000");
		await app.listen(configuredPort, "0.0.0.0");
	} catch (error) {
		throw new Error("The access provisioning server failed to start.", { cause: error });
	}
};

void bootstrap();
