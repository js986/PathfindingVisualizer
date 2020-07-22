
class Point {
    constructor(x,y) {
      this.x = x;
      this.y = y;
      this.value = 0;
      this.parent = null;
      this.f = Number.MAX_VALUE;
      this.g = Number.MAX_VALUE;
      this.h = 0;
    }
  }

  export default Point;