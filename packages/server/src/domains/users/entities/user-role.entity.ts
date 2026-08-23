import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

import { Role } from "../../roles/entities/role.entity.js"
import { User } from "./user.entity.js"

@Entity({ name: "user_roles" })
export class UserRole {
	@PrimaryColumn({ name: "user_id", type: "uuid" })
	public userId!: string

	@PrimaryColumn({ name: "role_id", type: "uuid" })
	public roleId!: string

	@CreateDateColumn({ name: "assigned_at", type: "timestamptz" })
	public assignedAt!: Date

	@ManyToOne(() => User, user => user.userRoles, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	public user!: User

	@ManyToOne(() => Role, role => role.userRoles, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "role_id" })
	public role!: Role
}
