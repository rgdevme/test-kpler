import { spawnSync } from "node:child_process"

import { composeArguments, composeEnvironment, repositoryRoot } from "./compose.js"

const teardown = async (): Promise<void> => {
	const result = spawnSync(
		"docker",
		[...composeArguments, "down", "--volumes", "--remove-orphans"],
		{
			cwd: repositoryRoot,
			env: composeEnvironment,
			stdio: "inherit"
		}
	)
	if (result.error !== undefined || result.status !== 0) {
		throw new Error("The E2E Docker stack could not be removed.", { cause: result.error })
	}
}

export default teardown
