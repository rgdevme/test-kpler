import type { UserResponseDto } from "./dto/user-response.dto.js";
import type { User } from "./entities/user.entity.js";

export const mapUserResponse = (user: User): UserResponseDto => ({
	createdAt: user.createdAt.toISOString(),
	displayName: user.displayName,
	email: user.email,
	id: user.id,
	roles: user.userRoles
		.map(({ role }) => ({ id: role.id, name: role.name }))
		.sort((left, right) => left.name.localeCompare(right.name)),
	updatedAt: user.updatedAt.toISOString(),
});
