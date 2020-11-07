import React from 'react'
import {
    Button
} from 'semantic-ui-react'

const ZoomControls = ({
    fitToFrame,
    moveToZero
}) => {
    return (
        <div className="zoom-controls">
            <div className="buttons">
            <Button.Group size="tiny">
                <Button onClick={() => fitToFrame()}>Fit to window</Button>
                <Button onClick={() => moveToZero()}>Move to zero</Button>
            </Button.Group>
            </div>
        </div>
    )
}

export default ZoomControls