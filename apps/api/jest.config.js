module.exports = {
  rootDir: '.',
  moduleNameMapper: {
    "^@app/(.*)": "<rootDir>/src/$1"
  },
  moduleFileExtensions: ["js", "json", "ts", "node"],
  testRegex: ".spec.ts$",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/e2e"
  ],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  }
};
