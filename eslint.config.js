import globals from "globals";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
        "no-unused-vars": "off",
        "no-undef": "off",
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {
        globals: {
            ...globals.node
        }
    }
  }
];