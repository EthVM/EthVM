module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier", "@vue/typescript"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    semi: 0
  },
  parserOptions: {
    parser: "typescript-eslint-parser"
  }
};
