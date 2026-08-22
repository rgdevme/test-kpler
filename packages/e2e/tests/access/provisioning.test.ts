import { expect, test } from "@playwright/test";

import input from "./input.json" with { type: "json" };
import seed from "./seed.json" with { type: "json" };

test.describe.configure({ mode: "serial" });

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
		await page.goto("/users");
		await page.getByRole("combobox", { name: "Acting user" }).selectOption({
			label: seed.actor.displayName,
		});

		const addUserPanel = page.locator("section").filter({
			has: page.getByRole("heading", { name: "Add a user" }),
		});
		await addUserPanel.getByLabel("Display name").fill(input.newUser.displayName);
		await addUserPanel.getByLabel("Email address").fill(input.newUser.email);
		await addUserPanel.getByRole("checkbox", { name: input.newUser.initialRole }).check();
		await addUserPanel.getByRole("button", { name: "Create user" }).click();

		await expect(page.getByText("User created and audit event recorded.")).toBeVisible();
		await expect(page.getByText(input.newUser.email)).toBeVisible();

		await addUserPanel.getByLabel("Display name").fill(input.newUser.displayName);
		await addUserPanel.getByLabel("Email address").fill(input.newUser.email);
		await addUserPanel.getByRole("button", { name: "Create user" }).click();
		await expect(page.getByText("A user with this email already exists.")).toBeVisible();
	});

	test("can replace roles and inspect the resulting audit event", async ({ page }) => {
		await page.goto("/users");
		await page.getByRole("combobox", { name: "Acting user" }).selectOption({
			label: seed.actor.displayName,
		});
		await page
			.getByRole("button", { name: `Edit access for ${input.newUser.displayName}` })
			.click();

		const roleEditor = page.locator("section").filter({
			has: page.getByRole("heading", { name: input.newUser.displayName }),
		});
		await roleEditor.getByRole("checkbox", { name: input.newUser.initialRole }).uncheck();
		for (const role of input.replacementRoles) {
			await roleEditor.getByRole("checkbox", { name: role }).check();
		}
		await roleEditor.getByRole("button", { name: "Save changes" }).click();
		await expect(page.getByText("Access updated and audit event recorded.")).toBeVisible();

		await page.getByRole("link", { name: "Audit log" }).click();
		const changedRow = page
			.getByRole("row")
			.filter({
				has: page.getByRole("cell", { exact: true, name: "Roles changed" }),
			})
			.filter({ hasText: seed.actor.displayName })
			.filter({ hasText: input.newUser.displayName });
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
