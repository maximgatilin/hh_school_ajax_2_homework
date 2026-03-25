import eslint from '@eslint/js';
import globals from 'globals';

export default [
    eslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        rules: {
            // Базовые
            curly: 'error',
            eqeqeq: 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'no-console': [
                'error',
                {
                    allow: ['warn', 'error'],
                },
            ],

            // Чистота кода
            'no-unreachable': 'error',
            'no-else-return': 'error',
            'prefer-template': 'error',
            'prefer-arrow-callback': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            'object-shorthand': 'error',
            'no-unneeded-ternary': 'error',

            // Безопасность
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'require-await': 'error',
        },
    },
    {
        ignores: [
            'node_modules/**',
            'build/**',
            'dist/**',
            'tools/**',
            'package-lock.json',
            '.yarn/**',
            '.prettierrc.cjs',
            'vite.config.js',
        ],
    },
];
