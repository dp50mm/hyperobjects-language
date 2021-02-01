import React, { useContext } from 'react'
import './inputs.scss'
import ModelContext from '../../ModelContext';
import { Slider } from '@material-ui/core'
import {
    Card
} from 'semantic-ui-react'
import _ from 'lodash'
import {INPUT_SET_VALUE} from '../../reducer/actionTypes'

const Inputs = ({ modelDispatch }) => {
    const { name, inputs, inputsList } = useContext(ModelContext)
    return (
        <Card className='inputs'>
            <Card.Content>
            <h3>{name}</h3>
            {inputsList.map(inputName => {
                let input = inputs[inputName]
                let min = _.get(input, 'range[0]', 0)
                let max = _.get(input, 'range[1]', 1)
                
                if(!_.isNumber(min)) min = parseFloat(min)
                if(!_.isNumber(max)) max = parseFloat(max)
                return (
                    <div key={inputName} className='input'>
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
            })}
            </Card.Content>
        </Card>
    )
}

export default Inputs