
class GameObject {

  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.sprite = options.sprite;
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

}

export default GameObject;
