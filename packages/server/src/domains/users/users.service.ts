import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, In } from "typeorm";
import type { EntityManager } from "typeorm";

import { AUDIT_ACTION } from "../audit/audit-action.js";
import { AuditLog } from "../audit/entities/audit-log.entity.js";
import type { RoleSnapshot } from "../audit/role-snapshot.js";
import { Role } from "../roles/entities/role.entity.js";
import type { CreateUserDto } from "./dto/create-user.dto.js";
import type { ReplaceUserRolesDto } from "./dto/replace-user-roles.dto.js";
import type { UserResponseDto } from "./dto/user-response.dto.js";
import { isUniqueViolation } from "./database-error.js";
import { UserRole } from "./entities/user-role.entity.js";
import { User } from "./entities/user.entity.js";
import { mapUserResponse } from "./user.mapper.js";

@Injectable()
export class UsersService {
	public constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

	public readonly findAll = async (): Promise<UserResponseDto[]> => {
		const users = await this.dataSource.getRepository(User).find({
			order: { displayName: "ASC" },
			relations: { userRoles: { role: true } },
		});

		return users.map(mapUserResponse);
	};

	public readonly create = async (
		actorUserId: string,
		input: CreateUserDto,
	): Promise<UserResponseDto> => {
		try {
			return await this.dataSource.transaction("SERIALIZABLE", async (manager) => {
				await this.requireUser(manager, actorUserId, "The selected actor does not exist.");
				const roles = await this.requireRoles(manager, input.roleIds);
				const email = input.email.trim().toLowerCase();

				const existingUser = await manager.getRepository(User).findOne({ where: { email } });
				if (existingUser !== null) {
					throw new ConflictException("A user with this email already exists.");
				}

				const user = manager.getRepository(User).create({
					displayName: input.displayName.trim(),
					email,
				});
				await manager.save(user);
				await this.replaceRoleRows(manager, user.id, roles);

				const afterRoles = this.mapRoleSnapshots(roles);
				await manager.getRepository(AuditLog).save({
					action: AUDIT_ACTION.userCreated,
					actorUserId,
					afterRoles,
					beforeRoles: [],
					targetUserId: user.id,
				});

				return mapUserResponse(await this.requireUserWithRoles(manager, user.id));
			});
		} catch (error) {
			if (error instanceof ConflictException) {
				throw error;
			}
			if (isUniqueViolation(error)) {
				throw new ConflictException("A user with this email already exists.", { cause: error });
			}
			throw error;
		}
	};

	public readonly replaceRoles = async (
		actorUserId: string,
		userId: string,
		input: ReplaceUserRolesDto,
	): Promise<UserResponseDto> =>
		this.dataSource.transaction("SERIALIZABLE", async (manager) => {
			await this.requireUser(manager, actorUserId, "The selected actor does not exist.");
			await this.requireUser(manager, userId, "The target user does not exist.");
			const roles = await this.requireRoles(manager, input.roleIds);
			const currentRoleRows = await manager.getRepository(UserRole).find({
				relations: { role: true },
				where: { userId },
			});
			const beforeRoles = this.mapRoleSnapshots(currentRoleRows.map(({ role }) => role));
			const afterRoles = this.mapRoleSnapshots(roles);

			if (this.roleSnapshotsMatch(beforeRoles, afterRoles)) {
				return mapUserResponse(await this.requireUserWithRoles(manager, userId));
			}

			await manager.getRepository(UserRole).delete({ userId });
			await this.replaceRoleRows(manager, userId, roles);
			await manager.getRepository(AuditLog).save({
				action: AUDIT_ACTION.rolesChanged,
				actorUserId,
				afterRoles,
				beforeRoles,
				targetUserId: userId,
			});

			return mapUserResponse(await this.requireUserWithRoles(manager, userId));
		});

	private readonly requireUser = async (
		manager: EntityManager,
		userId: string,
		message: string,
	): Promise<User> => {
		const user = await manager.getRepository(User).findOne({ where: { id: userId } });
		if (user === null) {
			throw new NotFoundException(message);
		}
		return user;
	};

	private readonly requireUserWithRoles = async (
		manager: EntityManager,
		userId: string,
	): Promise<User> => {
		const user = await manager.getRepository(User).findOne({
			relations: { userRoles: { role: true } },
			where: { id: userId },
		});
		if (user === null) {
			throw new NotFoundException("The target user does not exist.");
		}
		return user;
	};

	private readonly requireRoles = async (
		manager: EntityManager,
		roleIds: string[],
	): Promise<Role[]> => {
		if (roleIds.length === 0) {
			return [];
		}
		const roles = await manager.getRepository(Role).findBy({ id: In(roleIds) });
		if (roles.length !== roleIds.length) {
			throw new BadRequestException("One or more selected roles do not exist.");
		}
		return roles;
	};

	private readonly replaceRoleRows = async (
		manager: EntityManager,
		userId: string,
		roles: Role[],
	): Promise<void> => {
		if (roles.length === 0) {
			return;
		}
		await manager.getRepository(UserRole).insert(
			roles.map((role) => ({
				roleId: role.id,
				userId,
			})),
		);
	};

	private readonly mapRoleSnapshots = (roles: Role[]): RoleSnapshot[] =>
		roles
			.map((role) => ({ id: role.id, name: role.name }))
			.sort((left, right) => left.name.localeCompare(right.name));

	private readonly roleSnapshotsMatch = (
		beforeRoles: RoleSnapshot[],
		afterRoles: RoleSnapshot[],
	): boolean =>
		beforeRoles.length === afterRoles.length &&
		beforeRoles.every((role, index) => role.id === afterRoles[index]?.id);
}
