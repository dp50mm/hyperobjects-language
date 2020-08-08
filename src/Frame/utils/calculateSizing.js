function calculateSizing(props, state, model, designerRef) {
    let svgPadding = props.svgPadding
    let modelSize = props.model.size
    let width = props.width;
    let height = props.height;
    let scaleToContainer = props.scaleToContainer
    /**
     * Currently disabled functionality
     * Intended functionality is if the frame is larger than the screen size
     * Scale down the frame element to fit the screen size with padding around it
     * defined by the screenPadding variable
     */
    let modelAspectRatio = modelSize.width / modelSize.height
    
    let aspect_ratio = width / height;
    if(designerRef.current !== null) {
      let container = {
        width: designerRef.current.getBoundingClientRect().width,
        height: designerRef.current.getBoundingClientRect().height
      }
      if(scaleToContainer && state.containerRendered) {
        if(container.width < width) {
          width = container.width;
          height = width * aspect_ratio;
        }
      }
      if(props.fitInContainer && props.maintainAspectRatio) {
        height = props.height
        width = height / modelAspectRatio
      }
    }
    if(state.render && model.exportResolution) {
      return model.exportResolution
    }

    aspect_ratio = height / width
    return {
      width: width - svgPadding * 2,
      height: height - svgPadding * 2 * aspect_ratio
    }
}

export default calculateSizing