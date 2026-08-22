import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { createGeneratedTypes } from "./create-generated-types.js";

const openApiPath = fileURLToPath(new URL("../../openapi.json", import.meta.url));
const generatedTypesPath = fileURLToPath(new URL("../generated/api.ts", import.meta.url));

const checkGeneratedTypes = async (): Promise<void> => {
	try {
		const [generated, openApiDocument, types] = await Promise.all([
			createGeneratedTypes(),
			readFile(openApiPath, "utf8"),
			readFile(generatedTypesPath, "utf8"),
		]);
		if (generated.openApiDocument !== openApiDocument || generated.types !== types) {
			throw new Error("Generated API artifacts are stale. Run pnpm generate:types.");
		}
	} catch (error) {
		process.exitCode = 1;
		throw new Error("Generated API artifact verification failed.", { cause: error });
	}
};

void checkGeneratedTypes();
