"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react-json-editor.production.js")
} else {
  module.exports = require("./cjs/react-json-editor.development.js")
}
