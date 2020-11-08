import Path from '../Path'
import VoronoiAlgorithm from './Voronoi-algorithm'
import _ from 'lodash'

var voronoi = new VoronoiAlgorithm()
/**
 * Voronoi
 * @param       {[array of Point objects]} points [description]
 * @constructor
 * Returns an array of Paths for each voronoi Polygon
 */
function Voronoi(points, settings) {
  // let crop = _.get(settings, 'crop', true)
  let width = _.get(settings, 'width', 999)
  let height = _.get(settings, 'height', 999)
  let bbox = {
    xl: 1,
    xr: width,
    yt: 1,
    yb: height
  }
  let pointsFiltered = points.filter(p => {
    return p.x > bbox.xl && p.x < bbox.xr && p.y > bbox.yt && p.y < bbox.yb
  })
  let result = voronoi.compute(pointsFiltered, bbox)
  let returnPaths = result.cells.map((cell) => {
    return new Path([cell.halfedges[0].getStartpoint()].concat(
      cell.halfedges.map((halfedge) => {
        return halfedge.getEndpoint()
      })
    )).closed(true)

  })
  return returnPaths
}

export default Voronoi
