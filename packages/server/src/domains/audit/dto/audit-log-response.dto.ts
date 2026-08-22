import { ApiProperty } from "@nestjs/swagger";

import { RoleResponseDto } from "../../roles/dto/role-response.dto.js";
import { UserReferenceDto } from "../../users/dto/user-reference.dto.js";
import { AUDIT_ACTION } from "../audit-action.js";
import type { AuditAction } from "../audit-action.js";

export class AuditLogResponseDto {
	@ApiProperty({ format: "uuid", type: String })
	public id!: string;

	@ApiProperty({ enum: Object.values(AUDIT_ACTION), type: String })
	public action!: AuditAction;

	@ApiProperty({ type: () => UserReferenceDto })
	public actor!: UserReferenceDto;

	@ApiProperty({ type: () => UserReferenceDto })
	public target!: UserReferenceDto;

	@ApiProperty({ isArray: true, type: () => RoleResponseDto })
	public beforeRoles!: RoleResponseDto[];

	@ApiProperty({ isArray: true, type: () => RoleResponseDto })
	public afterRoles!: RoleResponseDto[];

	@ApiProperty({ format: "date-time", type: String })
	public createdAt!: string;
}
