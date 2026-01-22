import postcssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";
import tailwindcss from "tailwindcss";
import postcssNesting from "tailwindcss/nesting/index.js";

export default {
  plugins: [
    postcssImport(),
    postcssNesting(),
    tailwindcss(),
    postcssPresetEnv({
      stage: 1,
      features: {
        "cascade-layers": false,
      },
    }),
  ],
};
