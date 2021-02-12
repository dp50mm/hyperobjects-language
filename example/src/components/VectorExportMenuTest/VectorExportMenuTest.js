import React from 'react'
import {
    Frame,
    Model,
    Circle,
    Group
} from 'hyperobjects-language'
import _ from 'lodash'

let model = new Model("export-menu-test")

model.addEditableGeometry(
    'points',
    new Group([
        {x: 300, y: 500},
        {x: 700, y: 500}
    ])
)

model.addProcedure(
    'circles',
    (self) => {
        var circles = []
        self.geometries['points'].points.forEach((p, i) => {
            _.range(5).forEach(val => {
                circles.push(new Circle(
                    p,
                    10 + val * 40,
                    3 + i * 2
                ).export(true))
            })
        })
        return circles
    }
)

const VectorExportMenuTest = () => {
    return (
        <div className='export-menu-test'>
            <h2>Export menu</h2>
            <p>Advanced menu for exporting SVG and PDF vector files.</p>
            <Frame
                model={model}
                editable={true}
                width={600}
                height={600}
                exportControls={true}
                showBounds={true}
                showGridLines={true}
                vectorExportMenu={true}
                showZoomControls={true}
                />
        </div>
    )
}

export default VectorExportMenuTest