import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { AuditService } from "./audit.service.js";
import { AuditLogResponseDto } from "./dto/audit-log-response.dto.js";

@ApiTags("audit")
@Controller("audit-logs")
export class AuditController {
	public constructor(private readonly auditService: AuditService) {}

	@Get()
	@ApiOkResponse({ isArray: true, type: AuditLogResponseDto })
	public async findAll(): Promise<AuditLogResponseDto[]> {
		return this.auditService.findAll();
	}
}
