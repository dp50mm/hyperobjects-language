import {
    Frame,
    Model,
    Group,
    Path,
    saveAs
} from "hyperobjects-language"

let model = new Model("download-file-api-test")

model.addEditableGeometry(
    "test-points",
    new Group([
        {x: 100, y: 500},
        {x: 900, y: 500}
    ])
)

model.animated = true

model.addAnimation(
    "test-download",
    (self) => {

        if(self.animation_frame === 1) {
            var points = self.geometries['test-points'].points.map(p => {
                return {
                    x: p.x,
                    y: p.y
                }
            })
            var blob = new Blob([JSON.stringify(points)], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "test-points.json")
        } 
        
    }
)

const DownloadFileApiTest = () => {
    return (
        <div className='download-file-api-test'>
            <Frame
                model={model}
                editable={true}
                exportControls={true}
                renderControls={true}
                animationControls={true}
                width={800}
                height={800}
                />
        </div>
    )
}

export default DownloadFileApiTest