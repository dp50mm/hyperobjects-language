import React, { Component } from 'react'
import Geometry from './components/Geometry'

class SVGExport extends Component {
  componentDidMount() {
    this.props.mountedCallback()
  }
  render() {
    let model = this.props.model
    let width = model.size.width
    let height = model.size.height
    const scaling = {
      x: 1,
      y: 1,
      z: 1
    }
    let unit = this.props.unit
    return (
        <svg
          id={this.props.svgID}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x={`0${unit}`}
          y={`0${unit}`}
          width={`${width * model.imageExportScaling}${unit}`}
          height={`${height * model.imageExportScaling}${unit}`}
          style={{
            background: model.background
          }}
          className='svg-export'
          viewBox={`0 0 ${width * model.imageExportScaling} ${height * model.imageExportScaling}`}
          >
        <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={model.background}
        />
        <g transform={`scale(${model.imageExportScaling})`}>
        {this.props.geometries.map((geometry, i) => {
          let geometry_unit = 'mm'
          if (geometry === undefined) {
            return null
          }
          if(geometry.type === 'GROUP') {
            geometry_unit = ''
          }
          if(geometry !== undefined) {
            if(geometry._export || model.exportAll) {
              return (
                <Geometry
                  key={i}
                  geometry={{...geometry,
                    unit: geometry_unit,
                    editable: false}}
                  unit={unit}
                  scaling={scaling}
                  />
              )
            }
          }
          return null
        })}
        {model.exportAll ? this.props.editableGeometries.map((geometry, i) => {
          let geometry_unit = 'px'
          if (geometry === undefined) {
            return null
          }
          if(geometry !== undefined) {
            if(geometry._export || model.exportAll) {
              return (
                <Geometry
                  key={i}
                  geometry={{...geometry,
                    unit: geometry_unit,
                    editable: true}}
                  unit={unit}
                  scaling={scaling}
                  />
              )
            }
          }
          return null
        }) : (
          <React.Fragment>
            {this.props.editableGeometries.filter(g => g._export).map((geometry, i) => {
              let geometry_unit = 'px'
              if (geometry === undefined) {
                return null
              }
              if(geometry !== undefined) {
                if(geometry._export || model.exportAll) {
                  return (
                    <Geometry
                      key={i}
                      geometry={{...geometry,
                        unit: geometry_unit,
                        editable: true}}
                      unit={unit}
                      scaling={scaling}
                      />
                  )
                }
              }
              return null
            })}
          </React.Fragment>
        )}

        </g>
        </svg>
    )
  }
}

SVGExport.defaultProps = {
  mountedCallback: () => { console.log('set component mounted callback'); },
  unit: 'mm'
}

export default SVGExport
