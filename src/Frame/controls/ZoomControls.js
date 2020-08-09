import React from 'react'
import {
    Button
} from 'semantic-ui-react'
import styles from './controls.module.scss'

const ZoomControls = ({
    fitToFrame,
    moveToZero
}) => {
    return (
        <div className={styles['zoom-controls']}>
            <div className={`${styles['zoom-controls']} ${styles['buttons']}`}>
            <Button.Group size="tiny">
                <Button onClick={() => fitToFrame()}>Fit to window</Button>
                <Button onClick={() => moveToZero()}>Move to zero</Button>
            </Button.Group>
            </div>
        </div>
    )
}

export default ZoomControls