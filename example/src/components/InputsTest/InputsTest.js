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

let testModel = new Model('testing')
testModel.addInput('test', new Input([0, 1]))


const InputsTest = () => {
    return (
        <div className='inputs-test'>
            <Frame
                model={model}
                editable={true}
                width={800}
                height={800}
                updateParameters={(geometries, inputs) => console.log(geometries, inputs)}
                />
        </div>
    )
}

export default InputsTest