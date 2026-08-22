import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { createGeneratedTypes } from "./create-generated-types.js";

const packageRoot = fileURLToPath(new URL("../../", import.meta.url));
const generatedDirectory = fileURLToPath(new URL("../generated/", import.meta.url));
const openApiPath = fileURLToPath(new URL("../../openapi.json", import.meta.url));
const generatedTypesPath = fileURLToPath(new URL("../generated/api.ts", import.meta.url));

const generateTypes = async (): Promise<void> => {
	try {
		const generated = await createGeneratedTypes();
		await mkdir(generatedDirectory, { recursive: true });
		await Promise.all([
			writeFile(openApiPath, generated.openApiDocument, "utf8"),
			writeFile(generatedTypesPath, generated.types, "utf8"),
		]);
	} catch (error) {
		process.exitCode = 1;
		throw new Error(`API type generation failed for ${packageRoot}.`, { cause: error });
	}
};

void generateTypes();
