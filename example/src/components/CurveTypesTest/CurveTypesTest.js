import React from 'react'
import { ControlledEditor as MonacoEditor } from '@monaco-editor/react'
import { Model, Path, Frame } from 'hyperobjects-language'

var quadraticCurveDescription = `const points = [
    {   x: 100, y: 100 },
    {
        x: 900, y: 100,
        q: {
            x: 500, y: 800
        }
    }
]`

var quadraticModel = new Model('quadratic')
quadraticModel.addEditableGeometry(
    'quadratic-curve',
    new Path([
        {   x: 100, y: 100 },
        {
            x: 900, y: 100,
            q: {
                x: 500, y: 800
            }
        }
    ])
)

var cubicCurveDescription = `const points = [
    {x: 100, y: 500},
    {
        x: 900, y: 500,
        c: [
            {x: 200, y: 900},
            {x: 800, y: 100}
        ]
    }
]`

var cubicModel = new Model('cubic')
cubicModel.addEditableGeometry(
    'cubic',
    new Path([
        {x: 100, y: 500},
        {
            x: 900, y: 500,
            c: [
                {x: 200, y: 900},
                {x: 800, y: 100}
            ]
        }
    ])
)



const CurveTypesTest = () => {
    return (
        <div className='curve-types-test'>
            <h4>Quadratic curve</h4>
            <div style={{display: 'flex'}}>
            <MonacoEditor
                value={quadraticCurveDescription}
                width={500}
                height={500}
                />
            <Frame
                model={quadraticModel}
                width={500}
                height={500}
                editable={true}
                />
            </div>
            <h4>Cubic curve</h4>
            <div style={{display: 'flex'}}>
            <MonacoEditor
                value={cubicCurveDescription}
                width={500}
                height={500}
                />
            <Frame
                model={cubicModel}
                width={500}
                height={500}
                editable={true}
                />
            </div>
        </div>
    )
}

export default CurveTypesTest