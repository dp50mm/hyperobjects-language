import { SET_DRAGGED_POINT, CLICKED_GEOMETRY } from "./reducer/actionTypes";
import _ from 'lodash'

export const actionCallbackMiddleware = (model, action, callback) => {
    switch (action.type) {
        case SET_DRAGGED_POINT:
            const elements = getElements(model, action)
            callback(elements, action)
            break
        case CLICKED_GEOMETRY:
            const geometry = getGeometry(model, action)
            callback(geometry, action)
        default: return
    }
}

function getGeometry(model, action) {
    let geometries = _.keys(model.geometries).map(key => {
        return {
            ...model.geometries[key],
            key: key
        }
    })
    let geometry = _.find(geometries, g => g.id === action.geometry_id)
    return {
        key: geometry.key,
        geometry: geometry
    }
}

function getElements(model, action) {
    let geometries = _.keys(model.geometries).map(key => {
        return {
            ...model.geometries[key],
            key: key
        }
    })
    let geometry = _.find(geometries, g => g.id === action.geometry_id)
    let point = _.find(geometry.points, p => p.id === action.point_id)
    return {
        key: geometry.key,
        geometry: geometry,
        point: point
    }
}