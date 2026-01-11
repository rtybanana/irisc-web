/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset:"ts-jest/presets/js-with-ts",
  testEnvironment: 'jsdom',
  moduleDirectories: [
    "node_modules",
    "<rootDir>"
  ],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@utils": "<rootDir>/tests/utilities"
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    }
  }
};