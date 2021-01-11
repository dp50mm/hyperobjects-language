import { scale } from 'chroma-js';
import {
    composeMatrices,
    applyInverseMatrixToPoint,
    translateMatrix,
    scaleMatrix,
  } from './matrix';

var pinchEventCounter = 1

var startScale = 1
var prevScale = 1

export function touchStartForPinch(event) {
    prevScale = 1
}

export function touchEndForPinch(event) {
    prevScale = 1
}


export function handlePinch(event, frame) {
    pinchEventCounter += 1
    const eventCoords = event.center
    const { transformMatrix } = frame.state;
    let localPoint = {
        x: (eventCoords.x * transformMatrix.scaleX) + transformMatrix.translateX,
        y: eventCoords.y
    }

    const currentEventScale = event.scale

    var maxPinchSpeed = 0.1

    
    var scaleDelta = _.clamp(currentEventScale - prevScale, -maxPinchSpeed, maxPinchSpeed)
    let scaleX = 1 + scaleDelta // ((event.scale - startScale)/10) + startScale
    if(event.velocityX + event.velocityY > 0.1) {
        scaleX = 1
    }

    
    
    let scaleY = scaleX

    const translate = applyInverseMatrixToPoint(transformMatrix, eventCoords)

    const pinchTranslate = {
        x: event.velocityX * 8 / transformMatrix.scaleX,  //.deltaX / 100,
        y: event.velocityY * 8 / transformMatrix.scaleX //.deltaY / 100
    }
    prevScale = currentEventScale


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
            translateX: -translate.x + pinchTranslate.x,
            translateY: -translate.y + pinchTranslate.y
        })
    ]);

    frame.setState({
        transformMatrix: nextMatrix
    })
}

export default handlePinch