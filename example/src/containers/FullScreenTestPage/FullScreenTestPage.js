import React from 'react'
import _ from 'lodash'
import {
    Model,
    Path,
    Circle,
    Frame
} from 'hyperobjects-language'

var model = new Model('full-screen-test')

model.addProcedure(
    "test",
    (self) => {
        return new Circle(self.center(), 100, 100)
    }
)

const FullScreenTestPage = () => {
    const width = window.innerWidth - 1
    const height = window.innerHeight - 1
    return (
        <div className='full-screen-test-page'>
            <Frame
                model={model}
                width={width}
                height={height}
                fitInContainer={true}
                maintainAspectRatio={true}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                exportControls={true}
                />
        </div>
    )
}

export default FullScreenTestPage