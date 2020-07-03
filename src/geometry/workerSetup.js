// https://www.fullstackreact.com/articles/introduction-to-web-workers-with-react/

export default class WebWorker {
  constructor(worker) {
    const code = worker.toString();
    const blob = new Blob(["(" + code + ")()"]);
    return new Worker(URL.createObjectURL(blob));
  }
}
