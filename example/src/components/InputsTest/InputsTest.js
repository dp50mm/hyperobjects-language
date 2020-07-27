import React from 'react'
import {
    Frame,
    Model,
    Input,
    Circle
} from 'hyperobjects-language'

let model = new Model("inputs-test-model")

model.addInput(
    'test-input',
    new Input([0, 1])
)

model.addInput(
    'second-test-input',
    new Input([100, 500])
)

model.addProcedure(
    'testing-inputs',
    (self) => {
        const testInputValue = self.inputs['test-input'].value
        const secondInputValue = self.inputs['second-test-input'].value
        return new Circle({x: secondInputValue, y: 500}, 300 * testInputValue, 100)
    }
)

const InputsTest = () => {
    console.log('inputs test', model)
    return (
        <div className='inputs-test'>
            <Frame
                model={model}
                editable={true}
                width={800}
                height={800}
                />
        </div>
    )
}

export default InputsTest