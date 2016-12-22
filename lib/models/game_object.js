
class GameObject {

  constructor(options, moveBounds) {
    this.moveBounds = Object.assign({
      minX: 0,
      minY: 0,
      maxX: options.canvas.width,
      maxY: options.canvas.height,
    }, moveBounds);
    this.width = options.width;
    this.height = options.height;
    this.velocity = options.velocity;
    this.sprite = options.sprite;
    // TODO is this needed?
    this.sprite.setBounds(
      this.sprite.x,
      this.sprite.y,
      this.width,
      this.height
    );
  }

  setX(x) {
    this.sprite.x = this.withinMoveBoundsX(x);
  }

  setY(y) {
    this.sprite.y = this.withinMoveBoundsY(y);
  }

  changeX(xDiff) {
    this.setX(this.sprite.x + xDiff);
  }

  changeY(yDiff) {
    this.setY(this.sprite.y + yDiff);
  }

  changePos(xDiff, yDiff) {
    this.changeX(xDiff);
    this.changeY(yDiff);
  }

  getX() {
    return this.sprite.x;
  }

  getY() {
    return this.sprite.y;
  }

  withinCanvas(posX, posY) {
    const bounds = this.sprite.getBounds();
    return (
      posX >= 0 &&
      (posX + bounds.width) <= this.canvas.width &&
      posY >= 0 &&
      (posY + bounds.height) <= this.canvas.height
    );
  }

  withinMoveBoundsX(newX) {
    const bounds = this.sprite.getBounds();
    if (newX < this.moveBounds.minX) newX = this.moveBounds.minX;
    if ((newX + bounds.width) > this.moveBounds.maxX) {
      newX = this.moveBounds.maxX - bounds.width;
    }
    return newX;
  }

  withinMoveBoundsY(newY) {
    const bounds = this.sprite.getBounds();
    if (newY < this.moveBounds.minY) newY = this.moveBounds.minY;
    if ((newY + bounds.height) > this.moveBounds.maxY) {
      newY = this.moveBounds.maxY - bounds.height;
    }
    return newY;
  }

}

export default GameObject;
