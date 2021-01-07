import React from 'react'
import {
    Model,
    Path,
    Frame,
    Circle,
    Input
} from 'hyperobjects-language'


var model = new Model("path-interpolation-testing")

var onePointPath = new Path([{x: 500, y: 500}])
var twoPointPath = new Path([{x: 100, y: 100}, {x: 900, y: 100}])
var threePointPath = new Path([{x: 100, y: 200}, {x: 100, y: 900}, {x: 900, y: 900}])

model.addInput('interpolation', new Input([0, 1]))

model.addEditableGeometry('one-point-path', onePointPath)
model.addEditableGeometry('two-point-path', twoPointPath)
model.addEditableGeometry('three-point-path', threePointPath)

model.addProcedure(
    'one-point-interpolate',
    (self) => {
        var p = self.geometries['one-point-path'].interpolate(self.inputs['interpolation'].value)
        return new Circle(p, 40, 40).fillOpacity(0)
    }
)
model.addProcedure(
    'two-point-interpolate',
    (self) => {
        var p = self.geometries['two-point-path'].interpolate(self.inputs['interpolation'].value)
        return new Circle(p, 40, 40).fillOpacity(0)
    }
)

model.addProcedure(
    'three-point-interpolate',
    (self) => {
        var p = self.geometries['three-point-path'].interpolate(self.inputs['interpolation'].value)
        return new Circle(p, 40, 40).fillOpacity(0)
    }
)


const PathInterpolateTest = () => {
    return (
        <div className='path-interpolate-test'>
            <p>Path interpolate test</p>
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
    )
}

export default PathInterpolateTest