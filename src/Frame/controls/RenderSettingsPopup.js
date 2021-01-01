import React from 'react'

import {
    Button,
    Input
  } from 'semantic-ui-react'

const RenderSettingsPopup = React.memo((props) => {
    return (
        <div className='render-settings'>
        <p className='label'>Start frame</p>
        <Input value={props.startFrame}
            type='number'
            onChange={(e) => {
            props.startFrameCallback(e.target.value)
            }}>
            </Input>
        <p className='label'>End frame</p>
        <Input value={props.endFrame}
            type='number'
            onChange={(e) => {
            props.endFrameCallback(e.target.value)
            }}>
            </Input>
            <p className='label'>Scaling</p>
            <br />
            <Button.Group size="tiny">
            <Button
                toggle
                active={props.renderScaling === 'screen'}
                onPointerDown={() => props.setRenderScaling('screen')}
                >
                Screen
            </Button>
            <Button
                toggle
                active={props.renderScaling === 'model'}
                onPointerDown={() => props.setRenderScaling('model')}
                >
                Model
            </Button>
            </Button.Group>
        </div>
    )
})

export default RenderSettingsPopup