import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AuditModule } from "./domains/audit/audit.module.js"
import { HealthModule } from "./domains/health/health.module.js"
import { RolesModule } from "./domains/roles/roles.module.js"
import { UsersModule } from "./domains/users/users.module.js"
import { getDataSourceOptions } from "./database/data-source-options.js"

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(getDataSourceOptions()),
		UsersModule,
		RolesModule,
		AuditModule,
		HealthModule
	]
})
export class AppModule {}
