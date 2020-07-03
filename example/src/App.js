import React, { useState, useEffect } from 'react'
import { Frame, Model, Group, Point } from 'hyperobjects-language'
import _ from 'lodash'
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

let i = 0

const App = () => {
  const [modelHasUpdated, setModelHasUpdated] = useState(false)
  useEffect(() => {
    if(modelHasUpdated) {
      const timer = setTimeout(() => {
        setModelHasUpdated(false)
      })
      return () => clearTimeout(timer)
    }
  })
  return (
    <div>
      <h1>Hyperobjects language library - Test Suite</h1>
      <div style={{ display: 'flex'}}>
        <div style={{margin: 10, padding: 0, border: '1px solid rgb(230,230,230)'}}>
          <Frame
            model={newModel}
            editable={true}
            width={800}
            height={800}
            modelHasUpdated={modelHasUpdated}
            updateParameters={(parameters) => {
              console.log(parameters)
              newModel.geometries = parameters
            }}
            onClickCallback={(point) => {
              console.log(point)
              i += 1
              newModel.addEditableGeometry(`points-${i}`,
                new Group([point])
              )
              setModelHasUpdated(true)
            }}
            />
        </div>
      </div>
      <div>
        {_.keys(newModel.geometries).map(geometryKey => {
          return (
            <p>{geometryKey}</p>
          )
        })}
      </div>
    </div>
  )
}

export default App
