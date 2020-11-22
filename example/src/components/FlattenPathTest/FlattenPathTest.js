import React from 'react'
import {
    Frame,
    Path,
    Model,
    Circle
} from 'hyperobjects-language'

var model = new Model()
var path = new Path([
    {x: 100, y: 100, q: {x: 500, y: 500}},
    {x: 600, y: 500},
    {x: 150, y: 100, q: {x: 50, y: 900}}
]).closed(true)

model.addEditableGeometry(
    'path',
    path
)

model.addProcedure(
    'flatten-path',
    (self) => {
        var edittedPath = self.geometries['path']
        edittedPath.flattenPoints()
        return edittedPath._pointsFlattened.map(p => {
            return new Circle(p, 3, 3)
        })
    }
)

const FlattenPathTest = () => {
    return (
        <div className='flatten-path-test'>
            <h2>Flatten path</h2>
            <p>Call geometry.flattenPoints and the geometry._flattenedPoints array will be set. </p>
            <Frame
                model={model}
                editable={true}
                fitInContainer={true}
                maintainAspectRatio={true}
                width={1000}
                height={1000}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                />
        </div>
    )
}

export default FlattenPathTest