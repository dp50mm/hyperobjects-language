import {
  SET_DRAGGED_POINT,
  SET_DRAGGED_ARC_CONTROL_POINT,
  SET_DRAGGED_CUBIC_CONTROL_POINT,
  SET_DRAGGED_QUADRATIC_CONTROL_POINT,
  MOVE_POINT,
  STOP_DRAGGING,

  SELECT_BOX,
  RESET_SELECTION,
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  MOVE_SELECTION
} from './actionTypes';
import pointReducer from './pointReducer';
import _ from 'lodash'

const geometryReducer = (prevState, action) => {
  switch(action.type) {
    case SET_DRAGGED_POINT:
    case SET_DRAGGED_ARC_CONTROL_POINT:
    case SET_DRAGGED_CUBIC_CONTROL_POINT:
    case SET_DRAGGED_QUADRATIC_CONTROL_POINT:
      if(action.geometry_id === prevState.id) {
        return {...prevState,
          points: prevState.points.map((point) => pointReducer(point, action))
        }
      } else {
        return prevState;
      }
    case MOVE_POINT:
    case STOP_DRAGGING:
      return {...prevState,
        _pointsFlattened: false,
        _segments: false,
        _area: null,
        points: prevState.points.map((point, i, a) => {
          return pointReducer(point, action)
        })
      }

    case SELECT_BOX:
    case RESET_SELECTION:
    case ADD_TO_SELECTION:
    case REMOVE_FROM_SELECTION:
    case MOVE_SELECTION:
      return {
        ...prevState,
        points: prevState.points.map((point, i, a) => {
          return pointReducer(point, action)
        }) 
      }
    default:
      return prevState;
  }
};



export default geometryReducer;
