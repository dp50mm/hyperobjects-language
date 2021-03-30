import React from "react"
import {
    Model,
    Path,
    Frame,
    Input
} from "hyperobjects-language"

var model = new Model("path-smoothing-test")

model.addInput(
    "step-size",
    new Input([0, 1], 0.1)
)

model.addEditableGeometry(
    "source",
    new Path([
        {x: 100, y: 100},
        {x: 700, y: 100},
        {x: 300, y: 400},
        {x: 600, y: 800},
        {x: 100, y: 800}
    ]).closed(true).fillOpacity(0.1).strokeOpacity(0.2)
)

model.addProcedure(
    "smoothed-path",
    (self) => {
        var source = self.geometries['source']
        var stepSize = self.inputs['step-size'].value
        var smoothedPath = source.smoothPath(100, stepSize)
            .closed(true)
            .stroke("blue")
            .strokeOpacity(1)
            .strokeWidth(2)
        return smoothedPath
    }
)

const PathSmoothingTest = () => {
    return (
        <div className='path-smoothing-test'>
            <Frame
                model={model}
                editable={true}
                width={600}
                height={600}
                />
        </div>
    )
}

export default PathSmoothingTest