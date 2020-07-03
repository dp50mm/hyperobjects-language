import Segment, { TYPES } from '../Segment'

function SegmentOffset() {
  this.offset = function(distance) {
    if(this.type === TYPES.CUBIC) {
      return []
    } else if (this.type === TYPES.QUADRATIC) {
      return []
    } else if (this.type === TYPES.LINEAR) {
      let linearOffset = offsetLinearSegment(
        this.p1,
        this.p2,
        distance
      )
      return new Segment(linearOffset[0], linearOffset[1])
    }
  }
}


function offsetLinearSegment(p1, p2, offset) {
  let direction = Math.atan2((p1.x - p2.x),(p1.y - p2.y))
  let _p1 = {
    x: p1.x - Math.cos(direction) * offset,
    y: p1.y + Math.sin(direction) * offset
  }
  let _p2 = {
    x: p2.x - Math.cos(direction) * offset,
    y: p2.y + Math.sin(direction) * offset
  }
  return [_p1, _p2]
}

export default SegmentOffset
