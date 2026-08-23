import { fileURLToPath } from "node:url"

export const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url))
export const composeProjectName = "access-provisioning-e2e"
export const composeFile = fileURLToPath(new URL("../../../docker-compose.yml", import.meta.url))

export const composeEnvironment: NodeJS.ProcessEnv = {
	...process.env,
	API_PORT: "13000",
	APP_PORT: "18080",
	COMPOSE_PROJECT_NAME: composeProjectName,
	DATABASE_PORT: "15432"
}

export const composeArguments = ["compose", "-p", composeProjectName, "-f", composeFile]
