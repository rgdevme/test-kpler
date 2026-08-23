import { ApiProperty } from "@nestjs/swagger";
import { ArrayUnique, IsArray, IsString, IsUUID, Length } from "class-validator";

export class UpdateUserDto {
	@ApiProperty({ example: "Alex Analyst", maxLength: 120, minLength: 2, type: String })
	@IsString()
	@Length(2, 120)
	public displayName!: string;

	@ApiProperty({ format: "uuid", isArray: true, type: String })
	@ArrayUnique()
	@IsArray()
	@IsUUID("4", { each: true })
	public roleIds!: string[];
}
