import React from 'react'

const Controls = ({
    model,
    frame,
    editableGeometries,
    displayGeometries
}) => {
    return (
        <div className='controls'>
            <div className='controls'>
            {frame.props.animationControls && model.animated ? (
                <AnimationControls
                playing={model.playing}
                playCallback={frame.playModel}
                pauseCallback={frame.pauseModel}
                rewindCallback={frame.rewindModel}
                />
            ) : null}
            {frame.props.renderControls && model.animated ? (
                <RenderControls
                startFrame={frame.state.startFrame}
                endFrame={frame.state.endFrame}
                renderCallback={frame.renderModel}
                startFrameCallback={frame.setStartFrame}
                endFrameCallback={frame.setEndFrame}
                />
            ) : null}
            {frame.props.exportControls ? (
                <ExportControls
                model={model}
                editableGeometries={editableGeometries}
                geometries={displayGeometries}
                svg_id={`${frame.state.svgID}-export`}
                canvasID={frame.props.canvasID}
                name={model.name}
                />
            ) : null}
            </div>
        </div>
    )
}

export default Controls