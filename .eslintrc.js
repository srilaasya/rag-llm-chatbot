// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'eslint:recommended', // Use the recommended rules from ESLint
        'plugin:react/recommended', // Use the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // Use the recommended rules from @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended', // Use Prettier for code formatting
    ],
    parserOptions: {
        ecmaVersion: 2020, // Allows modern ECMAScript features
        sourceType: 'module', // Allows using import/export statements
        ecmaFeatures: {
            jsx: true, // Allows JSX
        },
    },
    settings: {
        react: {
            version: 'detect', // Automatically detect the react version
        },
    },
    rules: {
        'react/react-in-jsx-scope': 'off', // Not needed with React 17+
        '@typescript-eslint/no-explicit-any': 'warn', // Warn on usage of 'any' type
        'prettier/prettier': 'error', // Make Prettier errors show as ESLint errors
    },
    env: {
        browser: true, // Enable browser globals
        es2021: true, // Enable ES2021 globals
        node: true, // Enable Node.js globals
    },
};