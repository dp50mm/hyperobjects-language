function downloadSVG(element, name) {
  var svgData = element.outerHTML;
var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
var svgUrl = URL.createObjectURL(svgBlob);
var downloadLink = document.createElement("a");
downloadLink.href = svgUrl;
downloadLink.download = `${name}.svg`;
document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
}

export default downloadSVG;
