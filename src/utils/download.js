function download(filename, text) {
    var pom = document.createElement('a');
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    var url = URL.createObjectURL(blob);
    pom.setAttribute('href', url);
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

export default download;
