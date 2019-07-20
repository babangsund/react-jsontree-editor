# react-jsontree-editor

A JSON tree editor built with React

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-jsontree-editor

Using [yarn](https://yarnpkg.com/):

    $ yarn add react-jsontree-editor


Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// Using ES6 Modules
import { Editor } from "react-jsontree-editor"
// using CommonJS modules
const Editor = require("react-jsontree-editor").Editor
```

## Usage

The assumed tree structure looks like this:

* `id` is required for the React `key`
* `items` is an array of children

Any other properties are preserved, but ignored.
Example:

```javascript
const data = {
  id: "1",
  label: "hello world",
  items: [
    {
      id: "1-1",
      label: "First",
      items: [
        {
          label: "First-Second"
        }
      ]
    },
    {
      id: "1-2",
      label: "Second",
      items: [
        {
          label: "Second-Second"
        }
      ]
    },
    {
      id: "1-3",
      label: "Third",
      items: [
        {
          label: "Third-Second"
        }
      ]
    }
  ]
}

```

#### Basic

```jsx
import { Editor } from "react-jsontree-editor"

function Basic() {
  const [node, onChange] = React.useState()
  return <Editor node={node} onChange={onChange} renderNode={renderNode} />
}
```

#### With history

```jsx
function History() {
  const [node, { onChange, onUndo, onRedo }] = useHistory(data)
  return (
    <>
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
      <Editor node={node} onChange={onChange} renderNode={renderNode} />
    </>
  )
}
```

## Development

1. Clone the repository

2. Install dependencies `npm|yarn install`

3. Build and watch for changes `npm|yarn run watch`

4. Fire up storybook `npm|yarn run storybook`

---

### This repository is flow typed

#### Props

```flow
type DragDroppableProps = {
  isOver: boolean,
  canDrop: boolean
}

type EditorProps = {|
  onChange: JsonType => void
|}

type NodeProps = {|
  style?: {},
  node: JsonType,
  className?: string,
  renderNode: RenderNodeParameters,
  Label: React.AbstractComponent<{}>,
  Indented: React.AbstractComponent<{}>,
  DragDroppable: React.AbstractComponent<DragDroppableProps>
|}
```

#### renderNode parameters

```flow
type RenderNodeParameters = ({
  node: JsonType,
  onToggle: void => void
}) => React.AbstractComponent<{}>
```

## Credits

React JSON Tree Editor is built and maintained by [**babangsund**](https://github.com/babangsund).
[@github](https://github.com/babangsund).
[@twitter](https://twitter.com/babangsund).
