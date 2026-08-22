import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "../../users/entities/user.entity.js";
import type { AuditAction } from "../audit-action.js";
import type { RoleSnapshot } from "../role-snapshot.js";

@Entity({ name: "audit_logs" })
export class AuditLog {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;

	@Column({ length: 40, type: "varchar" })
	public action!: AuditAction;

	@Column({ name: "actor_user_id", type: "uuid" })
	public actorUserId!: string;

	@Column({ name: "target_user_id", type: "uuid" })
	public targetUserId!: string;

	@Column({ default: () => "'[]'::jsonb", name: "before_roles", type: "jsonb" })
	public beforeRoles!: RoleSnapshot[];

	@Column({ default: () => "'[]'::jsonb", name: "after_roles", type: "jsonb" })
	public afterRoles!: RoleSnapshot[];

	@CreateDateColumn({ name: "created_at", type: "timestamptz" })
	public createdAt!: Date;

	@ManyToOne(() => User, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "actor_user_id" })
	public actor!: User;

	@ManyToOne(() => User, { onDelete: "RESTRICT" })
	@JoinColumn({ name: "target_user_id" })
	public target!: User;
}
