/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  transform: {},
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    }
  }
};