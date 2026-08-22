import type { components } from "@server/generated/api";

export type Role = components["schemas"]["RoleResponseDto"];
export type User = components["schemas"]["UserResponseDto"];
export type AuditLog = components["schemas"]["AuditLogResponseDto"];
export type CreateUserInput = components["schemas"]["CreateUserDto"];
export type ReplaceUserRolesInput = components["schemas"]["ReplaceUserRolesDto"];
