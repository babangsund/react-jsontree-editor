import { configure } from "@storybook/react"

function loadStories() {
  const req = require.context("../modules", true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
