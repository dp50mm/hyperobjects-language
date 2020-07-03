import Path from '../Path'
import _ from 'lodash'
import { POINT, POINT_TYPES } from '../types';

function PathBooleans() {
  /**
   * Public API for path boolean operations
   */
  const OPERATIONS = {
    UNITE: 'UNITE',
    INTERSECT: 'INTERSECT',
    SUBTRACT: 'SUBTRACT',
    EXCLUDE: 'EXCLUDE'
  }
  this.union = function(path, options) {
    let path1 = this
    let path2 = path
    let segments = prepareSegments(path1, path2)
    let filteredSegments = {
      _1: segments._1.filter(segment => !path2.contains(segment.interpolate(0.5))),
      _2: segments._2.filter(segment => !path1.contains(segment.interpolate(0.5)))
    }
    let bothSegments = filteredSegments._1.concat(filteredSegments._2)
    let pointSets = mergeSegments(bothSegments)
    return pointSets.map(points => {
      return new Path(points).closed(true)
    })
  }
  this.intersect = function(path, options) {
    let path1 = this
    let path2 = path
    let path1Bounds = path1.getBounds()
    let path2Bounds = path2.getBounds()
    if(  path2.contains(path1Bounds.p1)
      && path2.contains(path1Bounds.p2)
      && path2.contains(path1Bounds.p3)
      && path2.contains(path1Bounds.p4)) {
        return [path2]
    } else if(path1.contains(path2Bounds.p1)
      && path1.contains(path2Bounds.p2)
      && path1.contains(path2Bounds.p3)
      && path1.contains(path2Bounds.p4)) {
      return [path2]
    }
    let segments = prepareSegments(path1, path2)
    let filteredSegments = {
      _1: segments._1.filter(segment => path2.contains(segment.interpolate(0.5))),
      _2: segments._2.filter(segment => path1.contains(segment.interpolate(0.5)))
    }
    let bothSegments = filteredSegments._1.concat(filteredSegments._2)
    if(bothSegments.length === 0) {
      return []
    }
    let pointSets = mergeSegments(bothSegments)
    return pointSets.map(points => {
      return new Path(points).closed(true).copyStyle(path)
    })
  }
  this.subtract = function(path, options) {
    return []
  }
  this.exclude = function(path, options) {
    return []
  }
  this.cutSegments = function(path) {
    let segments = this.segments()
    let splitSegments = []
    segments.forEach(segment => {
      segment.cut(path).forEach(segment => splitSegments.push(segment))
    })
    return splitSegments
  }

  function prepareSegments(path1, path2) {
    let segments1 = path1.segments()
    let segments2 = path2.segments()

    let splitSegments1 = []
    segments1.forEach(segment1 => {
      segment1.cut(path2).forEach(segment => splitSegments1.push(segment))
    })

    let splitSegments2 = []
    segments2.forEach(segment2 => {
      segment2.cut(path1).forEach(segment => splitSegments2.push(segment))
    })

    return {
      _1: splitSegments1,
      _2: splitSegments2
    }
  }
  this.cutPath = function(path) {
    let cutSegments = path.cutSegments(this)
    cutSegments = cutSegments.filter(segment => this.contains(segment.interpolate(0.5)))
    if(cutSegments.length === 0) {
      return []
    } else if(cutSegments.length === 1) {
      return [new Path([cutSegments[0].p1, cutSegments[0].p2]).copyStyle(path)]
    }
    let pointSets = mergeSegments(cutSegments)
    return pointSets.map(points => {
      return new Path(points).copyStyle(path)
    })
  }
  const distanceThreshold = 1/100
  function mergeSegments(segments) {
    segments.forEach((segment, index) => segment.index = index)

    let pointSets = []
    let addedSegments = [0]
    let points = [{
      x: segments[0].p1.x,
      y: segments[0].p1.y
    },segments[0].p2]

    segments.forEach((segment, i, a) => {
      let segmentsNotIncludedYet = a.filter(s => !addedSegments.includes(s.index))
      if(segmentsNotIncludedYet.length !== 0) {
        let latestPoint = points[points.length-1]
        let sortByP1 = segmentsNotIncludedYet.sort((a, b) => {
          return a.p1.distance(latestPoint) - b.p1.distance(latestPoint)
        })[0]
        let sortByP2 = segmentsNotIncludedYet.sort((a, b) => {
          return a.p2.distance(latestPoint) - b.p2.distance(latestPoint)
        })[0]
        const distanceOne = sortByP1.p1.distance(latestPoint)
        const distanceTwo = sortByP2.p2.distance(latestPoint)
        if(sortByP1.p1.distance(latestPoint) < sortByP2.p2.distance(latestPoint)) {
          if(sortByP1.p1.distance(latestPoint) > distanceThreshold) {
            pointSets.push(points)
            points = []
          }
          points.push(sortByP1.p1)
          points.push(sortByP1.p2)
          addedSegments.push(sortByP1.index)
        } else {
          if(sortByP2.p2.distance(latestPoint) > distanceThreshold) {
            pointSets.push(points)
            points = []
          }
          points.push(sortByP2.p2)
          points.push(sortByP2.p1)
          addedSegments.push(sortByP2.index)
        }
      }

    })
    pointSets.push(points)
    pointSets = pointSets.filter(points => points.length > 0)
    pointSets = pointSets.map(points => {
      return _.uniqWith(points, (a, b) => {
        if(a.curveType === b.curveType) {
          if(a.curveType === POINT_TYPES.LINEAR) {
            if(a.x === b.x && a.y === b.y) {
              return true
            }
          }
        }

        return false
      })
    })
    return pointSets
  }

  this.mergeSegments = mergeSegments

  function traceBoolean(path1, path2, operation, options) {
    if(options) {
      if(options.trace === false || options.stroke) {
        if(operation === OPERATIONS.INTERSECT || operation === OPERATIONS.SUBTRACT) {
          return splitBoolean(path1, path2, operation)
        }
      }
    }
    return []
  }

  function splitBoolean(path1, path2, operation) {
    var _path1 = preparePath(path1)
    var _path2 = preparePath(path2)
    let crossings = _path1.getCrossings(_path2)
    // split each segment based on the crossings
    // create new paths from the curves at the crossings
    //
    // construct segment chains
    return []
  }

  function preparePath(path, resolve) {
    // to be implemented, clean and reduce the path so that you dont do unnecessary processing on 0,0 points
    return path//.clone()//.reduce()
  }
}

export default PathBooleans
