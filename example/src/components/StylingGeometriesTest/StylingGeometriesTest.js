import React, { useState } from 'react'
import {
    Model,
    Frame,
    Path
} from 'hyperobjects-language'

var model = new Model("styling-geometries-test")

model.addEditableGeometry(
    'source',
    new Path([
        {x: 200, y: 200},
        {x: 800, y: 200}
    ])
    .stroke("blue")
    .strokeWidth(3)
    .strokeDasharray(5)
)

model.addEditableGeometry(
    'source-2',
    new Path([
        {x: 200, y: 300},
        {x: 800, y: 300}
    ])
    .stroke("blue")
    .strokeWidth(3)
    .strokeDasharray(' 10 10 50 30')
)


model.addEditableGeometry(
    'source-3',
    new Path([
        {x: 200, y: 400},
        {x: 800, y: 400}
    ])
    .stroke("blue")
    .strokeWidth(3)
)

model.addProcedure(
    'source-1-test',
    (self) => {
        var source = self.geometries['source'].copy()
        return [
            source.copy().translate({x: 0, y: 10}).stroke("rgb(200,200,200)"),
            source.copy().translate({x: 0, y: 20}).stroke("rgb(50,000,200)").strokeDasharray(20).strokeWidth(1),
            source.copy().translate({x: 0, y: 30}).stroke("rgb(200,0,0)").strokeDasharray(0).strokeWidth(5),
        ]
    }
)


const StylingGeometriesTest = () => {
    return (
        <div className='styling-geometries-test'>
            <h2>Styling geometries</h2>
            <p>Testing applying styles to editable geometries and procedure output geometries.</p>
            <p>Testing both as editable geometries are rendered to SVG while generated geometries are rendered to canvas.</p>
            <p>Attributes to test:</p>
            <ul>
                <li>Stroke color</li>
                <li>Stroke opacity</li>
                <li>Stroke dash array</li>
                <li>Fill color</li>
                <li>Fill opacity</li>
                <li>General opacity</li>
            </ul>
            <div style={{width: 600}}>
            <Frame
                width={600}
                height={600}
                model={model}
                editable={true}
                maintainAspectRatio={true}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                />
            </div>
        </div>
    )
}

export default StylingGeometriesTest