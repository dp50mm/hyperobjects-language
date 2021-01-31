import React, { Component } from 'react'
import download from '../../utils/download'
import SVGExport from '../SVGExport'
import { saveAs } from 'file-saver'
import {
  Button
} from 'semantic-ui-react'
import downloadPng from './exportUtils/downloadPng'
import downloadSVG from './exportUtils/downloadSVG'
import { jsPDF } from 'jspdf'
import 'svg2pdf.js'


class ExportControls extends Component {
  constructor(props) {
    super(props)
    this.downloadSVG = this.downloadSVG.bind(this)
    this.downloadPNG = this.downloadPNG.bind(this)
    this.downloadGCode = this.downloadGCode.bind(this)
    this.downloadJSON = this.downloadJSON.bind(this)
    this.triggerSVGExport = this.triggerSVGExport.bind(this)
    this.triggerPNGExport = this.triggerPNGExport.bind(this)
    this.triggerPDFExport = this.triggerPDFExport.bind(this)
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
  triggerPDFExport() {
    this.setState({
      renderSVG: true,
      export: "PDF"
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
  /**
   * Triggered by the SVG Export component callback when the SVG has been fully rendered.
   */
  triggerDownload() {
    if(this.state.export === 'SVG') {
      this.downloadSVG()
    } else if(this.state.export === 'PNG') {
      this.downloadPNG()
    } else if(this.state.export === 'PDF') {
      this.downloadPDF()
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
  downloadPDF() {
    const doc = new jsPDF({
      unit: 'mm',
      format: [
        this.props.model.size.width,
        this.props.model.size.height
      ]
    })
    var element = document.getElementById(this.props.svg_id)
    doc.svg(
      element,
      {x: 0, y: 0, width:this.props.model.size.width, height: this.props.model.size.height }
    ).then(() => {
      doc.save('testpdf.pdf')
    })
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
    var exportTypes = this.props.exportTypes

    var exportSVGButton = true
    var exportPDFButton = true
    var exportPNGButton = true
    var exportGCodeButton = true
    var exportJSONButton = true
    if(_.isArray(exportTypes)) {
      exportTypes = exportTypes.map(p => _.toLower(p))
      exportSVGButton = exportTypes.includes("svg")
      exportPDFButton = exportTypes.includes("pdf")
      exportPNGButton = exportTypes.includes("png")
      exportGCodeButton = exportTypes.includes("gcode")
      exportJSONButton = exportTypes.includes("json")
    }
    return (
      <div className='frame-controls export'>
        <p style={{marginBottom: 2}}>Exports</p>
        {exportSVGButton && (
          <Button size="tiny" className="control-button" onClick={this.triggerSVGExport}>
            <i className='pe-7s-vector pe-2x'></i>
            <p className='tooltip'>Download SVG</p>
          </Button>
        )}
        {exportPDFButton && (
          <React.Fragment>
          <br/>
          <Button size="tiny" className="control-button" onClick={this.triggerPDFExport}>
            PDF
            <p className='tooltip'>Download PDF</p>
          </Button>
          </React.Fragment>
        )}
        {exportPNGButton && (
          <React.Fragment>
            <br/>
          <Button size="tiny" className="control-button" onClick={this.triggerPNGExport}>
            <i className='pe-7s-photo pe-2x'></i>
            <p className='tooltip'>Download PNG</p>
          </Button>
          </React.Fragment>
        )}
        {exportGCodeButton && (
          <React.Fragment>
            <br/>
            <Button size="tiny" className="control-button" onClick={this.downloadGCode}>
              <i className='pe-7s-download pe-2x'></i>
              <p className='tooltip'>Download GCODE</p>
            </Button>
          </React.Fragment>
        )}
        {exportJSONButton && (
          <React.Fragment>
            <br/>
            <Button size="tiny" className="control-button" onClick={this.downloadJSON}>
              <i className='pe-7s-download pe-2x'></i>
              <p className='tooltip'>Download JSON</p>
            </Button>
          </React.Fragment>
        )}
        
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
  name: 'set name prop',
  exportTypes: false
}

export default ExportControls
