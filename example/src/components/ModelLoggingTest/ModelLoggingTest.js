import React from 'react'
import {
    Frame,
    Model,
    Group
} from 'hyperobjects-language'

let model = new Model("model-logging-test")
model.addEditableGeometry('test-points',
    new Group([{x: 100, y: 100}, {x: 900, y: 900}])
)

const ModelLoggingTest = ({

}) => {
    return (
        <div className='model-logging-test'>
            <h2>Model Logging Test</h2>
            <Frame
                model={model}
                editable={true}
                width={500}
                height={500}
                logModelDispatch={true}
                logModelState={true}
                logMouseMove={false}
                />
        </div>
    )
}

export default ModelLoggingTest