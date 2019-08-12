
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "moduleNameMapper": {
    "^dvaApp(.*)$": "<rootDir>/src/dvaApp/index.ts",
    "^models(.*)$": "<rootDir>/src/models$1",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^styles(.*)$": "<rootDir>/src/styles$1",
    "^variables(.*)$": "<rootDir>/src/styles/variables.scss",
  },
  "resolver": null
}