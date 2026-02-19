/**
 * Role credentials configuration
 * This file only exports user credentials, NO setup tests
 */
export const USERS = {
    STANDARD_USER: {
        username: 'standard_user',
        password: 'secret_sauce',
        role: 'standard-user',
        storageFile: '.auth/standard-user.json',
    },
    PROBLEM_USER: {
        username: 'problem_user',
        password: 'secret_sauce',
        role: 'problem-user',
        storageFile: '.auth/problem-user.json',
    },
} as const;