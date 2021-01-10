export function wrapString(text) {
  return "'"+text+"'";
}

let increment = 0

export function hyperobjectsLanguageWrapper(modelCode, modelMeta) {
  increment += 1
  let modelName = "temp-name"
  if(modelMeta) {
    if(modelMeta.name) {
      modelName = modelMeta.name
    }
  }
  let test_name = 'hello'
  return {
    id: increment,
    script: `
  var Model = window.HYPEROBJECTS.Model
  var Input = window.HYPEROBJECTS.Input
  
  var Point = window.HYPEROBJECTS.Point
  var Group = window.HYPEROBJECTS.Group
  var Path = window.HYPEROBJECTS.Path
  var Segment = window.HYPEROBJECTS.Segment
  var Text = window.HYPEROBJECTS.Text
  var Rectangle = window.HYPEROBJECTS.shapes.Rectangle
  var Circle = window.HYPEROBJECTS.shapes.Circle
  var Voronoi = window.HYPEROBJECTS.shapes.Voronoi
  var HexPattern = window.HYPEROBJECTS.shapes.HexPattern
  var _ = window.HYPEROBJECTS.lodash
  var animate = window.HYPEROBJECTS.animate
  var EasingFunctions = window.HYPEROBJECTS.EasingFunctions

  var ogl = window.HYPEROBJECTS.EXTRA_LIBRARIES.ogl
  var chroma = window.HYPEROBJECTS.EXTRA_LIBRARIES.chroma
  var model = new Model(${wrapString(modelName)},${wrapString(test_name)})
  model.setSize({
    width: 1000,
    height: 1000
  })
  try {
    ${modelCode}
  } catch(err) {
    window.EDITOR_ERROR = {
      description: err.message,
      lineNumber: 0
    }
  }
  window.OUTPUTMODEL${increment} = model
  `}
}

export function executeCode(code) {
  var elements = document.getElementsByClassName('dynamic-script-element');
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
  var script = document.createElement("script");
  let scriptText = code;
  script.innerHTML = scriptText.script;
  script.className = 'dynamic-script-element'
  document.getElementsByTagName('body')[0].append(script);
  return scriptText.id
}
