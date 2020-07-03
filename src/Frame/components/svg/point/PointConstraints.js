import React from 'react'
import ModelContext from '../../../ModelContext';
class PointConstraints extends React.Component {
  static contextType = ModelContext
  render() {
    const point = this.props.point
    const scaling = this.props.scaling
    const unit = this.props.unit
    const model = this.context
    const x = point.constraints.x
    const y = point.constraints.y
    const z = point.constraints.z
    let hasConstraintSet = false
    let rect = {
      x: 0,
      y: 0,
      w: model.size.width,
      h: model.size.height
    }
    if(x.min) {
      hasConstraintSet = true
      rect.x = x.min
    }
    let lineConstraint = null
    if(x.max) {
      hasConstraintSet = true
      rect.w = x.max - rect.x
      if(rect.w === 0) {
        //rect.w = 1
        lineConstraint = (
          <line
            x1={x.min}
            x2={x.max}
            y1={y.min}
            y2={y.max}
            stroke="black"
            strokeWidth={1 / scaling.x}
            opacity={0.5}
            />
        )
      }
    }
    if(y.min) {
      rect.y = y.min
      hasConstraintSet = true
    }

    if(y.max) {
      hasConstraintSet = true
      rect.h = y.max - rect.y
      if(rect.h === 0) {
        //rect.h = 1
        lineConstraint = (
          <line
            x1={x.min}
            x2={x.max}
            y1={y.min}
            y2={y.max}
            stroke="black"
            strokeWidth={1 / scaling.x}
            opacity={0.5}
            />
        )
      }
    }
    if(z.min) {
      hasConstraintSet = true
    }
    if(z.max) {
      hasConstraintSet = true
    }
    let shouldShowConstraints = false
    if(point.dragging && hasConstraintSet) {
      shouldShowConstraints = true
    } else if (point.constraints.show) {
      shouldShowConstraints = true
    }
    if(shouldShowConstraints) {
      return (
        <g>
        {lineConstraint}
         <rect
          x={`${rect.x}${unit}`}
          y={`${rect.y}${unit}`}
          width={rect.w}
          height={rect.h}
          fill="transparent"
          stroke="black"
          strokeWidth={1 / scaling.x}
          opacity={0.5} />
        </g>
      )
    }
    return null;
  }
}

export default PointConstraints
