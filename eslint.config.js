import globals from "globals";

import tseslint from "@typescript-eslint/eslint-plugin";

import tsParser from "@typescript-eslint/parser";

import nextConfig from "eslint-config-next";

import prettierPlugin from "eslint-plugin-prettier";

export default [

  {

    files: ["**/*.{js,jsx,ts,tsx}"],

    languageOptions: {

      ecmaVersion: "latest",

      sourceType: "module",

      parser: tsParser,

      globals: {

        ...globals.browser,

        ...globals.node,

      },

    },

    plugins: {

      "@typescript-eslint": tseslint,

      prettier: prettierPlugin,

    },

    rules: {

      "prettier/prettier": "warn",

      "react/no-unescaped-entities": "off",

      "@next/next/no-page-custom-font": "off",

    },

  },

  // TypeScript recommended rules

  ...tseslint.configs?.recommended ?? [],

  // Next.js recommended config

  ...nextConfig,

];

