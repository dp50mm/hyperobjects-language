function downloadSVG(svg_id, _name) {
    let name = 'svg-name'
    if(_name) {
        name = _name
    }
    let svgEl = document.getElementById(svg_id)
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgEl.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svgEl.setAttribute("style", "enable-background:new 0 0 768 1366;");
    svgEl.setAttribute("xml:space", "preserve");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" encoding="utf-8" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `${name}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export default downloadSVG