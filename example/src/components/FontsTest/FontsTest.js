import React from "react"
import {
    Frame,
    Model,
    Text
} from "hyperobjects-language"

let model = new Model("fonts-test")


var fonts = [
    "roboto-extra-light",
    "roboto-extra-light-italic",
    "roboto-light",
    "roboto-light-italic",
    "roboto-regular",
    "roboto-medium",
    "roboto-medium-italic",
    "roboto-semi-bold",
    "roboto-semi-bold-italic",
    "roboto-bold",
    "roboto-bold-italic"
]

var fonts2 = [
    "europa-light",
    "europa-light-italic",
    "europa",
    "europa-italic",
    "europa-bold",
    "europa-bold-italic",
    "futura",
    "custom-monospace"
]

model.addProcedure(
    "fonts",
    (self) => {
        var output = []
        fonts.forEach((font, i) => {
            output.push(
                new Text(font, {x: 100, y: 100 + i * 50})
                    .fontFamily(font)
                    .fontSize(60)
                    .export(true)
            )
            
        })
        fonts2.forEach((font, i) => {
            output.push(
                new Text(font, {x: 600, y: 100 + i * 50})
                    .fontFamily(font)
                    .fontSize(60)
                    .export(true)
            )
            
        })
        return output

    }
)

const FontsTest = () => {
    return (
        <div className='fonts-test'>
            <Frame
                model={model}
                width={700}
                height={700}
                showZoomControls={true}
                exportControls={true}
                showBounds={true}
                />
        </div>
    )
}

export default FontsTest