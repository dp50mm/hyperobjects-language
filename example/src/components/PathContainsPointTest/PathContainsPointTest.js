import React from 'react'
import {
    Model,
    Path,
    Group,
    Frame,
    Circle
} from 'hyperobjects-language'

var model = new Model("path-contains-point-test")


model.addEditableGeometry(
    'point',
    new Group([{x: 500, y: 500}])
)

model.setSize({
    width: 2000,
    height: 1000
})

model.addEditableGeometry(
    'path',
    new Path([
        {x: 100, y: 100},
        {x: 900, y: 100},
        {x: 900, y: 500, c: [{x: 500, y: 200}, {x: 500, y: 400}]},
        {x: 100, y: 900, q: {x: 900, y: 900}}
    ]).closed(true)
)

model.addProcedure(
    'contains-test',
    (self) => {
        var point = self.geometries['point'].points[0]
        var path = self.geometries['path'].clone().reverse()
        if(path.isClockwise() === false) {
            path = path.reverse()
        }
        if(path.contains(point)) {
            return new Circle(point, 30, 10).stroke('green')
        } else {
            return new Circle(point, 20, 10).stroke('red')
        }
    }
)

const PathContainsPointTest = () => {
    return (
        <div className='path-contains-point-test'>
            <p>Path contains point test</p>
            <Frame
                model={model}
                width={800}
                height={400}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                maintainAspectRatio={true}
                editable={true}
                />
        </div>
    )
}

export default PathContainsPointTest