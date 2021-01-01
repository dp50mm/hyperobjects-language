import React, { Component } from 'react'
import {
  Button
} from 'semantic-ui-react'
import RenderSettingsPopup from './RenderSettingsPopup'


class RenderControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSettings: false
    }
    this.toggleSettings = this.toggleSettings.bind(this)
  }
  toggleSettings() {
    this.setState({
      showSettings: !this.state.showSettings
    })
  }
  render() {
    return (
      <div className='frame-controls'>
        <Button size='tiny' className='control-button' onClick={this.props.renderCallback}>
          <i className='pe-7s-video pe-2x'></i>
          <p className='tooltip'>Render animation</p>
        </Button>
        <br />
        <Button size='tiny' className='control-button' onClick={this.toggleSettings}>
          <i className='pe-7s-settings pe-2x'></i>
          <p className='tooltip'>Animation settings</p>
        </Button>
        {this.state.showSettings ? (
          <RenderSettingsPopup {...this.props} />
        ) : null}
      </div>
    )
  }
}

RenderControls.defaultProps = {
  renderCallback: false,
  startFrameCallback: false,
  endFrameCallback: false,
  startFrame: 0,
  endFrame: 0

}
export default RenderControls
