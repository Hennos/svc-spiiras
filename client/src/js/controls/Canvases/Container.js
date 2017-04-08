class Container {

  constructor({maxObjectsInLine, objectSize, basePosition, isHorizontal}) {

    this._isHorizontal = isHorizontal;
    this._maxObjectsInLine = maxObjectsInLine;
    this._objectWidth = objectSize.width;
    this._objectHeight = objectSize.height;
    this.positionX = basePosition.x;
    this.positionY = basePosition.y;

    this.width = 0;
    this.height = 0;

    this.objects = [];
    this._currentLine = [];

    this._currentX = this.positionX;
    this._currentY = this.positionY;
    this._currentLinesNumber = 0;

  }

  addNewObject(name) {
    let element = {name, coordinates: {x: this._currentX, y: this._currentY}};
    this.objects.push(element);
    this._currentLine.push(element);
    this.objects[this.objects.length-1].positionInLine = this._currentLine.length-1;

    if (this._currentLine.length === this._maxObjectsInLine) {
      this._currentLine = [];
      if (this._isHorizontal) {
        this._currentX = this.positionX;
        this._currentY += this._objectHeight;
      }
      else {
        this._currentY = this.positionY;
        this._currentX += this._objectWidth;
      }
    } else {
      if (this._isHorizontal) {
        this._currentX += this._objectWidth;
      }
      else {
        this._currentY += this._objectHeight;
      }
    }

    this._allLines = Math.floor(this.objects.length / this._maxObjectsInLine);
    this._allLines = ((this.objects.length - this._allLines*this._maxObjectsInLine) === 0) ? this._allLines : (this._allLines + 1);
    this.objects[this.objects.length-1].line = this._allLines;



    if (this._isHorizontal) {
      if (this.width < this._maxObjectsInLine * this._objectWidth)
        this.width = this._currentLine.length * this._objectWidth;

      this.height = this._allLines * this._objectHeight;

    } else {
      if (this.height < this._maxObjectsInLine * this._objectHeight)
        this.height = this._currentLine.length * this._objectHeight;
      this.width = this._allLines * this._objectWidth;
    }

  }

  deleteObject(name) {

    this.objects.forEach((element, index)=> {
      if (element.name === name) {

        let firstElementIndexInLine = index-element.positionInLine;
        //console.log(firstElementIndexInLine);
        this._currentX = this.objects[firstElementIndexInLine].coordinates.x;
        this._currentY = this.objects[firstElementIndexInLine].coordinates.y;

        let newElements = this.objects.splice(
          firstElementIndexInLine,
          this.objects.length - firstElementIndexInLine
        );

        newElements.splice(element.positionInLine, 1);

        this._currentLine = [];
        newElements.forEach((newElement)=> {
          this.addNewObject(newElement.name);
        });
      }
    });

  };

  isEmpty(){
    return (this.objects.length === 0);
  }

  _reloadContainerFromLine(lineIndex) {

  }

  searchElement(object) {

  }

  _recalculateContainerSize() {

  }


}

export default Container;
