import React from 'react'
import {
    Model,
    Path,
    Frame,
    Group
} from 'hyperobjects-language'

var model = new Model('mirror-path-test')

model.setSize({
    width: 2000,
    height: 2000
})

model.addEditableGeometry(
    "path",
    new Path([
        {x: 100, y: 100},
        {x: 900, y: 100, c: [
            {x: 150, y: 150},
            {x: 300, y: 900}
            ]
        },
        { x: 700, y: 900 , q: {x: 500, y: 500 }},
        { x: 100, y: 900}
    ]).r(3).closed(true)
)

model.addEditableGeometry(
    'mirror-points',
    new Group([
        {x: 1000, y: 500},
        {x: 1500, y: 1000}
    ])
)

model.addProcedure(
    "mirror",
    (self) => {
        var path = self.geometries['path'].clone()
        var mirrorPoint = self.geometries['mirror-points'].points[0]
        return path.scale({x: -1, y: 1}, mirrorPoint)
    }
)

model.addProcedure(
    'mirror-two',
    (self) => {
        var mirror = self.procedures['mirror'](self)
        var mirrorPoint = self.geometries['mirror-points'].points[1]
        return mirror.scale({x: 1, y: -1}, mirrorPoint)
    }
)

const MirrorPathTest = () => {
    return (
        <div className='mirror-path-test'>
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

export default MirrorPathTest