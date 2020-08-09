import {
  SET_DRAGGED_POINT,
  SET_DRAGGED_ARC_CONTROL_POINT,
  SET_DRAGGED_CUBIC_CONTROL_POINT,
  SET_DRAGGED_QUADRATIC_CONTROL_POINT,
  STOP_DRAGGING,
  MOVE_POINT,
  SET_FOCUSSED,
  DISABLE_FOCUSSED,
  ANIMATE,
  PLAY,
  PAUSE,
  REWIND,
  INPUT_SET_VALUE,

  SET_EDIT_POINT,
  SET_EDIT_CUBIC_CONTROL_POINT,
  SET_EDIT_QUADRATIC_CONTROL_POINT,

  STOP_EDIT

} from './actionTypes';
import geometryReducer from './geometryReducer';

const reducer = (prevState, action) => {
  switch(action.type) {
    case SET_DRAGGED_POINT:
    case MOVE_POINT:
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
    
    case SET_EDIT_POINT:
    case SET_EDIT_CUBIC_CONTROL_POINT:
    case SET_EDIT_QUADRATIC_CONTROL_POINT:
      return {
        ...prevState,
        editingPoint: {
          geometry_id: action.geometry_id,
          geometry_key: action.geometry_key,
          point_id: action.point_id
        },
        geometries: objectMap(prevState.geometries, (geometry) => geometryReducer(geometry, action))
      }
    case STOP_EDIT:
      return {
        ...prevState,
        editingPoint: false
      }
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
