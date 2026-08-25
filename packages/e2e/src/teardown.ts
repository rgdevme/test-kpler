import { spawnSync } from "node:child_process"

import { composeArguments, composeEnvironment, repositoryRoot } from "./compose.js"

const teardown = async (): Promise<void> => {
	const result = spawnSync(
		"docker",
		[...composeArguments, "down", "--volumes", "--remove-orphans"],
		{
			cwd: repositoryRoot,
			encoding: "utf8",
			env: composeEnvironment,
			stdio: "pipe"
		}
	)
	if (result.error !== undefined || result.status !== 0) {
		const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim()
		const message =
			output === ""
				? "The E2E Docker stack could not be removed."
				: `The E2E Docker stack could not be removed.\n${output}`

		throw new Error(message, { cause: result.error })
	}
}

export default teardown
