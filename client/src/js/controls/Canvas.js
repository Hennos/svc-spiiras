class Canvas{
  constructor({canvasID, constraints}) {
    this.constraints = constraints;
    this.canvas = window.getDocumentById(canvasID)
  }


  renderFrames(){
    setTimeout(() => {
      requestAnimationFrame(this.renderFrames);
      this.canvas.drawImage()
    }, 1000 / this.constraints.fps);
  }


}
