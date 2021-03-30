import React from "react"
import {
    Model,
    Path,
    Frame,
    Input
} from "hyperobjects-language"
import _ from "lodash"

var model = new Model("curve-fitting-test")

model.addInput(
    "error",
    new Input([0, 2250], 20)
)

model.addEditableGeometry(
    "source",
    new Path(_.range(100, 900, 150).map((val, i) => {
        return {
            x: val,
            y: 500 + Math.sin(i/2) * 100
        }
    })).strokeOpacity(0.1)
)

model.addProcedure(
    "fit-curve",
    (self) => {
        return self.geometries['source'].fitCurve(self.inputs['error'].value).strokeOpacity(1).strokeWidth(2)
    }
)

const CurveFittingTest = () => {
    return (
        <div className='curve-fitting-test'>
            <p>Curve fitting test</p>
            <Frame
                model={model}
                width={600}
                height={600}
                editable={true}
                />
        </div>
    )
}

export default CurveFittingTest