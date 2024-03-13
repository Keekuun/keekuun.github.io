import 'dart:math';

class Point {
  // int x;
  // int y;
  final int x;
  final int y;

  // Point(int x, int y): this.x = x, this.y=y;
  //  简写如下
  Point(this.x, this.y);

  // 定义常量构造函数， 必须使用final修饰x,y
  const Point.Const(this.x, this.y);

  Point.fromJson(Map<String, dynamic> json)
      : x = json['x'],
        y = json['y'];

  @override
  String toString() {
    return 'Point(x: $x, y: $y)';
  }

  double distanceTo(Point other) {
    var dx = x - other.x;
    var dy = y - other.y;
    return sqrt(dx * dx + dy * dy);
  }
}

void main() {
  // 使用 Point(2, 2) 方式调用
  Point p1 = Point(2, 2);
  print(p1); // 输出：Point(x: 2, y: 2)

  // 使用 Point.fromJson({'x': 1, 'y': 2}) 方式调用
  Point p2 = Point.fromJson({'x': 1, 'y': 2});
  print(p2); // 输出：Point(x: 1, y: 2)

  // 使用 new Point(2, 2) 方式调用
  Point p3 = new Point(2, 2);
  print(p3); // 输出：Point(x: 2, y: 2)

  // 使用 new Point.fromJson({'x': 1, 'y': 2}) 方式调用
  Point p4 = new Point.fromJson({'x': 1, 'y': 2});
  print(p4); // 输出：Point(x: 1, y: 2)

  // 使用 const Point.Const(2, 2) 方式调用
  Point p5 = const Point.Const(2, 2);
  print(p5); // 输出：Point(x: 2, y: 2)
}

enum Color { red, green, blue }