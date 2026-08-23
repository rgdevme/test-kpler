import { Controller, Get } from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"

import { RoleResponseDto } from "./dto/role-response.dto.js"
import { RolesService } from "./roles.service.js"

@ApiTags("roles")
@Controller("roles")
export class RolesController {
	public constructor(private readonly rolesService: RolesService) {}

	@Get()
	@ApiOkResponse({ isArray: true, type: RoleResponseDto })
	public async findAll(): Promise<RoleResponseDto[]> {
		return this.rolesService.findAll()
	}
}
