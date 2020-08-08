import React, { useState, useEffect } from 'react'
import { Frame, Model, Group, Path } from 'hyperobjects-language'
import _ from 'lodash'

let newModel = new Model("test-model")

newModel.addEditableGeometry("test-points",
  new Group([
    {x: 100, y: 500},
    {x: 200, y: 400},
    {x: 300, y: 600},
  ]).r(10)
)

newModel.addEditableGeometry('test-path',
  new Path(_.range(10).map(val => {
    return {
      x: 10 + val * 50,
      y: 300 + Math.random() * 500
    }
  })).r(5).controlsFill("black").controlsFillOpacity(0.3).controlsStrokeOpacity(0).controlsStroke('transparent')
)

newModel.addProcedure('test-procedure',
  (self) => {
    let returns = []
    // let testArray = _.range(10)
    for (var i = 0; i < 10; i++) {
      returns.push(
        self.geometries['test-path'].clone()
          .rotate(i * 0.01, self.geometries['test-path'].center())
          .stroke('rgb(120,20,150)')
          .strokeOpacity(1)
          .strokeWidth(2)
      )
    }
    // let newPath = new self.generators.path([{x: 50, y: 500}, {x: 800, y: 500}])
    return returns
  }
)

let extractedProcedures = newModel.extractProcedures()
console.log(extractedProcedures)
newModel.importProcedures(extractedProcedures)
console.log(newModel)
let testModel = new Model('test-2')

testModel.geometries = newModel.geometries
testModel.importProcedures(extractedProcedures)

let i = 0


const ExportImportTest = () => {
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
        <div className='export-import-test'>
            <div style={{ display: 'flex'}}>
                <div style={{width: 200}}>
                {_.keys(newModel.geometries).map(geometryKey => {
                    return (
                    <p key={geometryKey}>{geometryKey}</p>
                    )
                })}
                </div>
                <div style={{margin: 10, padding: 0, border: '1px solid rgb(230,230,230)'}}>
                <Frame
                    model={newModel}
                    editable={true}
                    width={800}
                    height={800}
                    modelHasUpdated={modelHasUpdated}
                    updateParameters={(parameters) => {
                    newModel.geometries = parameters
                    }}
                    actionsCallback={(element, action) => {
                    console.log('clicked on: ', element, ' action: ', action)
                    newModel.editableGeometriesList.forEach(key => {
                        newModel.geometries[key].r(10)
                    })
                    newModel.geometries[element.key].r(20)
                    // setModelHasUpdated(true)
                    }}
                    onClickCallback={(point) => {
                    console.log(point)
                    if(false) {
                        newModel.editableGeometriesList.forEach(key => {
                        newModel.geometries[key].r(10)
                        })
                        i += 1
                        newModel.addEditableGeometry(`points-${i}`,
                        new Group([point]).r(10)
                        )
                        setModelHasUpdated(true)
                    }
                    }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ExportImportTest