import _ from 'lodash'

export function helloWorld() {
  console.log('hello world')
}

export function identityMatrix() {
  return {
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    tarnslateY: 0,
    skewX: 0,
    skewY: 0
  }
}

export function createMatrix({
  scaleX = 1,
  scaleY = 1,
  translateX = 0,
  translateY = 0,
  skewX = 0,
  skewY = 0
}) {
  return {
    scaleX,
    scaleY,
    translateX,
    translateY,
    skewX,
    skewY
  }
}

export function inverseMatrix(m) {
  const {
    scaleX,
    scaleY,
    translateX,
    translateY,
    skewX,
    skewY,
  } = m
  const denominator = scaleX * scaleY - skewY * skewX;
  return {
    scaleX: scaleY / denominator,
    scaleY: scaleX / denominator,
    translateX: (scaleY * translateX - skewX * translateY) / -denominator,
    translateY: (skewY * translateX - scaleX * translateY) / denominator,
    skewX: skewX / -denominator,
    skewY: skewY / -denominator,
  };
}

export function applyMatrixToPoint(matrix, point) {
  const { x, y } = point
  return {
    x: matrix.scaleX * x + matrix.skewX * y + matrix.translateX,
    y: matrix.skewY * x + matrix.scaleY * y + matrix.translateY,
  };
}

export function applyInverseMatrixToPoint(matrix, point) {
  const {x, y} = point
  return applyMatrixToPoint(inverseMatrix(matrix), { x, y });
}
export function scaleMatrix(matrix) {
  const scaleX = _.get(matrix, 'scaleX', undefined)
  const scaleY = _.get(matrix, 'scaleY', undefined)
  return createMatrix({ scaleX, scaleY });
}

export function translateMatrix(matrix) {
  const translateX = _.get(matrix, 'translateX', undefined)
  const translateY = _.get(matrix, 'translateY', undefined)
  return createMatrix({ translateX, translateY });
}

export function multiplyMatrices(matrix1, matrix2) {
  return {
    scaleX: matrix1.scaleX * matrix2.scaleX + matrix1.skewX * matrix2.skewY,
    scaleY: matrix1.skewY * matrix2.skewX + matrix1.scaleY * matrix2.scaleY,
    translateX:
      matrix1.scaleX * matrix2.translateX + matrix1.skewX * matrix2.translateY + matrix1.translateX,
    translateY:
      matrix1.skewY * matrix2.translateX + matrix1.scaleY * matrix2.translateY + matrix1.translateY,
    skewX: matrix1.scaleX * matrix2.skewX + matrix1.skewX * matrix2.scaleY,
    skewY: matrix1.skewY * matrix2.scaleX + matrix1.scaleY * matrix2.skewY,
  };
}

export function composeMatrices(matrices){
  switch (matrices.length) {
    case 0:
      throw new Error('composeMatrices() requires arguments: was called with no args');
    case 1:
      return matrices[0];
    case 2:
      return multiplyMatrices(matrices[0], matrices[1]);
    default: {
      const matrix1 = matrices[0]
      const matrix2 = matrices[1]
      const restMatrices = _.drop(matrices, 2)
      const matrix = multiplyMatrices(matrix1, matrix2);
      return composeMatrices([matrix].concat(restMatrices));
    }
  }
}