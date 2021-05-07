import React, { useContext } from 'react'
import './inputs.scss'
import ModelContext from '../../ModelContext';

import {
    Card
} from 'semantic-ui-react'
import _ from 'lodash'
import {
    INPUT,
    INPUT_TEXT
} from "../../../geometry/types"
import InputSlider from "./InputSlider"
import InputText from "./InputText"

const Inputs = ({ modelDispatch }) => {
    const { name, inputs, inputsList } = useContext(ModelContext)
    return (
        <Card className='inputs'>
            <Card.Content>
            <h3>{name}</h3>
            {inputsList.map(inputName => {
                let input = inputs[inputName]
                if(input.type === INPUT) {
                    return (
                        <InputSlider
                            key={inputName} 
                            inputName={inputName}
                            input={input}
                            modelDispatch={modelDispatch}
                            />
                    )
                }
                if(input.type === INPUT_TEXT) {
                    return (
                        <InputText
                            key={inputName} 
                            inputName={inputName}
                            input={input}
                            modelDispatch={modelDispatch}
                            />
                    )
                }
                return null
            })}
            </Card.Content>
        </Card>
    )
}

export default Inputs