import { join } from "node:path"
import { fileURLToPath } from "node:url"

import type { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js"

import { AuditLog } from "../domains/audit/entities/audit-log.entity.js"
import { Role } from "../domains/roles/entities/role.entity.js"
import { User } from "../domains/users/entities/user.entity.js"
import { UserRole } from "../domains/users/entities/user-role.entity.js"

const databaseDirectory = fileURLToPath(new URL("./", import.meta.url))

export const getDataSourceOptions = (): PostgresConnectionOptions => ({
	type: "postgres",
	url: process.env.DATABASE_URL ?? "postgresql://access:access@localhost:5432/access_portal",
	entities: [User, Role, UserRole, AuditLog],
	migrations: [join(databaseDirectory, "migrations", "*.{js,ts}")],
	migrationsRun: false,
	migrationsTableName: "migrations",
	migrationsTransactionMode: "all",
	synchronize: false
})
