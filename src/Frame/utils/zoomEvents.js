import {
    composeMatrices,
    inverseMatrix,
    applyMatrixToPoint,
    applyInverseMatrixToPoint,
    translateMatrix,
    identityMatrix,
    scaleMatrix,
  } from './matrix';

export function svgWheelZoom(frame, e, keysPressed) {
    const panning = keysPressed.includes(' ')
    if (!panning) {
        var deltaScaling = -1/150
        if(keysPressed.includes('Control')) {
            deltaScaling = 1/300
        }
        const mouseCoords = frame.getMouseCoords(e)
        const { transformMatrix } = frame.state;
        let localPoint = {
            x: (mouseCoords.x * transformMatrix.scaleX) + transformMatrix.translateX,
            y: mouseCoords.y
        }

        localPoint.x = 100
        localPoint.y = 0

        let scaleX = _.clamp(1 + e.deltaY * deltaScaling, 0.1, 5)
        let scaleY = scaleX
        const translate = applyInverseMatrixToPoint(transformMatrix, mouseCoords)
        const nextMatrix = composeMatrices([
            transformMatrix,
            translateMatrix({
            translateX: translate.x,
            translateY: translate.y
            }),
            scaleMatrix({
            scaleX: scaleX,
            scaleY: scaleY
            }),
            translateMatrix({
            translateX: -translate.x,
            translateY: -translate.y
            })
        ]);

        frame.setState({
            transformMatrix: nextMatrix
        })
    }
}

export function fitFrameToContainer(frame) {
    const zoom = frame.props.height / frame.props.model.size.height
    const frameAspectRatio = frame.props.width / frame.props.height
    const modelSize = frame.props.model.size
    const modelAspectRatio = modelSize.width / modelSize.height
    let pan_x = 0
    if(frameAspectRatio !== modelAspectRatio) {
      pan_x = frame.props.width / zoom * 0.5 - modelSize.width * 0.5
    }
    frame.setState({
      transformMatrix: {
        ...frame.state.transformMatrix,
        scaleX: zoom,
        scaleY: zoom,
        translateX: pan_x * zoom,
        translateY: 0
      }
    })
    setTimeout(() => {
        frame.setState({
        windowResizeIncrement: frame.state.windowResizeIncrement + 1
      })
    })
}