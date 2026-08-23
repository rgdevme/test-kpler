import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import input from "./input.json" with { type: "json" };
import seed from "./seed.json" with { type: "json" };

test.describe.configure({ mode: "serial" });

const selectActor = async (page: Page, displayName: string): Promise<void> => {
	await page.getByRole("combobox", { name: "Acting user" }).click();
	await page.getByRole("option", { name: displayName }).click();
};

/** As an operations user, I can manage access and leave an attributable audit history. */
test.describe("to provision and audit access as an operations user, I...", () => {
	test("can view seeded users and their assigned roles", async ({ page }) => {
		await page.goto("/users");
		await expect(page.getByRole("heading", { name: "People and access" })).toBeVisible();
		await expect(page.getByText(seed.actor.email)).toBeVisible();
		for (const role of seed.roles) {
			await expect(page.getByText(role, { exact: true }).first()).toBeVisible();
		}
	});

	test("can select an actor and create a user with initial access", async ({ page }) => {
		await page.goto("/audit");
		const banner = page.getByRole("banner");
		await selectActor(page, seed.actor.displayName);
		await banner.getByRole("button", { name: "Add user" }).click();

		const addUserModal = page.getByRole("dialog", { name: "Add a user" });
		await expect(addUserModal).toBeVisible();
		await addUserModal.getByLabel("Display name").fill(input.newUser.displayName);
		await addUserModal.getByLabel("Email address").fill(input.newUser.email);
		await addUserModal.getByRole("checkbox", { name: input.newUser.initialRole }).check();
		await addUserModal.getByRole("button", { name: "Create user" }).click();

		await expect(addUserModal).not.toBeVisible();
		const createdRow = page
			.getByRole("row")
			.filter({
				has: page.getByRole("cell", { exact: true, name: "User created" }),
			})
			.filter({ hasText: seed.actor.displayName })
			.filter({ hasText: input.newUser.displayName });
		await expect(createdRow).toBeVisible();

		await banner.getByRole("link", { name: "Users" }).click();
		await expect(page.getByText(input.newUser.email)).toBeVisible();

		await banner.getByRole("button", { name: "Add user" }).click();
		await expect(addUserModal).toBeVisible();
		await addUserModal.getByLabel("Display name").fill(input.newUser.displayName);
		await addUserModal.getByLabel("Email address").fill(input.newUser.email);
		await addUserModal.getByRole("button", { name: "Create user" }).click();
		await expect(page.getByText("A user with this email already exists.")).toBeVisible();
	});

	test("can edit a user and inspect the resulting access audit event", async ({ page }) => {
		await page.goto("/users");
		await selectActor(page, seed.actor.displayName);
		await page.getByRole("row", { name: `Edit ${input.newUser.displayName}` }).click();

		const userModal = page.getByRole("dialog", { name: "Edit user" });
		await expect(userModal.getByLabel("Email address")).toBeDisabled();
		await userModal.getByLabel("Display name").fill(input.updatedDisplayName);
		await userModal.getByRole("checkbox", { name: input.newUser.initialRole }).uncheck();
		for (const role of input.replacementRoles) {
			await userModal.getByRole("checkbox", { name: role }).check();
		}
		await userModal.getByRole("button", { name: "Save changes" }).click();
		await expect(userModal).not.toBeVisible();
		await expect(page.getByRole("row", { name: `Edit ${input.updatedDisplayName}` })).toBeVisible();

		await page.getByRole("link", { name: "Events" }).click();
		const changedRow = page
			.getByRole("row")
			.filter({
				has: page.getByRole("cell", { exact: true, name: "Roles changed" }),
			})
			.filter({ hasText: seed.actor.displayName })
			.filter({ hasText: input.updatedDisplayName });
		await expect(changedRow).toBeVisible();
		for (const role of input.replacementRoles) {
			await expect(changedRow.getByText(role, { exact: true })).toBeVisible();
		}
	});

	test("cannot submit unknown actors or roles to the API", async ({ request }) => {
		const usersResponse = await request.get("/api/users");
		expect(usersResponse.ok()).toBe(true);
		const users = (await usersResponse.json()) as { id: string }[];
		const targetUserId = users[0]?.id;
		if (targetUserId === undefined) {
			throw new Error("The seeded target user is missing.");
		}

		const unknownActorResponse = await request.put(`/api/users/${targetUserId}/roles`, {
			data: { roleIds: [] },
			headers: { "x-actor-user-id": input.unknownActorId },
		});
		expect(unknownActorResponse.status()).toBe(404);

		const unknownRoleResponse = await request.put(`/api/users/${targetUserId}/roles`, {
			data: { roleIds: [input.unknownRoleId] },
			headers: { "x-actor-user-id": targetUserId },
		});
		expect(unknownRoleResponse.status()).toBe(400);
	});
});
