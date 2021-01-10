import React from 'react'

const FrameRenderBar = ({
    size,
    state,
    model
}) => {
    return (
        <div style={{
            position: 'absolute',
            height: size.height,
            zIndex: 1000,
            padding: 10,
            bottom: 30,
            height: 12,
            left: 20,
            right: 20,
            pointerEvents: 'none'
            }} className='frame-render-bar'>
            <p style={{
              position: 'absolute',
              left: 5,
              }}
              >
              {state.startFrame}
            </p>
            <p style={{
              position: 'absolute',
              right: 5
              }}>
              {state.endFrame}
            </p>
            <p
            style={{
              position:'absolute',
              left: `calc(${model.animation_frame / state.endFrame * 99}% + 0px)`
            }}
            >
            {model.animation_frame}
            </p>
          </div>
    )
}

export default FrameRenderBar