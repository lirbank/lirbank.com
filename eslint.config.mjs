import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/", "next-env.d.ts"] },
  {
    rules: {
      eqeqeq: "error",
      "guard-for-in": "error",
      "no-duplicate-imports": "error",
      "no-useless-rename": "error",
      "object-shorthand": "error",
      "react/jsx-no-leaked-render": "error",
      "react/no-unescaped-entities": "off",
      "react/self-closing-comp": "error",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
