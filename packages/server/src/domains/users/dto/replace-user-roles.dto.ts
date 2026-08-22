import { ApiProperty } from "@nestjs/swagger";
import { ArrayUnique, IsArray, IsUUID } from "class-validator";

export class ReplaceUserRolesDto {
	@ApiProperty({ format: "uuid", isArray: true, type: String })
	@ArrayUnique()
	@IsArray()
	@IsUUID("4", { each: true })
	public roleIds!: string[];
}
