/*eslint no-restricted-globals: [0]*/
export default () => {
  self.addEventListener("message", e => {
    if(!e) return;
    console.log(e);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', e.data.model, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      if (this.status == 200) {
        var myBlob = this.response;
        console.log(myBlob);
        // myBlob is now the blob that the object URL pointed to.
      }
    };
    self.postMessage('returned rendered')
  })
}
