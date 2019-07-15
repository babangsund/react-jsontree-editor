import babel from "rollup-plugin-babel"
import { uglify } from "rollup-plugin-uglify"
import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"

import pkg from "./package.json"

const input = "modules/index.js"
const globals = {
  react: "React",
  "lodash-es": "_",
  "react-dnd": "ReactDnd",
  "react-dnd-html5-backend": "HTML5Backend"
}
const external = Object.keys(globals).concat("@babel/runtime")

const esm = {
  input,
  external,
  output: { globals, format: "esm", file: `dist/esm/${pkg.name}.js` },
  plugins: [
    resolve(),
    babel({
      runtimeHelpers: true,
      plugins: [["@babel/transform-runtime", { useESModules: true }]]
    })
  ]
}

const cjs = {
  input,
  external,
  output: { file: `dist/cjs/${pkg.name}.production.js`, format: "cjs" },
  plugins: [babel(), uglify()]
}

const umd = [
  {
    input,
    output: {
      globals,
      format: "umd",
      name: "ReactJsonEditor",
      file: `dist/umd/${pkg.name}.development.js`
    },
    external,
    plugins: [
      babel({
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      }),
      resolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          "node_modules/react-is/index.js": ["isValidElementType"]
        }
      })
    ]
  },
  {
    input,
    output: {
      globals,
      format: "umd",
      name: "ReactJsonEditor",
      file: `dist/umd/${pkg.name}.production.js`
    },
    external,
    plugins: [
      babel({
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime", { useESModules: true }]]
      }),
      resolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          "node_modules/react-is/index.js": ["isValidElementType"]
        }
      }),
      uglify()
    ]
  }
]

export default [...umd, cjs, esm]
