class GameObject {

  constructor(options, moveBounds) {
    this.moveBounds = Object.assign({
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    }, moveBounds);

    this.sprite = options.sprite;
    this.sprite.x = options.x;
    this.sprite.y = options.y;
    this.sprite.setBounds(
      options.x,
      options.y,
      options.width,
      options.height
    );

  }

  setStage(stage) {
    this.stage = stage;
    if (this.moveBounds.maxX === 0) this.moveBounds.maxX = stage.canvas.width;
    if (this.moveBounds.maxY === 0) this.moveBounds.maxY = stage.canvas.height;
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
    return this.getX() + this.getWidth() - 1;
  }

  getMaxY() {
    return this.getY() + this.getHeight() - 1;
  }

  getCenterX() {
    return this.sprite.x + (this.sprite.getBounds().width / 2);
  }

  getCenterY() {
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

  isFullyInMoveBounds() {
    if(this.getX() >= this.moveBounds.minX &&
        this.getMaxX() <= this.moveBounds.maxX &&
        this.getY() >= this.moveBounds.minY &&
        this.getMaxY() <= this.moveBounds.maxY) {
      return true;
    } else {
      return false;
    }
  }

  isPartiallyInMoveBounds() {
    if(this.getMaxX() >= this.moveBounds.minX &&
        this.getX() <= this.moveBounds.maxX &&
        this.getMaxY() >= this.moveBounds.minY &&
        this.getY() <= this.moveBounds.maxY) {
      return true;
    } else {
      return false;
    }
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
    this.sprite = null;
  }

  destroy() {
    this.destroySprite();
  }

  overlaps(other) {
    if (
      this.getMaxX() < other.getX() ||
      other.getMaxX() < this.getX() ||
      this.getMaxY() < other.getY() ||
      other.getMaxY() < this.getY()
    ) {
      return false;
    } else {
      return true;
    }
  }

}

export default GameObject;
