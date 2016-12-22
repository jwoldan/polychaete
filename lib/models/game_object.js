
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
    if (this.withinCanvas(x, this.sprite.y)) {
      this.sprite.x = x;
    }
  }

  setY(y) {
    if (this.withinCanvas(this.sprite.x, y)) {
      this.sprite.y = y;
    }
  }

  changeX(xDiff) {
    const newX = this.sprite.x + xDiff;
    if (this.withinCanvas(newX, this.sprite.y)) {
      this.sprite.x = newX;
    }
  }

  changeY(yDiff) {
    const newY = this.sprite.y + yDiff;
    if (this.withinCanvas(this.sprite.x, newY)) {
      this.sprite.y += yDiff;
    }
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

}

export default GameObject;
