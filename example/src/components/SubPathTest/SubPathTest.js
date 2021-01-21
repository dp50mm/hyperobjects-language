import React from 'react'
import {
    Path,
    Input,
    Model,
    Frame
} from 'hyperobjects-language'

var model = new Model('sub-path-test')

model.addInput(
    'start',
    new Input([0, 1], 0.1)
)
model.addInput(
    'end',
    new Input([0, 1], 0.9)
)

model.addEditableGeometry(
    'source',
    new Path([
        {x: 100, y: 900},
        {x: 100, y: 100, q: {x: 300, y: 500}},
        {x: 900, y: 100},
        {x: 900, y: 900, c: [
            {x: 500, y: 100},
            {x: 900, y: 500}
        ]}
    ])
)


model.addProcedure(
    'sub-path',
    (self) => {
        var source = self.geometries['source']
        var subPath = source.subPath(
            self.inputs['start'].value,
            self.inputs['end'].value
        ).stroke('rgb(0,200,180)').strokeWidth(10)
        return subPath
    }
)


const SubPathTest = () => {
    return (
        <div className='sub-path-test'>
            <p>Sub path test</p>
            <Frame
                width={500}
                height={500}
                model={model}
                editable={true}
                maintainAspectRatio={true}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                />
        </div>
    )
}

export default SubPathTest