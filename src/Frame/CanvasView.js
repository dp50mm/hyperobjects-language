import React, { useRef, useEffect } from 'react'
import { Rectangle } from '../geometry'
import _ from 'lodash'
import drawCanvasGeometry from './canvas'

let canvasViewGeometries = []
let backgroundGeometry = []
let canvasShouldAnimate = []

export const canvasScaling = {
  x: 2,
  y: 2
}

function CanvasView(props) {
  const width = props.width * canvasScaling.x
  const height = props.height * canvasScaling.y
  canvasViewGeometries[props.canvasID] = props.geometries
  const transformMatrix = props.transformMatrix
  if(backgroundGeometry[props.canvasID] === undefined) {
    backgroundGeometry[props.canvasID] = new Rectangle({
      x: 0,
      y: 0
    }, {
      x: width * 10,
      y: height * 10
    }).fill(props.background).fillOpacity(1).strokeWidth(0).stroke('transparent')
  }

  let editable = props.editable
  let animated = props.animated
  let playing = props.playing
  if(editable === false && animated === false && playing === false) {
    canvasShouldAnimate[props.canvasID] = {
      drawn: false,
      redraw: false
    }
  } else {
    canvasShouldAnimate[props.canvasID] = {
      drawn: false,
      redraw: true
    }
  }
  const canvasRef = useCanvas(gl => {
    let should_draw = false
    if(canvasShouldAnimate[props.canvasID].drawn === false) {
      should_draw = true
      canvasShouldAnimate[props.canvasID].drawn = true
    }
    if(canvasShouldAnimate[props.canvasID].redraw) {
      should_draw = true

    }
    if(should_draw) {
      //gl.strokeStyle = 'transparent'
      //gl.fillStyle = 'transparent'
      // gl.globalAlpha = 1
      gl.clearRect(0, 0, width * 100, height * 100)
      drawCanvasGeometry(gl, backgroundGeometry[props.canvasID], transformMatrix)
      //gl.clearRect(-1000, -1000, 100 * 100, 100 * 100)
      canvasViewGeometries[props.canvasID].forEach(g => {
        drawCanvasGeometry(gl, g, transformMatrix)
      })
    }

  }, '2d')
  return (
    <canvas
      id={props.canvasID}
      style={{width: width / 2}}
      ref={canvasRef}
      width={width}
      height={Math.round(height/2) * 2}
      />
  )
}


function useCanvas(draw, context = '2d') {
  const canvasRef = useRef(null)
  useEffect(() => {
    const ctx = canvasRef.current.getContext(context)
    let animationFrameId = requestAnimationFrame(renderFrame)
    function renderFrame() {
      animationFrameId = requestAnimationFrame(renderFrame)
      draw(ctx)
    }
    return () => cancelAnimationFrame(animationFrameId)
  }, [draw, context])
  return canvasRef
}

export default CanvasView
