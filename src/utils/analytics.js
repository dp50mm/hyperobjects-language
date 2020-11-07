// import ReactGA from 'react-ga'
var analytics = {
  count: 0,
  shouldLogEvents: false, //
  initialized: false,
  initializeGoogleAnalytics: function() {
    // ReactGA.initialize('UA-92339423-4')
    // this.shouldLogEvents = true
    // this.initialized = true
  },
  initialize: function() {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      // this.initializeGoogleAnalytics()
    } else if(window.location.hostname === "hyperobjects.design" && this.initialized === false) {
      this.initializeGoogleAnalytics()
    }
  },
  event: function(action, category, label) {
    if(this.initialized && this.shouldLogEvents) {
      // ReactGA.event({
      //   category: category,
      //   action: action,
      //   label: label
      // });
    }
  }
}



export default analytics
