import { spawn, spawnSync } from "node:child_process";

import { composeArguments, composeEnvironment, repositoryRoot } from "./compose.js";

spawnSync("docker", [...composeArguments, "down", "--volumes", "--remove-orphans"], {
	cwd: repositoryRoot,
	env: composeEnvironment,
	stdio: "ignore",
});

const stack = spawn("docker", [...composeArguments, "up", "--build", "--force-recreate"], {
	cwd: repositoryRoot,
	env: composeEnvironment,
	stdio: "inherit",
});

const forwardSignal = (signal: NodeJS.Signals): void => {
	stack.kill(signal);
};

process.once("SIGINT", () => forwardSignal("SIGINT"));
process.once("SIGTERM", () => forwardSignal("SIGTERM"));
stack.once("exit", (code) => {
	process.exitCode = code ?? 1;
});
