/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset:"ts-jest/presets/js-with-ts",
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