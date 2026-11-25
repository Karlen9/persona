/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {jsx: true}
	},
	env: {browser: true, node: true, es2022: true},
	plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks', 'unused-imports'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'plugin:@next/next/recommended',
		'prettier'
	],
	settings: {
		react: {version: 'detect'},
		'import/resolver': {typescript: {project: './tsconfig.json'}},
		'import/internal-regex': '^@/'
	},
	ignorePatterns: [
		'node_modules/',
		'.next/',
		'.claude/',
		'docs/',
		'public/',
		'file.tsx',
		'next-env.d.ts',
		'bun.lock',
		'src/payload-types.ts',
		'src/app/(payload)/**/importMap.js',
		'src/migrations/'
	],
	rules: {
		'react/prop-types': 'off',
		'react/jsx-curly-brace-presence': ['warn', {props: 'always', children: 'always', propElementValues: 'always'}],
		'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{prefer: 'type-imports', fixStyle: 'separate-type-imports'}
		],
		'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true}
		],
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_'}
		],
		'@typescript-eslint/naming-convention': [
			'error',
			{selector: 'typeAlias', format: ['PascalCase'], prefix: ['T']},
			{selector: 'interface', format: ['PascalCase'], prefix: ['I']}
		],
		'import/order': [
			'error',
			{
				groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
				'newlines-between': 'always'
			}
		],
		'import/no-duplicates': 'error'
	},
	overrides: [
		{
			files: ['*.js', '*.mjs', '*.cjs'],
			rules: {'@typescript-eslint/no-require-imports': 'off', '@typescript-eslint/no-var-requires': 'off'}
		}
	]
};
