export const AUDIT_ACTION = {
	rolesChanged: "ROLES_CHANGED",
	userCreated: "USER_CREATED",
} as const;

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];
