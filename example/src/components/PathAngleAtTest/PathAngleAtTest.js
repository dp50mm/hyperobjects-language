import React from 'react'
import {
    Model,
    Path,
    Frame,
    Input,
    Circle,
    Text
} from 'hyperobjects-language'
import _ from 'lodash'
var model = new Model("path-angle-at-test")


var sourceSteps = 20

model.addEditableGeometry(
    "source-path",
    new Path(_.range(0, 1, 0.05).map(val => {
        return {
            x: 200 + val * 600,
            y: 500 + Math.sin(val * Math.PI * 2) * 200
        }
    })).r(2)
)

model.addInput(
    "angle-at",
    new Input([0, 1])
)

model.addProcedure(
    'show-angle-values',
    (self) => {
        var angleAt = self.inputs['angle-at'].value
        var sourcePath = self.geometries['source-path']
        var angleValues = [
            0.01,
            angleAt,
            0.99
        ]

        var output = []

        angleValues.forEach(val => {
            var point = sourcePath.interpolate(val)
            output.push(new Circle(point, 10, 10))
            var angle = sourcePath.angleAt(val)
            output.push(new Text(
                angle.toFixed(2),
                {x: point.x, y: point.y + 30}
            ))
            var line = new Path([
                {x: -100, y: 0},
                {x: 100, y: 0}
            ]).rotate(angle)
            .translate(point).strokeWidth(4).strokeOpacity(0.3)
            output.push(line)
        })
        return output
    }
)

const PathAngleAtTest = () => {
    return (
        <div className='path-angle-at-test'>
            <p>Path angle at test</p>
            <Frame
                model={model}
                width={700}
                height={700}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                maintainAspectRatio={true}
                editable={true}
                />
        </div>
    )
}

export default PathAngleAtTest