import {
    Model,
    Frame,
    Voronoi,
    Group,
    Path
} from 'hyperobjects-language'
import _ from 'lodash'

const model = new Model('voronoi-test')
model.addEditableGeometry(
    'voronoi-source',
    new Group(_.range(15).map(p => {
        return {
            x: 100 + Math.random() * 800,
            y: 100 + Math.random() * 800
        }
    }))
)
model.addProcedure(
    'voronoi',
    (self) => {
        var points = self.geometries['voronoi-source'].points
        var triangles = Voronoi.triangles(points.map(p => { return [p.x, p.y] }))
        return triangles.map(t => {
            return new Path([
                {x: t[0][0], y: t[0][1]},
                {x: t[1][0], y: t[1][1]},
                {x: t[2][0], y: t[2][1]},
            ])
        })
    }
)


const VoronoiTest = () => {
    return (
        <div className='voronoi-test'>
            <p>Voronoi test</p>
            <Frame
                width={600}
                height={600}
                model={model}
                editable={true}
                maintainAspectRatio={true}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                />
        </div>
    )
}

export default VoronoiTest