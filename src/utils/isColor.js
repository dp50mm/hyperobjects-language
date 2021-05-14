import _ from "lodash"


var colorTest = new Option().style

function isColor(strColor){
    if(!_.isString(strColor)) {
        return false
    }
    if(strColor.length === 0) {
        return false
    }
    colorTest.color = ""
    // console.log(s)
    colorTest.color = strColor;
    // console.log(s.color, strColor)
    return colorTest.color.length > 0
}

export default isColor