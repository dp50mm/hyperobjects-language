import React, { useContext } from 'react'
import styles from './inputs.module.scss'
import ModelContext from '../../ModelContext';
import { Slider } from '@material-ui/core'
import {INPUT_SET_VALUE} from '../../reducer/actionTypes'

const Inputs = ({ modelDispatch }) => {
    const { inputs, inputsList } = useContext(ModelContext)
    return (
        <div className={styles.inputs}>
            <h3>Inputs</h3>
            {inputsList.map(inputName => {
                let input = inputs[inputName]
                return (
                    <div key={inputName} className={styles.inputs.input}>
                        <p>{inputName}</p>
                        <Slider
                            defaultValue={input.range[0]}
                            min={input.range[0]}
                            max={input.range[1]}
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