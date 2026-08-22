import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const mode = process.argv[2];

if (mode !== "dev" && mode !== "start") {
	throw new Error("Server runner mode must be either dev or start.");
}

const database = spawnSync(
	"docker",
	["compose", "-f", "docker-compose.yml", "up", "database", "--detach", "--wait"],
	{
		cwd: repositoryRoot,
		stdio: "inherit",
	},
);

if (database.error !== undefined || database.status !== 0) {
	throw new Error("The PostgreSQL sidecar failed to start.", { cause: database.error });
}

const executable =
	mode === "dev" ? (process.platform === "win32" ? "pnpm.cmd" : "pnpm") : process.execPath;
const argumentsList = mode === "dev" ? ["exec", "nest", "start", "--watch"] : ["dist/main.js"];
const server = spawn(executable, argumentsList, {
	cwd: fileURLToPath(new URL("../../", import.meta.url)),
	stdio: "inherit",
});

const forwardSignal = (signal: NodeJS.Signals): void => {
	server.kill(signal);
};

process.once("SIGINT", () => forwardSignal("SIGINT"));
process.once("SIGTERM", () => forwardSignal("SIGTERM"));
server.once("exit", (code) => {
	process.exitCode = code ?? 1;
});
