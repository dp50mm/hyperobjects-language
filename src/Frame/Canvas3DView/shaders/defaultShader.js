export const vertexShader = `
precision highp float;
precision highp int;
attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
varying vec2 vUv;
void main() {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 5.0;
}
`

export const fragmentShader = `precision highp float;
    precision highp int;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
    }
`

export const defaultShader = {
  vertex: vertexShader,
  fragment: fragmentShader
}

export default defaultShader
