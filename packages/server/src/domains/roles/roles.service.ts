import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import type { RoleResponseDto } from "./dto/role-response.dto.js";
import { Role } from "./entities/role.entity.js";

@Injectable()
export class RolesService {
	public constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

	public readonly findAll = async (): Promise<RoleResponseDto[]> =>
		this.dataSource.getRepository(Role).find({ order: { name: "ASC" } });
}
