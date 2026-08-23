import { ApiProperty } from "@nestjs/swagger"

export class RoleResponseDto {
	@ApiProperty({ format: "uuid", type: String })
	public id!: string

	@ApiProperty({ example: "Support", type: String })
	public name!: string
}
