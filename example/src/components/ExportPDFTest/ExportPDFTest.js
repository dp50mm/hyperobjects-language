import React, { useState } from 'react'
import {
    Frame,
    Model,
    Path
} from 'hyperobjects-language'

let model = new Model("pdf-export-test")

model.setSize({
    width: 2000,
    height: 5500
})

model.addProcedure(
    "test-path",
    (self) => {
        return new Path([
            {x: 100, y: 100, q: {x: 0, y: 1000}},
            {x: 1500, y: 1000, c: [{x: 1000, y: 0}, {x: 1000, y: 2000}]},
            {x: 300, y: 400, q: {x: 500, y: 1500}}
        ]).export(true).closed(true)
    }
)

model.addProcedure(
    "test-path-2",
    (self) => {
        return new Path([
            {x: 100, y: 100, q: {x: 0, y: 1000}},
            {x: 1500, y: 1000, c: [{x: 1000, y: 0}, {x: 1000, y: 2000}]},
            {x: 300, y: 400, c: [{x: 1500, y: 500}, {x: 0, y: 1500}]}
        ]).export(true).closed(true).translate({x: 0, y: 1000})
    }
)

const ExportPDFTest = () => {
    return (
        <div className='export-pdf-test'>
            <p>Export PDF test</p>
            <Frame
                model={model}
                editable={true}
                width={800}
                height={800}
                exportControls={true}
                exportTypes={['pdf', "png", "svg"]}
                renderType={'SVG'}
                showBounds={true}
                showGridLines={true}
                />
        </div>
    )
}

export default ExportPDFTest