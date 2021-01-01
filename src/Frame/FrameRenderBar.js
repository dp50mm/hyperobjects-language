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
            padding: 20,
            top: 0,
            left: 20,
            right: 20
            }}>
            <p style={{
              position: 'absolute',
              top: size.height - 30,
              left: 0,
              fontSize: 10
              }}
              >
              {state.startFrame}
            </p>
            <p style={{
              position: 'absolute',
              top: size.height - 10,
              right: 0,
              fontSize: 10
              }}>
              {state.endFrame}
            </p>
            <p
            style={{
              position:'absolute',
              top: size.height - 30,
              left: `calc(${model.animation_frame / state.endFrame * 100}% - 20px)`
            }}
            >
            {model.animation_frame}
            </p>
          </div>
    )
}

export default FrameRenderBar