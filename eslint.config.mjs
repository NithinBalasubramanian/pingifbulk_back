import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    rules: {
        "no-unused-vars": 0,
    }
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];