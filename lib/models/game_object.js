class GameObject {

  constructor(options, moveBounds) {
    const canvas = options.stage.canvas;
    this.moveBounds = Object.assign({
      minX: 0,
      minY: 0,
      maxX: canvas.width,
      maxY: canvas.height,
    }, moveBounds);

    this.stage = options.stage;
    this.sprite = options.sprite;
    this.sprite.x = options.x;
    this.sprite.y = options.y;
    this.sprite.setBounds(
      options.x,
      options.y,
      options.width,
      options.height
    );

    this.stage.addChild(this.sprite);
  }

  setX(x) {
    this.sprite.x = x;
  }

  setY(y) {
    this.sprite.y = y;
  }

  changeX(xDiff) {
    this.sprite.x += xDiff;
  }

  changeY(yDiff) {
    this.sprite.y += yDiff;
  }

  setBoundedX(x) {
    this.sprite.x = this.withinMoveBoundsX(x);
  }

  setBoundedY(y) {
    this.sprite.y = this.withinMoveBoundsY(y);
  }

  changeBoundedX(xDiff) {
    this.setBoundedX(this.sprite.x + xDiff);
  }

  changeBoundedY(yDiff) {
    this.setBoundedY(this.sprite.y + yDiff);
  }

  changeBoundedPos(xDiff, yDiff) {
    this.changeBoundedX(xDiff);
    this.changeBoundedY(yDiff);
  }

  getX() {
    return this.sprite.x;
  }

  getY() {
    return this.sprite.y;
  }

  getWidth() {
    return this.sprite.getBounds().width;
  }

  getHeight() {
    return this.sprite.getBounds().height;
  }

  getMaxX() {
    return this.getX() + this.getWidth();
  }

  getMaxY() {
    return this.getY() + this.getHeight();
  }

  centerX() {
    return this.sprite.x + (this.sprite.getBounds().width / 2);
  }

  centerY() {
    return this.sprite.y + (this.sprite.getBounds().height / 2);
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

  destroySprite() {
    this.stage.removeChild(this.sprite);
    this.sprite = null;
  }

  overlaps(other) {
    if (
      this.getMaxX() < other.getX() ||
      other.getMaxX() < this.getX() ||
      this.getMaxY() < other.getY() ||
      other.getMaxY() < this.getMaxY()
    ) {
      return false;
    } else {
      return true;
    }
  }

}

export default GameObject;
