import { dataSource } from "./data-source.js";

const runMigrations = async (): Promise<void> => {
	try {
		await dataSource.initialize();
		await dataSource.runMigrations({ transaction: "all" });
	} catch (error) {
		process.exitCode = 1;
		throw new Error("Database migrations failed.", { cause: error });
	} finally {
		if (dataSource.isInitialized) {
			await dataSource.destroy();
		}
	}
};

void runMigrations();
