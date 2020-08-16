import React from 'react'
import {
    Frame,
    Model,
    Path
} from 'hyperobjects-language'

let model = new Model("path display features")

let testPath = new Path(
    [
        {x: 100, y: 100},
        {x: 400, y: 100, q: {x: 500, y: 200}},
        {x: 400, y: 800},
        {x: 500, y: 400, c: [
            {x: 300, y: 200},
            {x: 800, y: 500}
            ]
        },
        {x: 400, y: 200},
    ]
)

testPath.showSegmentLengthLabels = true

model.addEditableGeometry(
    "path",
    testPath
)

const PathDisplayFeaturesTest = ({

}) => {
    return (
        <div className='path-display-features-test'>
            <Frame
                model={model}
                width={800}
                height={800}
                editable={true}
                />
        </div>
    )
}

export default PathDisplayFeaturesTest