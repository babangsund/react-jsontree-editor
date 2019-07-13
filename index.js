"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/react-json-editor.production.js")
} else {
  module.exports = require("./dist/cjs/react-json-editor.development.js")
}
