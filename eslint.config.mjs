import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

export default defineConfig([
  /**
   * Ignore files
   */
  {
    ignores: [".next/*", "**/*.{js,mjs,cjs,jsx}"],
  },

  /**
   * Next.js default config
   */
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  /**
   * Next.js overrides
   *
   * https://nextjs.org/docs/pages/api-reference/config/eslint
   */
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },

  /**
   * ESLint
   *
   * https://eslint.org/docs/latest/rules
   * https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/
   */
  {
    rules: {
      /** https://eslint.org/docs/latest/rules/eqeqeq */
      eqeqeq: "error",
      /** https://eslint.org/docs/latest/rules/guard-for-in */
      "guard-for-in": "error",
      /** https://eslint.org/docs/latest/rules/no-duplicate-imports */
      "no-duplicate-imports": "error",
      /** https://eslint.org/docs/latest/rules/no-useless-rename */
      "no-useless-rename": "error",
      /** https://eslint.org/docs/latest/rules/object-shorthand */
      "object-shorthand": "error",
    },
  },

  /**
   * TypeScript - Strict & stylistic presets
   *
   * https://typescript-eslint.io/getting-started/typed-linting/
   *
   * https://typescript-eslint.io/users/configs#strict-type-checked
   * https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslintrc/strict-type-checked.ts
   * https://typescript-eslint.io/users/configs#stylistic-type-checked
   * https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslintrc/stylistic-type-checked.ts
   */
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    /**
     * TypeScript - Custom rule overrides
     *
     * https://typescript-eslint.io/rules/
     */
    rules: {
      /** https://typescript-eslint.io/rules/no-misused-promises/ */
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      /** https://typescript-eslint.io/rules/no-unused-vars/ */
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
      /**
       * https://typescript-eslint.io/rules/restrict-template-expressions/
       * https://github.com/typescript-eslint/typescript-eslint/blob/445514aa1c9a2927051d73a7c0c4a1d004a7f855/packages/eslint-plugin/src/configs/eslintrc/strict-type-checked.ts#L93-L103
       */
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowAny: false,
          allowBoolean: false,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
      /** https://typescript-eslint.io/rules/only-throw-error/ */
      "@typescript-eslint/only-throw-error": [
        "error",
        { allow: ["NotFoundError"] },
      ],
    },
  },

  /**
   * React
   *
   * https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#flat-configs
   * https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#list-of-supported-rules
   */
  // pluginReact.configs.flat["jsx-runtime"],
  {
    rules: {
      /** https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md */
      "react/jsx-no-leaked-render": "error",
      /** https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md */
      "react/no-unescaped-entities": "off",
      /** https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md */
      "react/self-closing-comp": "error",
    },
  },
]);
