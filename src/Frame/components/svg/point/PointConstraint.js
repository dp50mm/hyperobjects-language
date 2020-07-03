import React, { useContext } from 'react'
import _ from 'lodash'
import {
  GROUP,
  PATH,
} from '../../../../geometry/types';
import Group from '../Group'
import Path from '../Path'
import ModelContext from '../../../ModelContext'

/**
 * Interface element showing the new implementation of the point constraint
 */
const PointConstraint = ({
  point,
  scaling,
  unit
}) => {
  const model = useContext(ModelContext)
  let opacity = 1
  let radius = 3
  if(point.dragging === false) {
    opacity = 0.1
    radius = 0.5
  }
  let constraint = point.constraint
  if(_.isFunction(constraint)) {
    constraint = constraint(model)
  }
  if(constraint.type === GROUP) {
    constraint.radius(radius)
    constraint.opacity(opacity)
    return (
      <Group geometry={constraint} scaling={scaling} />
    )
  } else if(constraint.type === PATH) {
    constraint.opacity(opacity)
    return (
      <Path geometry={constraint} scaling={scaling} />
    )
  }
  return null
}

export default PointConstraint
