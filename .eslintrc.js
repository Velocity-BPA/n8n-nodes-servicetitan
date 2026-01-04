module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
		'prettier',
	],
	env: {
		node: true,
		es2020: true,
		jest: true,
	},
	rules: {
		// TypeScript rules
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-non-null-assertion': 'warn',

		// n8n specific rules
		'n8n-nodes-base/node-class-description-credentials-name-unsuffixed': 'off',
		'n8n-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'off',
		'n8n-nodes-base/node-param-display-name-miscased': 'off',

		// General rules
		'no-console': 'off',
		'prefer-const': 'error',
		'no-var': 'error',
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js', '!.eslintrc.js'],
};
