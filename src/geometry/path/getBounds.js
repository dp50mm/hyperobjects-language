import Rectangle from '../Rectangle'

function getBounds(points) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  points.forEach(p => {
    if(p.x < minX) {
      minX = p.x
    }
    if(p.x > maxX) {
      maxX = p.x
    }
    if(p.y < minY) {
      minY = p.y
    }
    if(p.y > maxY) {
      maxY = p.y
    }
    if(p.c) {
      p.c.forEach(_cp => {
        if(_cp.x < minX) {
          minX = _cp.x
        }
        if(_cp.x > maxX) {
          maxX = _cp.x
        }
        if(_cp.y < minY) {
          minY = _cp.y
        }
        if(_cp.y > maxY) {
          maxY = _cp.y
        }
      })
    }
    if(p.q) {
      if(p.q.x < minX) {
        minX = p.q.x
      }
      if(p.q.x > maxX) {
        maxX = p.q.x
      }
      if(p.q.y < minY) {
        minY = p.q.y
      }
      if(p.q.y > maxY) {
        maxY = p.q.y
      }
    }
  })
  return new Rectangle({
    x: minX,
    y: minY
  }, {
    x: maxX,
    y: maxY
  })
}

export default getBounds
