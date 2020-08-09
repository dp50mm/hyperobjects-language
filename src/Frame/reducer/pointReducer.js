import {
  SET_DRAGGED_POINT,
  SET_DRAGGED_ARC_CONTROL_POINT,
  SET_DRAGGED_CUBIC_CONTROL_POINT,
  SET_DRAGGED_QUADRATIC_CONTROL_POINT,
  MOVE_POINT,
  STOP_DRAGGING
} from './actionTypes';
import _ from 'lodash';
import {
  GROUP,
  PATH
} from '../../geometry/types'

const pointReducer = (prevState, action) => {
  switch(action.type) {
    case SET_DRAGGED_POINT:
      if(action.point_id === prevState.id) {
        return {...prevState, dragging: true};
      } else {
        return {...prevState, dragging: false};
      }
    case SET_DRAGGED_ARC_CONTROL_POINT:
      if(action.point_id === prevState.id) {
        return {...prevState, dragging: false};
      } else {
        return {...prevState, dragging: false};
      }
    case SET_DRAGGED_CUBIC_CONTROL_POINT:
      if(action.point_id === prevState.id) {
        return {...prevState,
          c: prevState.c.map((c_point ,i) => {
            if(action.i === i) {
              return {...c_point, dragging: true};
            } else {
              return {...c_point};
            }
          }),
          dragging: false
        };
      } else {
        return {...prevState, dragging: false};
      }
    case SET_DRAGGED_QUADRATIC_CONTROL_POINT:
      if(action.point_id === prevState.id) {
        return {...prevState,
          q: {...prevState.q,
            dragging: true
          },
          dragging: false};
      } else {
        return {...prevState, dragging: false};
      }
    case MOVE_POINT:
      if(prevState.dragging || (_.get(action.payload, 'overrideDragging', false) && action.payload.point_id === prevState.id)) {
        let x = _.get(action.payload, 'x', prevState.x)
        let y = _.get(action.payload, 'y', prevState.y)
        let z = _.get(action.payload, 'z', prevState.z)
        if(prevState.constraint !== false) {
          if(_.isFunction(prevState.constraint)) {
            const constraint = prevState.constraint(action.payload.model)
            let nearestPoint = constraint.nearest({x: x, y: y})
            return {
              ...prevState,
              x: nearestPoint.x,
              y: nearestPoint.y
            }
          } else {
            if(prevState.constraint.type === GROUP) {
              let nearestPoint = prevState.constraint.nearest({x: x, y: y})
              return {
                ...prevState,
                x: nearestPoint.x,
                y: nearestPoint.y
              }
            } else if(prevState.constraint.type === PATH) {
              let nearestPoint = prevState.constraint.nearest({x: x, y: y})
              return {
                ...prevState,
                x: nearestPoint.x,
                y: nearestPoint.y
              }
            }
          }
        }
        if(prevState.constraints.x.min) {
          if(x < prevState.constraints.x.min) {
            x = prevState.constraints.x.min
          }
          if(x > prevState.constraints.x.max) {
            x = prevState.constraints.x.max
          }
        }
        if(prevState.constraints.y.min) {
          if(y < prevState.constraints.y.min) {
            y = prevState.constraints.y.min
          }
          if(y > prevState.constraints.y.max) {
            y = prevState.constraints.y.max
          }
        }
        if(prevState.constraints.z.min) {
          if(z < prevState.constraints.z.min) {
            z = prevState.constraints.z.min
          }
          if(z > prevState.constraints.z.max) {
            z = prevState.constraints.z.max
          }
        }
        return {...prevState, x: x, y: y, z: z }
      } else if (prevState.q.dragging) {
        return {...prevState,
          q: {...prevState.q,
            x: action.payload.x,
            y: action.payload.y
          }
        };
      } else if(prevState.c) {
        return {...prevState,
          c: prevState.c.map((c_point) => {
            if(c_point.dragging) {
              return {...c_point, x: action.payload.x, y: action.payload.y};
            } else {
              return c_point;
            }
          })
        };
      } else if(prevState.constraint) {
        if(_.isFunction(prevState.constraint)) {
          let x = prevState.x
          let y = prevState.y
          let z = prevState.z
          const constraint = prevState.constraint(action.payload.model)
          let nearestPoint = constraint.nearest({x: x, y: y})
          return {
            ...prevState,
            x: nearestPoint.x,
            y: nearestPoint.y
          }
        } else {
          return prevState
        }
      } else {
        return prevState;
      }
    case STOP_DRAGGING:
      let q = prevState.q
      let c = prevState.c
      let return_q = false;
      let return_c = false;
      if(q) {
        return_q = {
          ...q,
          dragging: false
        }
      }
      if(c) {
        return_c = c.map((c) => {
          return {...c, dragging: false}
        })
      }
      return {...prevState,
        dragging: false,
        q: return_q,
        c: return_c
      }
    default:
      return prevState;
  }
}

export default pointReducer;
