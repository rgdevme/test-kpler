type DatabaseError = {
	code?: string;
};

const isDatabaseError = (value: unknown): value is DatabaseError =>
	typeof value === "object" && value !== null && "code" in value;

export const isUniqueViolation = (value: unknown): boolean =>
	isDatabaseError(value) && value.code === "23505";
