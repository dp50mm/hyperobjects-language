import React from 'react'
import _ from "lodash"
import { Slider } from '@material-ui/core'
import {INPUT_SET_VALUE} from '../../reducer/actionTypes'

const Input = ({ input, inputName, modelDispatch }) => {
    let min = _.get(input, 'range[0]', 0)
    let max = _.get(input, 'range[1]', 1)
    
    if(!_.isNumber(min)) min = parseFloat(min)
    if(!_.isNumber(max)) max = parseFloat(max)
    return (
        <div className='input'>
            <p>{inputName}</p>
            <Slider
                value={_.get(input, 'value', min)}
                min={min}
                max={max}
                step={0.01}
                valueLabelDisplay="auto"
                onChange={(e, value) => {
                    modelDispatch({
                        type: INPUT_SET_VALUE,
                        payload: {
                            name: inputName,
                            value: value
                        }
                    })
                }}
                />
        </div>
    )
}

export default Input