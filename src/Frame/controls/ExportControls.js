import React, { Component } from 'react'
import download from '../../utils/download'
import SVGExport from '../SVGExport'
import { saveAs } from 'file-saver'

function downloadSVG(svg_id, _name) {
  let name = 'svg-name'
  if(_name) {
    name = _name
  }
  let svgEl = document.getElementById(svg_id)
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgEl.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  svgEl.setAttribute("style", "enable-background:new 0 0 768 1366;");
  svgEl.setAttribute("xml:space", "preserve");
  var svgData = svgEl.outerHTML;
  var preface = '<?xml version="1.0" encoding="utf-8" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = `${name}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

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
      console.log('trigger 2d png export from SVG');
      this.setState({
        renderSVG: true,
        export: 'PNG'
      })
    } else if(this.props.model.dimensions === 3) {
      console.log(this.props.canvasID);
      var canvas = document.getElementById(this.props.canvasID);
      console.log(canvas);
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
    // SvgToPng.saveSvgAsPng(document.getElementById(this.props.svg_id), this.props.name)
    setTimeout(function () {
      this.setState({
        renderSVG: false,
        export: false
      })
    }.bind(this), 10);
  }
  downloadGCode() {
    let model = this.props.model
    let gcode = model.gcode.generate()
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
        <button onClick={this.triggerSVGExport}>
          <i className='pe-7s-vector pe-2x'></i>
          <p className='tooltip'>Download SVG</p>
        </button>
        <br/>
        <button onClick={this.triggerPNGExport}>
          <i className='pe-7s-photo pe-2x'></i>
          <p className='tooltip'>Download PNG</p>
        </button>
        <br/>
        <button onClick={this.downloadGCode}>
          <i className='pe-7s-download pe-2x'></i>
          <p className='tooltip'>Download GCODE</p>
        </button>
        <br/>
        <button onClick={this.downloadJSON}>
          <i className='pe-7s-download pe-2x'></i>
          <p className='tooltip'>Download JSON</p>
        </button>
        {this.state.renderSVG ? (
          <div style={{display: 'none'}}>
            <SVGExport
              model={this.props.model}
              geometries={this.props.geometries}
              editableGeometries={this.props.editableGeometries}
              mountedCallback={this.triggerDownload}
              svgID={`${this.props.svg_id}`}
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
