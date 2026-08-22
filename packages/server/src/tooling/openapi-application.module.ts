import { Module } from "@nestjs/common";

import { AuditController } from "../domains/audit/audit.controller.js";
import { AuditService } from "../domains/audit/audit.service.js";
import { HealthController } from "../domains/health/health.controller.js";
import { RolesController } from "../domains/roles/roles.controller.js";
import { RolesService } from "../domains/roles/roles.service.js";
import { UsersController } from "../domains/users/users.controller.js";
import { UsersService } from "../domains/users/users.service.js";

@Module({
	controllers: [UsersController, RolesController, AuditController, HealthController],
	providers: [
		{ provide: UsersService, useValue: {} },
		{ provide: RolesService, useValue: {} },
		{ provide: AuditService, useValue: {} },
	],
})
export class OpenApiApplicationModule {}
