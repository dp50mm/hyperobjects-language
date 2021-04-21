import {
    composeMatrices,
    inverseMatrix,
    applyMatrixToPoint,
    applyInverseMatrixToPoint,
    translateMatrix,
    identityMatrix,
    scaleMatrix,
  } from './matrix';
import _ from "lodash"

export function svgWheelZoom(frame, e, keysPressed, zoomDomain) {
    const panning = keysPressed.includes('Space')
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
        
        if(zoomDomain.includes(transformMatrix.scaleX)) {
          if(zoomDomain[0] === transformMatrix.scaleX) {
            scaleX = _.clamp(scaleX, 1, 10)
          } else {
            scaleX = _.clamp(scaleX, 0, 1)
          }
        }
        let scaleY = scaleX
        const translate = applyInverseMatrixToPoint(transformMatrix, mouseCoords)
        var nextMatrix = composeMatrices([
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
        nextMatrix.scaleX = _.clamp(nextMatrix.scaleX, zoomDomain[0], zoomDomain[1])
        nextMatrix.scaleY = _.clamp(nextMatrix.scaleY, zoomDomain[0], zoomDomain[1])

        frame.setState({
            transformMatrix: nextMatrix
        })
    }
}

export function fitFrameToContainer(frame) {
    const heightZoom = frame.props.height / frame.props.model.size.height
    const widthZoom = frame.props.width / frame.props.model.size.width
    const zoom = _.min([heightZoom, widthZoom])
    const frameAspectRatio = frame.props.width / frame.props.height
    const modelSize = frame.props.model.size
    const modelAspectRatio = modelSize.width / modelSize.height
    let pan_x = 0
    let pan_y = 0
    if(frameAspectRatio !== modelAspectRatio) {
      pan_x = frame.props.width / zoom * 0.5 - modelSize.width * 0.5
      pan_y = frame.props.height / zoom * 0.5 - modelSize.height * 0.5
    }
    frame.setState({
      transformMatrix: {
        ...frame.state.transformMatrix,
        scaleX: zoom,
        scaleY: zoom,
        translateX: pan_x * zoom,
        translateY: pan_y * zoom
      }
    })
    setTimeout(() => {
        frame.setState({
        windowResizeIncrement: frame.state.windowResizeIncrement + 1
      })
    })
}