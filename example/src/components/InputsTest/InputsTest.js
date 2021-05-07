import React from 'react'
import {
    Frame,
    Model,
    Text,
    Input,
    InputText,
    Circle,
} from 'hyperobjects-language'

let model = new Model("inputs-test-model")

model.addInput(
    'test-input',
    new Input([0, 1], 0.5)
)

model.addInput(
    'second-test-input',
    new Input([100, 500], 150)
)

model.addInput(
    "text-input",
    new InputText("abc")
)

model.addProcedure(
    'testing-inputs',
    (self) => {
        const testInputValue = self.inputs['test-input'].value
        const secondInputValue = self.inputs['second-test-input'].value
        return new Circle({x: secondInputValue, y: 500}, 300 * testInputValue, 100)
    }
)

model.addProcedure(
    'text-input-test',
    (self) => {
        // console.log(self.inputs['text-input'].value)
        var textVal = self.inputs['text-input'].value

        return [...textVal].map((char, i) => {

            return new Text(char, {x: 10 + i * 25, y: 100}).fontSize(50).fill("black").fontFamily("custom-monospace").textAnchor("middle")
        })
    }
)

// let testModel = new Model('testing')
// testModel.addInput('test', new Input([0, 1]))


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