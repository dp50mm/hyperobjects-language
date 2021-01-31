import React from 'react'
import AnimationControls from './AnimationControls'
import ExportControls from './ExportControls'
import RenderControls from './RenderControls'
import './controls.scss'

const Controls = React.memo(({
    model,
    frame,
    editableGeometries,
    displayGeometries
}) => {
    return (
        <div className='controls'>
            {frame.props.animationControls && model.animated ? (
                <AnimationControls
                playing={model.playing}
                playCallback={frame.playModel}
                pauseCallback={frame.pauseModel}
                rewindCallback={frame.rewindModel}
                animation_frame={model.animation_frame}
                />
            ) : null}
            {frame.props.renderControls && model.animated ? (
                <RenderControls
                startFrame={frame.state.startFrame}
                endFrame={frame.state.endFrame}
                renderCallback={frame.renderModel}
                startFrameCallback={frame.setStartFrame}
                endFrameCallback={frame.setEndFrame}
                renderScaling={frame.state.renderScaling}
                setRenderScaling={frame.setRenderScaling}
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
                exportTypes={frame.props.exportTypes}
                />
            ) : null}
        </div>
    )
})

export default Controls