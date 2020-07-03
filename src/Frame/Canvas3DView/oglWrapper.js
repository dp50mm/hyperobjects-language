import {
  Renderer,
  Camera,
  Transform,
  Geometry,
  Program,
  Mesh,
  Orbit,
  Vec3
} from 'ogl'
import defaultShader from './shaders/defaultShader'
import {
  GROUP,
  PATH,
  TEXT,
  RECTANGLE
} from '../../geometry/types';
import chroma from 'chroma-js'

let views = []

function createNewView(canvasContainer, backgroundColor) {
  const renderer = new Renderer()
  const gl = renderer.gl;
  let chromaBackground = backgroundColor === 'transparent' ? chroma('white') : chroma(backgroundColor)
  console.log(chromaBackground);
  gl.clearColor(...chromaBackground._rgb)

  const camera = new Camera(gl, {fov: 14.3, near: 0.1, far: 100000})
  camera.position.x = 500
  camera.position.y = 500
  camera.position.z = 4000
  camera.lookAt([500,500,0])

  const controls = new Orbit(camera, {
    element: canvasContainer,
    target: new Vec3(500, 500, 0)
  })
  let canvasCreated = false

  const scene = new Transform()

  const program = new Program(gl, {
    vertex: defaultShader.vertex,
    fragment: defaultShader.fragment,
    uniforms: {
      uTime: { value: 0 }
    }
  })
  return {
    renderer: renderer,
    gl: gl,
    camera: camera,
    canvasCreated: false,
    scene: scene,
    program: program,
    controls: controls
  }
}

let animating = false

function oglWrapper(
  canvasContainer,
  canvasID,
  size,
  editableGeometries,
  displayGeometries,
  backgroundColor
) {
  if(views[canvasID] === undefined) {
    views[canvasID] = createNewView(canvasContainer, backgroundColor)
    let gl = views[canvasID].gl
    canvasContainer.appendChild(gl.canvas)
  }
  if(views[canvasID].canvasCreated !== true) {
    let gl = views[canvasID].gl

    views[canvasID].canvasCreated = true
    views[canvasID].scene.children = []
    editableGeometries.forEach(g => {
      createMesh(g, gl, canvasID)
    })
    displayGeometries.forEach(g => {
      createMesh(g, gl, canvasID)
    })
    views[canvasID].renderer.setSize(size.width, size.height)
    views[canvasID].camera.perspective({aspect: gl.canvas.width / gl.canvas.height})
    gl.canvas.id = canvasID

    views[canvasID].program.uniforms.uTime.value = 0.0
    views[canvasID].gl = gl
  } else {
    let gl = views[canvasID].gl
    editableGeometries.forEach(g => {
      createMesh(g, gl, canvasID)
    })
    displayGeometries.forEach(g => {
      createMesh(g, gl, canvasID)
    })
    //views[canvasID].renderer.setSize(size.width, size.height)
    // views[canvasID].camera.perspective({aspect: gl.canvas.width / gl.canvas.height})
    console.log(views[canvasID]);
    views[canvasID].renderer.render({scene: views[canvasID].scene, camera: views[canvasID].camera})

  }
  views[canvasID].renderer.render({scene: views[canvasID].scene, camera: views[canvasID].camera})
  if(animating === false) {
    requestAnimationFrame(update);
    animating = true
  }

  function update() {
      requestAnimationFrame(update);
      // Need to update controls every frame
      views[canvasID].controls.update();
      views[canvasID].renderer.render({scene: views[canvasID].scene, camera:  views[canvasID].camera});
  }
}

function createMesh(g, gl, canvasID) {
  if(g.type === GROUP || g.type === PATH) {
    let indices = []
    let uv = []
    const vertices = g.points.reduce((arr, p, i) => {
      arr.push(p.x)
      arr.push(p.y)
      arr.push(p.z)
      indices.push(i)
      if(g.type === PATH) {
        if(i < g.points.length - 1) {
          let nextPoint = g.points[i + 1]
          // arr.push(nextPoint.x)
          // arr.push(nextPoint.y)
          // arr.push(nextPoint.z)
          indices.push(i + 1)
        }
      }



      uv.push(0)
      uv.push(0)
      return arr
    }, [])
    let geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(vertices) },
      uv: { size: 2, data: new Float32Array(uv) },
      index: { data: new Uint16Array(indices)}
    })
    let mode = g.type === GROUP ? gl.POINTS : gl.LINES
    let mesh = new Mesh(gl, {
      mode: mode, geometry, program: views[canvasID].program})
    mesh.setParent(views[canvasID].scene)
  }
}

export function resetCanvas(canvasID) {
  //document.getElementById(canvasID).outerHTML = ""
  views[canvasID].canvasCreated = false
}

export default oglWrapper
