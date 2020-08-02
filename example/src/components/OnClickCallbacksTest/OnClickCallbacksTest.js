import React, { useState } from 'react'
import {
    Frame,
    Model,
    Group,
    Path
} from 'hyperobjects-language'
import {
    Button
} from 'semantic-ui-react'


let newModel = new Model("callback-test-model")

let testPoints = new Group([
    {x: 100, y: 500},
    {x: 200, y: 400},
    {x: 300, y: 600},
  ]).r(10)

testPoints.showBounds = true

newModel.addEditableGeometry("test-points",
  testPoints
)

newModel.addEditableGeometry("test-path",
  new Path([
    {x: 200, y: 300},
    {x: 400, y: 200},
    {x: 250, y: 800},
  ]).r(10)
)

newModel.addProcedure(
    "output-path",
    (self) => {
        return new Path([
            {x: 500, y: 100},
            {x: 500, y: 900}
        ]).stroke("purple")
    }
)

const OnClickCallbacksTest = () => {
    const [clickState, setClickState] = useState("select")
    let onClickCallback = false
    let onGeometryClickCallback = false
    let onPointClickCallback = false
    if(clickState === 'select') {
        onClickCallback = (p, i) => console.log(p, i)
        onGeometryClickCallback = (g) => console.log(g)
        onPointClickCallback = (g, p, i) => console.log(g, p, i)
    }
    return (
        <div className='on-click-callbacks-test'>
            <div style={{padding: 50}}>
                <Button.Group>
                    <Button toggle active={clickState === 'move'} onClick={() => setClickState("move")}>Move</Button>
                    <Button toggle active={clickState === 'select'} onClick={() => setClickState("select")}>Select</Button>
                </Button.Group>
            </div>
            <Frame
                model={newModel}
                editable={true}
                width={800}
                height={800}
                onClickCallback={onClickCallback}
                onGeometryClickCallback={onGeometryClickCallback}
                onPointClickCallback={onPointClickCallback}
                />
        </div>
    )
}

export default OnClickCallbacksTest