import React from 'react'
import {
    Model,
    Frame,
    Circle,
    Path
} from 'hyperobjects-language'
import _ from 'lodash'

var model = new Model("rendering-test-model")

model.setSize({
    width: 4000,
    height: 4000
})

model.background = 'black'

model.animated = true


model.addEditableGeometry(
    'source',
    new Path(
        [{x: 1000, y: 1000}, {x: 3000, y: 3000}]
    ).stroke('blue').strokeWidth(50).strokeLinecap("round").export(true).scaledStrokeWidth(false)
)

model.addProcedure(
    "test-lines",
    (self) => {
        var position = self.center()
        if(self.animation_frame % 2 === 0) {
            position.x -= 100
        } else {
            position.x += 100
        }
        return _.range(10).map(val => {
            return new Circle(
                position,
                100 + (1 + val) * 40,
                100,
                100
            ).strokeWidth(5 + val)
            .fillOpacity(0)
            .stroke(`rgb(0, ${255 - val * 10}, ${val * 20})`)
            .scaledStrokeWidth(false).export(true)
        })
    }
)

const RenderingTest = () => {
    return (
        <div className='rendering-test'>
            <h2>Rendering test</h2>
            <p>Should be a toggle to render the model at screen resolution or at model resolution and final image export should conform to that.</p>
            <Frame
                model={model}
                editable={true}
                width={800}
                height={800}
                exportControls={true}
                renderControls={true}
                animationControls={true}
                showBounds={true}
                showGridLines={true}
                />
        </div>
    )
}

export default RenderingTest