/**
 * Retruns a series of centerpoints for a hexagon pattern
 */

function hexPattern(width, height, hex_size) {
  const v_spacing = 0.875;
  const rows = height / (hex_size * v_spacing)
  const columns = width / (hex_size * v_spacing)
  var points = [];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      var x = 0;
      if(j % 2 === 0) {
        x =  i * hex_size + (hex_size * 0.5);
      } else {
        x = i * hex_size;
      }
      points.push({
        x: x,
        y: j * hex_size * v_spacing
      });
    }
  }
  return points
}

export default hexPattern
