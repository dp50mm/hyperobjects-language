import React from "react"
import {
    Model,
    Group,
    Path,
    Circle,
    Frame
} from "hyperobjects-language"

const model = new Model("constraints-test")


model.addEditableGeometry(
    "group",
    new Group([
        {
            x: 100, y: 100,
            constraints: {
                show: true,
                x: {
                    min: 100, max: 100
                },
                y: {
                    min: 100, max: 900
                }
            }
        },
        {
            x: 150, y: 100,
            constraints: {
                show: true,
                x: {
                    min: 150, max: 250
                },
                y: {
                    min: 100, max: 900
                }
            }
        },
        {
            x: 400, y: 500,
            constraint: new Circle({x: 500, y: 500}, 100, 100)
        }
    ])
)

const ConstraintsTest = () => {
    return (
        <div className="constraints-test">
            <p>Point constraints</p>
            <Frame 
                model={model}
                width={500}
                height={500}
                editable={true}
                />
        </div>
    )
}

export default ConstraintsTest