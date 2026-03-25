import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';

export default tseslint.config(
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'coverage/**',
            'playwright-report/**',
            'test-results/**',
            'report/**',
        ],
    },

    js.configs.recommended,

    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
            },
        },
        rules: {
            'no-unused-vars': 'off',
            'no-empty-pattern': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            }],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'error',
        },
    },

    {
        files: ['**/*.spec.ts', '**/*.test.ts', 'tests/**/*.ts'],
        ...playwright.configs['flat/recommended'],
        rules: {
            'playwright/no-nested-step': 'warn',
            'playwright/no-wait-for-timeout': 'off',
            'playwright/expect-expect': 'off',
        },
    }
);