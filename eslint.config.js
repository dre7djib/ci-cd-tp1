const js = require("@eslint/js");

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly"
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },
  js.configs.recommended
];

