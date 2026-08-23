import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
	ArrayUnique,
	IsArray,
	IsEmail,
	IsOptional,
	IsString,
	IsUUID,
	Length
} from "class-validator"

export class CreateUserDto {
	@ApiProperty({ example: "Alex Analyst", maxLength: 120, minLength: 2, type: String })
	@IsString()
	@Length(2, 120)
	public displayName!: string

	@ApiProperty({
		example: "alex.analyst@example.com",
		format: "email",
		maxLength: 320,
		type: String
	})
	@IsEmail()
	@Length(3, 320)
	public email!: string

	@ApiPropertyOptional({ default: [], format: "uuid", isArray: true, type: String })
	@ArrayUnique()
	@IsArray()
	@IsOptional()
	@IsUUID("4", { each: true })
	public roleIds: string[] = []
}
