import { dataSource } from "./data-source.js"
import { Role } from "../domains/roles/entities/role.entity.js"
import { UserRole } from "../domains/users/entities/user-role.entity.js"
import { User } from "../domains/users/entities/user.entity.js"

const ROLE_IDS = {
	admin: "11111111-1111-4111-8111-111111111101",
	support: "11111111-1111-4111-8111-111111111102",
	viewer: "11111111-1111-4111-8111-111111111103"
} as const

const USER_IDS = {
	admin: "22222222-2222-4222-8222-222222222201",
	support: "22222222-2222-4222-8222-222222222202",
	viewer: "22222222-2222-4222-8222-222222222203"
} as const

const seedDatabase = async (): Promise<void> => {
	try {
		await dataSource.initialize()
		await dataSource.transaction(async manager => {
			await manager.getRepository(Role).upsert(
				[
					{ id: ROLE_IDS.admin, name: "Admin" },
					{ id: ROLE_IDS.support, name: "Support" },
					{ id: ROLE_IDS.viewer, name: "Viewer" }
				],
				["id"]
			)

			await manager.getRepository(User).upsert(
				[
					{
						displayName: "Olivia Operations",
						email: "olivia.operations@example.com",
						id: USER_IDS.admin
					},
					{
						displayName: "Sam Support",
						email: "sam.support@example.com",
						id: USER_IDS.support
					},
					{
						displayName: "Victor Viewer",
						email: "victor.viewer@example.com",
						id: USER_IDS.viewer
					}
				],
				["id"]
			)

			await manager
				.createQueryBuilder()
				.insert()
				.into(UserRole)
				.values([
					{ roleId: ROLE_IDS.admin, userId: USER_IDS.admin },
					{ roleId: ROLE_IDS.support, userId: USER_IDS.support },
					{ roleId: ROLE_IDS.viewer, userId: USER_IDS.viewer }
				])
				.orIgnore()
				.execute()
		})
	} catch (error) {
		process.exitCode = 1
		throw new Error("Database seeding failed.", { cause: error })
	} finally {
		if (dataSource.isInitialized) {
			await dataSource.destroy()
		}
	}
}

void seedDatabase()
