import { defineConfig, devices } from "@playwright/test"

const stackEnvironment = {
	...process.env,
	API_PORT: "13000",
	APP_PORT: "18080",
	COMPOSE_PROJECT_NAME: "access-provisioning-e2e",
	DATABASE_PORT: "15432"
}

export default defineConfig({
	fullyParallel: false,
	globalTeardown: "./src/teardown.ts",
	outputDir: "test-results",
	reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
	retries: process.env.CI === "true" ? 1 : 0,
	testDir: "./tests",
	use: {
		baseURL: "http://127.0.0.1:18080",
		trace: "retain-on-failure"
	},
	webServer: {
		command: "pnpm stack:start",
		env: stackEnvironment,
		reuseExistingServer: false,
		stderr: "pipe",
		stdout: "pipe",
		timeout: 240_000,
		url: "http://127.0.0.1:18080/api/health"
	},
	workers: 1,
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] }
		}
	]
})
