import React from "react"
import {
    Input
} from "semantic-ui-react"
import {
    INPUT_SET_VALUE
} from '../../reducer/actionTypes'

const InputText = ({ input, inputName, modelDispatch }) => {
    return (
        <div className='input'>
            <p>{inputName}</p>
            <Input
                size="mini"
                value={_.get(input, "value", "")}
                onChange={(e) => {
                    modelDispatch({
                        type: INPUT_SET_VALUE,
                        payload: {
                            name: inputName,
                            value: e.target.value
                        }
                    })
                }}
                fluid
                style={{marginTop: 10, marginBottom: 10}}
                />
        </div>
    )
}

export default InputText