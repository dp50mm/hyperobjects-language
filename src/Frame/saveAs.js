function saveAs( blob, name , callback) {
    "use strict";

    // Inspired by Syntax: http://stackoverflow.com/questions/23451726/saving-binary-data-as-file-using-javascript-from-a-browser/23451803#23451803
    // Initially created to work around a bug in eligray/FileSaver.js
    // which prevented saving multiple files
    // (Issue 165: https://github.com/eligrey/FileSaver.js/issues/165 ).

    // Create a hidden `a` element.
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.cssText = "display: none";

    // createObjectURL() will leak memory.
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.parentNode.removeChild(a);
    call_after_DOM_updated(callback)
}

function call_after_DOM_updated(fn)
{
    setTimeout(function () {
        const intermediate = function () {
            setTimeout(function () {
                window.requestAnimationFrame(fn)
            }, 10);

        }
        const intermediate2 = function () {
            setTimeout(function () {
                window.requestAnimationFrame(intermediate)
            }, 10);

        }
        setTimeout(function () {
            window.requestAnimationFrame(intermediate2)
        }, 10);

    }, 10);

}

export default saveAs
