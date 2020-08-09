import React, { useRef, useEffect } from 'react'
import { Rectangle } from '../geometry'
import _ from 'lodash'
import drawCanvasGeometry from './canvas'

let canvasViewGeometries = []
let canvasScaling = [{
  x: 1,
  y: 1
}]
let backgroundGeometry = []
let canvasShouldAnimate = []
function CanvasView(props) {
  const width = props.width * 2
  const height = props.height * 2
  canvasViewGeometries[props.canvasID] = props.geometries
  canvasScaling[props.canvasID] = {
    x: props.scaling.x * 2,
    y: props.scaling.y * 2
  }
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
      drawCanvasGeometry(gl, backgroundGeometry[props.canvasID], canvasScaling[props.canvasID], props.pan)
      //gl.clearRect(-1000, -1000, 100 * 100, 100 * 100)
      canvasViewGeometries[props.canvasID].forEach(g => {
        drawCanvasGeometry(gl, g, canvasScaling[props.canvasID], props.pan)
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
