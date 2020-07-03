/**
 * 2D Affine transformation matrix
 * @param       {number} a  a parameter in the matrix
 * @param       {number} b  b parameter in the matrix
 * @param       {number} c  c parameter in the matrix
 * @param       {number} d  d parameter in the matrix
 * @param       {number} tx x translation in the matrix
 * @param       {number} ty y translation in the matrix
 * @constructor
 */
function Matrix(a, b, c, d, tx, ty) {
  this.type = 'MATRIX'
  this.a = a
  this.b = b
  this.c = c
  this.d = d
  this.tx = tx
  this.ty = ty
  this.translate = (point) => {
    var x = point.x
    var y = point.y
    this.tx += x * this.a + y * this.c
    this.ty += x * this.b + y * this.d
    return this
  }
  this.transformPoint = (point) => {
    var x = point.x
    var y = point.y
    let newPoint = point.copy()
    newPoint.x = x * this.a + y * this.c + this.tx
    newPoint.y = x * this.b + y * this.d + this.ty
    return newPoint
  }
}

export default Matrix
