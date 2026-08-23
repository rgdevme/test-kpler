import { Controller, Get } from "@nestjs/common"
import { ApiOkResponse, ApiProperty, ApiTags } from "@nestjs/swagger"

class HealthResponseDto {
	@ApiProperty({ example: "ok", type: String })
	public status!: "ok"
}

@ApiTags("health")
@Controller("health")
export class HealthController {
	@Get()
	@ApiOkResponse({ type: HealthResponseDto })
	public getHealth(): HealthResponseDto {
		return { status: "ok" }
	}
}
