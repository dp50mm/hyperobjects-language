import React from 'react'
import _ from 'lodash'
import styles from '../frame.module.css'
const SelectBox = ({
    mouseDownPoint,
    mouseSelect
}) => {
    let x = _.min([
        mouseDownPoint.x,
        mouseSelect.x
    ])
    let y = _.min([
        mouseDownPoint.y,
        mouseSelect.y
    ])
    let dx = Math.abs(mouseDownPoint.x - mouseSelect.x)
    let dy = Math.abs(mouseDownPoint.y - mouseSelect.y)
    return (
        <rect
            className={styles['select-box']}
            x={x}
            y={y}
            width={dx}
            height={dy}
            />
    )
}
export default SelectBox