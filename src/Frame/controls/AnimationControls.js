import React from 'react'
import {
  Button
} from 'semantic-ui-react'

const AnimationControls = ({playing, playCallback, pauseCallback, rewindCallback, animation_frame }) => {
  return (
    <div className='frame-controls animation'>
      {playing ? (
        <Button size="tiny" className='control-button' onClick={pauseCallback}>
          <i className='pe-7s-close pe-2x'></i>
          <p className='tooltip'>Pause animation <i className='animation-frame'>frame: {animation_frame}</i></p>
        </Button>
      ) : (
        <Button size="tiny"  className='control-button' onClick={playCallback}>
          <i className="pe-7s-play pe-2x"></i>
          <p className='tooltip'>Start animation <i className='animation-frame'>frame: {animation_frame}</i></p>
        </Button>
      )}
      <br />
      <Button size="tiny"  className='control-button' onClick={rewindCallback}>
        <i className="pe-7s-prev pe-2x"></i>
        <p className='tooltip'>Rewind animation <i className='animation-frame'>frame: {animation_frame}</i></p>
      </Button>
    </div>
  )
}

AnimationControls.defaultProps = {
  playing: false,
  playCallback: () => { console.log('set AnimationControls playCallback prop');},
  pauseCallback: () => { console.log('set AnimationControls pauseCallback prop');},
  rewindCallback: () => { console.log('set AnimationControls rewindCallback prop');}
}

export default AnimationControls
