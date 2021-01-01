import React, { Component } from 'react'
import download from '../../utils/download'
import SVGExport from '../SVGExport'
import { saveAs } from 'file-saver'
import {
  Button
} from 'semantic-ui-react'
import downloadPng from './exportUtils/downloadPng'
import downloadSVG from './exportUtils/downloadSVG'




class ExportControls extends Component {
  constructor(props) {
    super(props)
    this.downloadSVG = this.downloadSVG.bind(this)
    this.downloadPNG = this.downloadPNG.bind(this)
    this.downloadGCode = this.downloadGCode.bind(this)
    this.downloadJSON = this.downloadJSON.bind(this)
    this.triggerSVGExport = this.triggerSVGExport.bind(this)
    this.triggerPNGExport = this.triggerPNGExport.bind(this)
    this.triggerDownload = this.triggerDownload.bind(this)
    this.state = {
      renderSVG: false,
      export: false
    }
  }
  triggerSVGExport() {
    this.setState({
      renderSVG: true,
      export: 'SVG'
    })
  }
  triggerPNGExport() {
    if(this.props.model.dimensions === 2) {
      this.setState({
        renderSVG: true,
        export: 'PNG'
      })
    } else if(this.props.model.dimensions === 3) {
      var canvas = document.getElementById(this.props.canvasID);
      let name = `${this.props.name}`
      canvas.toBlob(function(blob) {
          saveAs(blob, name);
      });
    }

  }
  triggerDownload() {
    if(this.state.export === 'SVG') {
      this.downloadSVG()
    } else if(this.state.export === 'PNG') {
      this.downloadPNG()
    }
  }
  downloadSVG() {
    if(this.props.svg_id) {
      downloadSVG(this.props.svg_id, this.props.name)
    } else {
      console.log('svg id is not set');
    }
  }
  downloadPNG() {
    downloadPng(this.props.svg_id, this.props.name, this.props.model)
    setTimeout(function () {
      this.setState({
        renderSVG: false,
        export: false
      })
    }.bind(this), 50);
  }
  downloadGCode() {
    let model = this.props.model
    let gcode = model.gcode.generate(model)
    download(`${model.name}.gcode`, gcode)
  }
  downloadJSON() {
    // downloads the serialised JSON parameters for the current model
    let model = this.props.model
    let geometries = model.extractGeometries()
    let json = JSON.stringify(geometries)
    download(`${model.name}.json`, json)
  }
  
  render() {
    return (
      <div className='frame-controls export'>
        <Button size="tiny" className="control-button" onClick={this.triggerSVGExport}>
          <i className='pe-7s-vector pe-2x'></i>
          <p className='tooltip'>Download SVG</p>
        </Button>
        <br/>
        <Button size="tiny" className="control-button" onClick={this.triggerPNGExport}>
          <i className='pe-7s-photo pe-2x'></i>
          <p className='tooltip'>Download PNG</p>
        </Button>
        <br/>
        <Button size="tiny" className="control-button" onClick={this.downloadGCode}>
          <i className='pe-7s-download pe-2x'></i>
          <p className='tooltip'>Download GCODE</p>
        </Button>
        <br/>
        <Button size="tiny" className="control-button" onClick={this.downloadJSON}>
          <i className='pe-7s-download pe-2x'></i>
          <p className='tooltip'>Download JSON</p>
        </Button>
        {this.state.renderSVG ? (
          <div style={{display: 'none'}}>
            <SVGExport
              model={this.props.model}
              geometries={this.props.geometries}
              editableGeometries={this.props.editableGeometries}
              mountedCallback={this.triggerDownload}
              svgID={`${this.props.svg_id}`}
              unit={this.props.export === 'SVG' ? "mm" : ""}
              />
          </div>
        ) : null}
      </div>
    )
  }
}

ExportControls.defaultProps = {
  svg_id: false,
  name: 'set name prop'
}

export default ExportControls
