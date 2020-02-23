import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import { eslint } from "rollup-plugin-eslint";
import { terser } from "rollup-plugin-terser";

const isProd = process.env.NODE_ENV === "production";
const extensions = [".js", ".ts", ".tsx"];

export default {
  input: "src/index.tsx",
  output: {
    file: "dist/index.js",
    format: "amd"
  },
  plugins: [
    eslint(),
    postcss({
      plugins: [],
      minimize: true,
      sourceMap: "inline"
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        isProd ? "production" : "development"
      )
    }),
    image(),
    resolve({
      extensions,
      modulesOnly: false
    }),
    commonjs({
      include: /node_modules/,
      // For prettier/parser-typescript
      ignore: ["@microsoft/typescript-etw"]
    }),
    babel({
      extensions,
      exclude: /node_modules/,
      babelrc: false,
      runtimeHelpers: true,
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
      ]
    }),
    isProd && terser()
  ]
};
