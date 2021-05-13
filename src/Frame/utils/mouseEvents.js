import {
    MOVE_POINT,
    MOVE_SELECTION,
    SELECT_BOX,
    STOP_DRAGGING,
    RESET_SELECTION
} from '../reducer/actionTypes'
import {
    Rectangle
} from '../../geometry'


export function handleMouseMove(frame, e, frameModelStores, keysPressed) {
    let mouse_coords = frame.getMouseCoords(e);
    let model = frameModelStores[frame.state.frameID];
    const transformMatrix = frame.state.transformMatrix
    // event is over svg element and has coordinates
    if(mouse_coords && frame.state.frameInFocus) {
        if(frame.props.logMouseMove) {
            console.log(mouse_coords)
        }
        const panning = keysPressed.includes('Space')
        // Handle panning when user has pressed the space bar
        if(panning) {
            if(frame.state.mouseDown) {
                frame.setState({
                transformMatrix: {
                ...frame.state.transformMatrix,
                translateX: frame.state.panStart.x + mouse_coords.x - frame.state.mouseDownPoint.x,
                translateY: frame.state.panStart.y + mouse_coords.y - frame.state.mouseDownPoint.y
                }
            })
            }
        } else if(frame.state.mouseDown) {
            let previousMouseCoords = frame.state.mouse_select

            if(frame.state.draggingSelection) {
            const previousPoint = {
                x: (previousMouseCoords.x - transformMatrix.translateX) / transformMatrix.scaleX,
                y: (previousMouseCoords.y - transformMatrix.translateY) / transformMatrix.scaleY
            }
            const currentPoint = {
                x: (mouse_coords.x - transformMatrix.translateX) / transformMatrix.scaleX,
                y: (mouse_coords.y - transformMatrix.translateY) / transformMatrix.scaleY
            }
            const dx = currentPoint.x - previousPoint.x
            const dy = currentPoint.y - previousPoint.y
            if(!isNaN(dx) && !isNaN(dy) && frame.props.editable) {
                frame.modelDispatch({
                        type: MOVE_SELECTION,
                        payload: {
                            dx: dx,
                            dy: dy
                        }
                    })
                }
            }
            frame.setState({
            mouse_select: mouse_coords
            })
        } else { // User has not pressed the space bar
            if(frame.props.editable) {
              frame.modelDispatch({
                  type: MOVE_POINT,
                  payload: {
                  x: _.clamp((mouse_coords.x - transformMatrix.translateX) / transformMatrix.scaleX, 0, model.size.width),
                  y: _.clamp((mouse_coords.y - transformMatrix.translateY) / transformMatrix.scaleY, 0, model.size.height),
                  model: model,
                  mouseDown: frame.state.mouseDown
                }
              });
              frame.setState({
                modelSpaceMouseCoords: {
                  x: _.clamp((mouse_coords.x - transformMatrix.translateX) / transformMatrix.scaleX, 0, model.size.width),
                  y: _.clamp((mouse_coords.y - transformMatrix.translateY) / transformMatrix.scaleY, 0, model.size.height)
                }
              })
            }
        }
    }
}

export function handleMouseUp(frame, e, frameModelStores, keysPressed) {
    let mouse_coords = frame.getMouseCoords(e);
    
    let startMouseCoords = frame.state.mouseDownPoint
    const panning = keysPressed.includes('Space')
    if(e.button === 0) {
      let transformMatrix = frame.state.transformMatrix
      let model = frameModelStores[frame.state.frameID];
      
      let p2 = {
        x: _.clamp((mouse_coords.x - transformMatrix.translateX) / transformMatrix.scaleX, 0, model.size.width),
        y: _.clamp((mouse_coords.y - transformMatrix.translateY) / transformMatrix.scaleY, 0, model.size.height)
      }
      
      if(startMouseCoords) {
        if(frame.state.draggingSelection) {
            frame.callUpdateParameters()
        }
        const MIN_DRAG_DISTANCE = 3 
        if(Math.abs(mouse_coords.x - startMouseCoords.x) < MIN_DRAG_DISTANCE && Math.abs(mouse_coords.y - startMouseCoords.y) < MIN_DRAG_DISTANCE) {
          
          if(frame.props.onClickCallback && frameModelStores[frame.state.frameID].selectedPoints === false) {
            frame.props.onClickCallback(p2)
            if(_.isFunction(frameModelStores[frame.state.frameID].onPointerDownCallback)) {
              frameModelStores[frame.state.frameID].onPointerDownCallback(
                frameModelStores[frame.state.frameID],
                p2
              )
            }
          }
          frame.setState({
            draggingSelection: false
          })
          frame.modelDispatch({
            type: RESET_SELECTION
          })
        } else if(frame.state.draggingSelection === false && !model.draggingAPoint) {
          
          let p1 = {
            x: _.clamp((startMouseCoords.x - transformMatrix.translateX) / transformMatrix.scaleX, 0, model.size.width),
            y: _.clamp((startMouseCoords.y - transformMatrix.translateY) / transformMatrix.scaleY, 0, model.size.height)
          }
          let selectRect = new Rectangle(p1,p2)
          let selectedPoints = model.getEditablePointsInRectangle(selectRect)
          if(selectedPoints.length > 0 && model.draggingAPoint === false && !panning) {
            frame.modelDispatch({
                type: SELECT_BOX,
                payload: selectRect
            })
          } else {
            frame.modelDispatch({
                type: RESET_SELECTION
            })
          }
        }
      } else {
        if(frame.state.draggingSelection) {
            frame.modelDispatch({
            type: RESET_SELECTION
          })
          frame.setState({
            draggingSelection: false
          })
        }
      }
      frame.setState({
        mouseDown: false,
        mouse_select: false
      })
      if(model.draggingAPoint) {
        frame.modelDispatch({
          type: STOP_DRAGGING
        })
      }
      
    }
}