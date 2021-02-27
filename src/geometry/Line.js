import Point from './Point'

var line_id = 0

function Line(p1, p2, name, attributes) {
    line_id += 1
    let lineName = `LINE-${line_id}`
    if (name !== undefined) {
        lineName = name
    }
    this.name = lineName
    this.id = line_id

    this.unit = 'px'
    this.displayUnit = 'mm'
    this._export = false
    this.export = function(shouldExport) {
        this._export = shouldExport
        return this
    }
    this.clone = function() {
        return _.cloneDeep(this)
    }

    // Set p1
    if (p1 instanceof Point) {
        this.p1 = p1
    } else {
        if(_.isArray(p1)) {
            this.p1 = new Point({
                x: _.get(p1, 0, 0),
                y: _.get(p1, 1, 0),
                z: _.get(p1, 2, 0)
            })
        } else {
            this.p1 = new Point({
                x: _.get(p1, 'x', 0),
                y: _.get(p1, 'y', 0),
                z: _.get(p1, 'z', 0)
            })
        }
    }
    // Set p2
    if (p1 instanceof Point) {
        this.p1 = p1
    } else {
        if(_.isArray(p1)) {
            this.p1 = new Point({
                x: _.get(p1, 0, 0),
                y: _.get(p1, 1, 0),
                z: _.get(p1, 2, 0)
            })
        } else {
            this.p1 = new Point({
                x: _.get(p1, 'x', 0),
                y: _.get(p1, 'y', 0),
                z: _.get(p1, 'z', 0)
            })
        }
    }
}