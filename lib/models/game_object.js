
class GameObject {

  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.velocity = options.velocity;
    this.canvas = options.canvas;
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
    this.sprite.x = this.withinCanvasX(x);
  }

  setY(y) {
    this.sprite.y = this.withinCanvasY(y);
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

  withinCanvasX(newX) {
    const bounds = this.sprite.getBounds();
    if (newX < 0) newX = 0;
    if ((newX + bounds.width) > this.canvas.width) {
      newX = this.canvas.width - bounds.width;
    }
    return newX;
  }

  withinCanvasY(newY) {
    const bounds = this.sprite.getBounds();
    if (newY < 0) newY = 0;
    if ((newY + bounds.height) > this.canvas.height) {
      newY = this.canvas.height - bounds.height;
    }
    return newY;
  }

}

export default GameObject;
