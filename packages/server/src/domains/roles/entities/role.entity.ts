import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import type { UserRole } from "../../users/entities/user-role.entity.js"

@Entity({ name: "roles" })
export class Role {
	@PrimaryGeneratedColumn("uuid")
	public id!: string

	@Column({ length: 80, type: "varchar", unique: true })
	public name!: string

	@OneToMany("UserRole", "role")
	public userRoles!: UserRole[]
}
