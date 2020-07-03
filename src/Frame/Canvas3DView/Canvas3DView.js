import React, { useRef, useEffect } from 'react'
import oglWrapper, {
  resetCanvas
} from './oglWrapper'
import './style.css'

let renderers = []
let canvasEditableGeometries = []
let canvasDisplayGeometries = []
let backgroundColors = []

let framesRendered = []

const Canvas3DView = ({
  editableGeometries,
  displayGeometries,
  width,
  height,
  canvasID,
  backgroundColor
}) => {
  canvasEditableGeometries[canvasID] = editableGeometries
  canvasDisplayGeometries[canvasID] = displayGeometries
  console.log(backgroundColor);
  let ref = useRef(null)
  useEffect(() => {
    // canvas draw functions
    oglWrapper(
      ref.current,
      canvasID,
      {
        width: width * 2,
        height: height * 2
      },
      canvasEditableGeometries[canvasID],
      canvasDisplayGeometries[canvasID],
      backgroundColor
    )
    return () => {
      resetCanvas(canvasID)
    }
  })
  return (
    <div
      className='canvas-3d-view'
      ref={ref}
      style={{
        width: width,
        height: height,
        overflow: 'hidden',
        background: backgroundColor
      }}
      >
    </div>
  )
}



export default Canvas3DView
