import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"

import { mapAuditLogResponse } from "./audit-log.mapper.js"
import type { AuditLogResponseDto } from "./dto/audit-log-response.dto.js"
import { AuditLog } from "./entities/audit-log.entity.js"

@Injectable()
export class AuditService {
	public constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

	public readonly findAll = async (): Promise<AuditLogResponseDto[]> => {
		const auditLogs = await this.dataSource.getRepository(AuditLog).find({
			order: { createdAt: "DESC", id: "DESC" },
			relations: { actor: true, target: true }
		})
		return auditLogs.map(mapAuditLogResponse)
	}
}
