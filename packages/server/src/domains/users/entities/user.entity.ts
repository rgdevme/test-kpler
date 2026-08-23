import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm"

import type { UserRole } from "./user-role.entity.js"

@Entity({ name: "users" })
export class User {
	@PrimaryGeneratedColumn("uuid")
	public id!: string

	@Column({ length: 120, name: "display_name", type: "varchar" })
	public displayName!: string

	@Column({ length: 320, type: "varchar", unique: true })
	public email!: string

	@CreateDateColumn({ name: "created_at", type: "timestamptz" })
	public createdAt!: Date

	@UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
	public updatedAt!: Date

	@OneToMany("UserRole", "user")
	public userRoles!: UserRole[]
}
