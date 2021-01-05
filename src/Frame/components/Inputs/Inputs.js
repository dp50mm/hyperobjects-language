import React, { useContext } from 'react'
import './inputs.scss'
import ModelContext from '../../ModelContext';
import { Slider } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

import {INPUT_SET_VALUE} from '../../reducer/actionTypes'

const CustomSlider = withStyles({
    root: {
        color: '#15232E'
    },
    thumb: {
        '&:focus, &:hover, &:active': {
        boxShadow: '0px 0px 0px 1px rgba(234, 52, 76, 0.0)',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
            boxShadow: "none",
        },
        }
    }
})(Slider);

const Inputs = ({ modelDispatch }) => {
    const { inputs, inputsList } = useContext(ModelContext)
    return (
        <div className='inputs'>
            <h3>Inputs</h3>
            {inputsList.map(inputName => {
                let input = inputs[inputName]
                let min = _.get(input, 'range[0]', 0)
                let max = _.get(input, 'range[1]', 1)
                return (
                    <div key={inputName} className='input'>
                        <p>{inputName}</p>
                        <CustomSlider
                            defaultValue={min}
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
            })}
        </div>
    )
}

export default Inputs