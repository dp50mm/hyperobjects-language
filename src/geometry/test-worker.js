/*eslint no-restricted-globals: [0]*/
export default () => {
  self.addEventListener("message", e => {
    // eslint-disable-line no-restricted-globals
    if(!e) return;
    console.log('worker test script');
    console.log(e);
    self.postMessage("test return message")
  })
}
