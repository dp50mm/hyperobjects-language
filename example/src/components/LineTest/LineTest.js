import {
    Model,
    Line,
    Frame,
    Circle
} from 'hyperobjects-language'
import _ from "lodash"

var model = new Model("line-test")

model.addEditableGeometry(
    "line-1",
    new Line([{x: 100, y: 500}, {x: 500, y: 500}]).r(5)
)

model.addEditableGeometry(
    "line-2",
    new Line([{x: 450, y: 200}, {x: 600, y: 400}]).r(5)
)

model.addEditableGeometry(
    "line-3",
    new Line([{x: 300, y: 400}, {x: 600, y: 200}]).r(5)
)

model.addEditableGeometry(
    "line-without-points",
    new Line()
)

model.addProcedure(
    "procedure-line-test",
    (self) => {
        var line1 = self.geometries['line-1']
        var line2 = self.geometries['line-2']
        return [
            new Line([line1.points[0], line2.points[0]])
        ]
    }
)

model.addProcedure(
    "intersections",
    (self) => {
        var line1 = self.geometries['line-1']
        var line2 = self.geometries['line-2']
        var line3 = self.geometries['line-3']
        var intersects = [
            line1.lineIntersect(line2),
            line1.lineIntersect(line3),
            line2.lineIntersect(line3)
        ]
        return intersects.map(intersect => {
            var circle = new Circle(intersect, 15, 20)
            var bounds = [intersect.seg1, intersect.seg2]
            if(_.every(bounds)) {
                circle.fill("black").fillOpacity(1)
            } else if(_.some(bounds)) {
                circle.fill("rgb(0,150,250)").fillOpacity(1)
            } else {
                circle.fillOpacity(0)
            }
            return circle
        })

    }
)

const LineTest = () => {
    return (
        <div className="line-test">
            <Frame
                model={model}
                editable={true}
                width={800}
                height={800}
                showBounds={true}
                />
        </div>
    )
}

export default LineTest