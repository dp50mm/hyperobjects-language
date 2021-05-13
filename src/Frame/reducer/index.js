import {
  UPDATE_KEYS_PRESSED,
  SET_DRAGGED_POINT,
  SET_DRAGGED_ARC_CONTROL_POINT,
  SET_DRAGGED_CUBIC_CONTROL_POINT,
  SET_DRAGGED_QUADRATIC_CONTROL_POINT,
  STOP_DRAGGING,
  MOVE_POINT,

  START_SELECTION,
  SELECT_BOX,
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  MOVE_SELECTION,
  RESET_SELECTION,

  SET_FOCUSSED,
  DISABLE_FOCUSSED,
  ANIMATE,
  PLAY,
  PAUSE,
  REWIND,
  SET_FRAME,
  INPUT_SET_VALUE,

} from './actionTypes';
import geometryReducer from './geometryReducer';

const reducer = (prevState, action) => {
  switch(action.type) {
    case UPDATE_KEYS_PRESSED:
      return {
        ...prevState,
        keysPressed: action.payload
      }
    // Move individual points 
    case MOVE_POINT:
      return {
        ...prevState,
        mousePosition: { x: action.payload.x, y: action.payload.y },
        geometries: objectMap(prevState.geometries, (geometry) => geometryReducer(geometry, action))
      };
    case SET_DRAGGED_POINT:
    case SET_DRAGGED_ARC_CONTROL_POINT:
    case SET_DRAGGED_CUBIC_CONTROL_POINT:
    case SET_DRAGGED_QUADRATIC_CONTROL_POINT:
      return {
        ...prevState,
        draggingAPoint: true,
        geometries: objectMap(prevState.geometries, (geometry) => geometryReducer(geometry, action))
      };
    case STOP_DRAGGING:
      return {
        ...prevState,
        draggingAPoint: false,
        geometries: objectMap(prevState.geometries, (geometry) => geometryReducer(geometry, action))
      };
    
    // Select functionality to move multiple points
    case START_SELECTION:
      return {
        ...prevState,
        draggingAPoint: false,
        selectingPoints: false
      }
    case SELECT_BOX:
      return {
        ...prevState,
        selectingPoints: true,
        selectedPoints: true,
        geometries: objectMap(prevState.geometries, (geometry) => geometryReducer(geometry, action))
      }
    case RESET_SELECTION:
      return {
        ...prevState,
        selectingPoints: false,
        draggingAPoint: false,
        selectedPoints: false,
        geometries: objectMap(prevState.geometries, (geometry) => geometryReducer(geometry, action))
      }
    case ADD_TO_SELECTION:
    case REMOVE_FROM_SELECTION:
    case MOVE_SELECTION:
      return {
        ...prevState,
        geometries: objectMap(prevState.geometries, (geometry) => geometryReducer(geometry, action))
      }

    // Input sliders
    case INPUT_SET_VALUE:
      return {
        ...prevState,
        inputs: objectMap(prevState.inputs, (input, key) => {
          if(action.payload.name === key) {
            return {
              ...input,
              value: action.payload.value
            }
          }
          return input
        })
      }
    case SET_FOCUSSED:
      return {
        ...prevState, focussed: true
      };
    case DISABLE_FOCUSSED:
      return {
        ...prevState,
        focussed: false
      };
    case ANIMATE:
      prevState.runAnimations()
      if(prevState.loopAnimation) {
        if(prevState.animation_frame > prevState.endFrame) {
          return {
            ...prevState,
            animation_frame: prevState.startFrame
          }
        }
      }
      return {
        ...prevState,
        animation_frame: prevState.animation_frame + 1
      };
    case PLAY:
      return {
        ...prevState,
        playing: true
      }
    case PAUSE:
      return {
        ...prevState,
        playing: false
      }
    case SET_FRAME:
      return {
        ...prevState,
        animation_frame: action.payload
      }
    case REWIND:
      return {
        ...prevState,
        animation_frame: 0
      }
    default:
      return prevState;
  }
}

function objectMap(object, mapFn) {
    return Object.keys(object).reduce(function(result, key) {
        result[key] = mapFn(object[key], key)
        return result
    }, {})
}

export default reducer;
