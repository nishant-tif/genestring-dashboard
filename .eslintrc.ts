import type { Linter } from "eslint";

const config: Linter.Config = {
  root: true,

  parser: "@typescript-eslint/parser",

  plugins: ["@typescript-eslint", "react", "react-hooks"],

  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
  ],

  rules: {
    // 🚫 Disable TypeScript strict rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",

    // 🚫 Disable React Hook warnings
    "react-hooks/rules-of-hooks": "off",
    "react-hooks/exhaustive-deps": "off",

    // 🚫 Disable general JS warnings
    "no-unused-vars": "off",
    "no-console": "off",

    // 🚫 Disable Next.js image rule
    "@next/next/no-img-element": "off",

    // 🚫 Disable prop-types requirement
    "react/prop-types": "off",
  },
};

export default config;
