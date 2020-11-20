import React, { useState, useEffect } from 'react'
import {
    Frame,
    Model,
    Path,
    Circle
} from 'hyperobjects-language'
import _ from 'lodash'
let model = new Model("gcode-test")

let circle = new Circle({
    x: 110,
    y: 110
}, 70, 20).r(3)

model.setSize({
    width: 220,
    height: 220
})

model.addEditableGeometry(
    'path',
    circle
)

model.addEditableGeometry(
    'small-circle',
    new Circle(
        {x: 110, y: 110},
        50,
        6
    ).r(3)
)

model.gcode.initialize(15)

model.gcode.addMove({
    geometry: circle,
    layerRange: [0, 15]
})

model.gcode.addGenerator(
    "create-shapes",
    (self) => {
        console.log(self)
        return {
            geometry: self.geometries['small-circle'],
            layerRange: [0, 10]
        }
    }
)

const GcodeTest = () => {
    return (
        <div className='gcode-test'>
            <h2>Gcode test</h2>
            <Frame
                model={model}
                editable={true}
                width={800}
                height={800}
                exportControls={true}
                showBounds={true}
                showGridLines={true}
                />
        </div>
    )
}

export default GcodeTest