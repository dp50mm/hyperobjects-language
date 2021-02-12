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
            {x: 100, y: 100},
            {x: 1500, y: 1000}
        ]).export(true)
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
                exportTypes={['pdf']}
                showBounds={true}
                showGridLines={true}
                />
        </div>
    )
}

export default ExportPDFTest