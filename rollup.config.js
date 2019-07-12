import babel from "rollup-plugin-babel"
import replace from "rollup-plugin-replace"
import { uglify } from "rollup-plugin-uglify"
import commonjs from "rollup-plugin-commonjs"
import nodeResolve from "rollup-plugin-node-resolve"

import pkg from "./package.json"

const esm = {
  input: "modules/index.js",
  output: { format: "esm", file: `esm/${pkg.name}.js`, globals: { react: "React" } },
  external: "react",
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: /node_modules/,
      plugins: [["@babel/transform-runtime"]]
    }),
    replace({ "process.env.BUILD_FORMAT": JSON.stringify("esm") })
  ]
}

const cjs = [
  {
    input: "modules/index.js",
    output: { format: "cjs", esModule: false, file: `cjs/${pkg.name}.development.js` },
    external: "react",
    plugins: [
      babel({ exclude: /node_modules/ }),
      replace({
        "process.env.BUILD_FORMAT": JSON.stringify("cjs"),
        "process.env.NODE_ENV": JSON.stringify("development")
      })
    ]
  },
  {
    input: "modules/index.js",
    output: { file: `cjs/${pkg.name}.production.js`, format: "cjs" },
    external: "react",
    plugins: [
      babel({ exclude: /node_modules/ }),
      replace({
        "process.env.BUILD_FORMAT": JSON.stringify("cjs"),
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      uglify()
    ]
  }
]

const umd = [
  {
    input: "modules/index.js",
    output: {
      format: "umd",
      name: "ReactJsonEditor",
      globals: { react: "React" },
      file: `umd/${pkg.name}.development.js`
    },
    external: "react",
    plugins: [
      babel({
        runtimeHelpers: true,
        exclude: /node_modules/,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          "node_modules/react-is/index.js": ["isValidElementType"]
        }
      }),
      replace({
        "process.env.BUILD_FORMAT": JSON.stringify("umd"),
        "process.env.NODE_ENV": JSON.stringify("development")
      })
    ]
  },
  {
    input: "modules/index.js",
    output: {
      format: "umd",
      name: "ReactJsonEditor",
      globals: { react: "React" },
      file: `umd/${pkg.name}.production.js`
    },
    external: "react",
    plugins: [
      babel({
        runtimeHelpers: true,
        exclude: /node_modules/,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          "node_modules/react-is/index.js": ["isValidElementType"]
        }
      }),
      replace({
        "process.env.BUILD_FORMAT": JSON.stringify("umd"),
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      uglify()
    ]
  }
]

export default [...cjs, ...umd, esm]
