export const strings = {
	app: {
		eyebrow: "Identity & access management",
		name: "Access Portal"
	},
	navigation: {
		audit: "Events",
		users: "Users"
	},
	common: {
		cancel: "Cancel",
		empty: "Nothing to show yet.",
		loading: "Loading…",
		retry: "Try again",
		save: "Save changes"
	},
	users: {
		addAction: "Add user",
		actorLabel: "Acting user",
		addDescription: "Create an identity and grant its starting access.",
		addHeading: "Add a user",
		create: "Create user",
		displayName: "Display name",
		displayNamePlaceholder: "Alex Analyst",
		duplicateEmail: "A user with this email already exists.",
		editDescription: "Update this identity and its assigned access.",
		editHeading: "Edit user",
		editUserLabel: (displayName: string) => `Edit ${displayName}`,
		email: "Email address",
		emailPlaceholder: "alex.analyst@example.com",
		empty: "No users have been provisioned.",
		heading: "People and access",
		loadError: "Users could not be loaded.",
		roles: "Roles",
		selectActor: "Select an acting user",
		subheading: "Provision identities, review access, and make every change attributable.",
		user: "User",
		validation: {
			displayName: "Enter a display name with at least 2 characters.",
			email: "Enter a valid email address.",
			generic: "The change could not be saved. Review the form and try again.",
			unknownActor: "The selected acting user is unavailable."
		}
	},
	audit: {
		action: "Action",
		after: "After",
		actor: "Changed by",
		before: "Before",
		empty: "No access changes have been recorded.",
		heading: "Audit history",
		loadError: "Audit history could not be loaded.",
		subheading: "An immutable, newest-first record of provisioning activity.",
		target: "Target user",
		time: "When",
		actions: {
			ROLES_CHANGED: "Roles changed",
			USER_CREATED: "User created"
		}
	}
} as const
