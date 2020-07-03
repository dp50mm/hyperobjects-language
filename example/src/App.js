import React from 'react'
import { Frame, Model, Group, Point } from 'hyperobjects-language'
import 'hyperobjects-language/dist/index.css'

let newModel = new Model("test-model")
console.log(newModel)

newModel.addEditableGeometry("test-points",
  new Group([
    {x: 100, y: 500},
    {x: 200, y: 400},
    {x: 300, y: 600},
  ]).r(10)
)

const App = () => {
  return (
    <div>
      <h1>Hyperobjects language library - Test Suite</h1>
      <div style={{margin: 100, padding: 5, border: '1px solid grey'}}>
        <Frame
          model={newModel}
          editable={true}
          width={500}
          height={500}
          />
      </div>
    </div>
  )
}

export default App
