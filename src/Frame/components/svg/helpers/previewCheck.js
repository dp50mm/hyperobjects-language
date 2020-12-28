import _ from 'lodash'
function simpleDistance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
}

function previewCheck(mouse, point, pointRadius, scaling) {

    return !_.get(point, 'selected', false) && !_.get(point, 'dragging', false) && simpleDistance(point, mouse) > (pointRadius * 2) / scaling.x
}

export default previewCheck