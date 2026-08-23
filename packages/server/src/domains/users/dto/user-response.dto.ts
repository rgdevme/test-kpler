import { ApiProperty } from "@nestjs/swagger"

import { RoleResponseDto } from "../../roles/dto/role-response.dto.js"

export class UserResponseDto {
	@ApiProperty({ format: "uuid", type: String })
	public id!: string

	@ApiProperty({ example: "Olivia Operations", type: String })
	public displayName!: string

	@ApiProperty({ example: "olivia.operations@example.com", format: "email", type: String })
	public email!: string

	@ApiProperty({ isArray: true, type: () => RoleResponseDto })
	public roles!: RoleResponseDto[]

	@ApiProperty({ format: "date-time", type: String })
	public createdAt!: string

	@ApiProperty({ format: "date-time", type: String })
	public updatedAt!: string
}
