import { ApiProperty } from "@nestjs/swagger";

export class UserReferenceDto {
	@ApiProperty({ format: "uuid", type: String })
	public id!: string;

	@ApiProperty({ example: "Olivia Operations", type: String })
	public displayName!: string;

	@ApiProperty({ example: "olivia.operations@example.com", format: "email", type: String })
	public email!: string;
}
