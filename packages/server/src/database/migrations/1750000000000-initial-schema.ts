import type { MigrationInterface, QueryRunner } from "typeorm"

export class InitialSchema1750000000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`)
		await queryRunner.query(`
			CREATE TABLE "users" (
				"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
				"display_name" varchar(120) NOT NULL,
				"email" varchar(320) NOT NULL,
				"created_at" timestamptz NOT NULL DEFAULT now(),
				"updated_at" timestamptz NOT NULL DEFAULT now(),
				CONSTRAINT "users_email_unique" UNIQUE ("email")
			)
		`)
		await queryRunner.query(`
			CREATE TABLE "roles" (
				"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
				"name" varchar(80) NOT NULL,
				CONSTRAINT "roles_name_unique" UNIQUE ("name")
			)
		`)
		await queryRunner.query(`
			CREATE TABLE "user_roles" (
				"user_id" uuid NOT NULL,
				"role_id" uuid NOT NULL,
				"assigned_at" timestamptz NOT NULL DEFAULT now(),
				CONSTRAINT "user_roles_primary" PRIMARY KEY ("user_id", "role_id"),
				CONSTRAINT "user_roles_user_foreign" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
				CONSTRAINT "user_roles_role_foreign" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE RESTRICT
			)
		`)
		await queryRunner.query(`CREATE INDEX "user_roles_role_index" ON "user_roles" ("role_id")`)
		await queryRunner.query(`
			CREATE TABLE "audit_logs" (
				"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
				"action" varchar(40) NOT NULL,
				"actor_user_id" uuid NOT NULL,
				"target_user_id" uuid NOT NULL,
				"before_roles" jsonb NOT NULL DEFAULT '[]'::jsonb,
				"after_roles" jsonb NOT NULL DEFAULT '[]'::jsonb,
				"created_at" timestamptz NOT NULL DEFAULT now(),
				CONSTRAINT "audit_logs_actor_foreign" FOREIGN KEY ("actor_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT,
				CONSTRAINT "audit_logs_target_foreign" FOREIGN KEY ("target_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT
			)
		`)
		await queryRunner.query(
			`CREATE INDEX "audit_logs_chronology_index" ON "audit_logs" ("created_at" DESC, "id" DESC)`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "audit_logs"`)
		await queryRunner.query(`DROP TABLE "user_roles"`)
		await queryRunner.query(`DROP TABLE "roles"`)
		await queryRunner.query(`DROP TABLE "users"`)
	}
}
