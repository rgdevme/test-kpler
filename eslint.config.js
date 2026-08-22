import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import vue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"**/dist/**",
			"**/node_modules/**",
			"**/playwright-report/**",
			"**/test-results/**",
			"packages/server/src/generated/**",
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	...vue.configs["flat/recommended"],
	{
		files: ["**/*.{ts,vue}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				parser: tseslint.parser,
				sourceType: "module",
			},
		},
		rules: {
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-import-type-side-effects": "error",
			"@typescript-eslint/no-non-null-assertion": "error",
			"no-console": ["error", { allow: ["warn", "error"] }],
			"vue/block-order": ["error", { order: ["script", "template", "style"] }],
			"vue/component-api-style": ["error", ["script-setup"]],
			"vue/component-name-in-template-casing": ["error", "PascalCase"],
			"vue/multi-word-component-names": "off",
		},
	},
	{
		files: ["packages/server/**/*.ts", "packages/e2e/**/*.ts"],
		languageOptions: {
			globals: globals.node,
		},
	},
	{
		files: ["packages/server/src/**/*.module.ts"],
		rules: {
			"@typescript-eslint/no-extraneous-class": "off",
		},
	},
	{
		files: ["packages/server/src/**/*.controller.ts", "packages/server/src/**/*.service.ts"],
		rules: {
			"@typescript-eslint/consistent-type-imports": "off",
		},
	},
	eslintConfigPrettier,
);
