import type { AuditLogResponseDto } from "./dto/audit-log-response.dto.js"
import type { AuditLog } from "./entities/audit-log.entity.js"

export const mapAuditLogResponse = (auditLog: AuditLog): AuditLogResponseDto => ({
	action: auditLog.action,
	actor: {
		displayName: auditLog.actor.displayName,
		email: auditLog.actor.email,
		id: auditLog.actor.id
	},
	afterRoles: auditLog.afterRoles,
	beforeRoles: auditLog.beforeRoles,
	createdAt: auditLog.createdAt.toISOString(),
	id: auditLog.id,
	target: {
		displayName: auditLog.target.displayName,
		email: auditLog.target.email,
		id: auditLog.target.id
	}
})
