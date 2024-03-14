void main() {
  var a = 'hello';
  var b = 1;
  var c = false;
  var d = 3.14;
  Map<String, int> e = {'a': 1, 'b': 2};
  Record f = ('first', one: 1, two: '2', 'last');
  List<int> g = [1, 2, 3, 4];
  Set<dynamic> h = {1, 2, 3, 'a', false, 3.14};

  Point p1 = Point(1, 2);
  Point3D p2 = new Point3D(1, 2, 3);

  print(a.runtimeType); // String
  print(b.runtimeType); // int
  print(c.runtimeType); // bool
  print(d.runtimeType); // double
  print(e.runtimeType); // _Map<String, int>
  print(f.runtimeType); // (String, String, {int one, String two})
  print(g.runtimeType); // List<int>
  print(h.runtimeType); // _Set<dynamic>
  print(p1.runtimeType); // Point
  print(p2.runtimeType); // Point3D


  var x = 3; // x is inferred as an int.
  // x = 4.0;

  num y = 3; // A num can be double or int.
  y = 4.0;

  List<Animal> animals = [Dog()];
  List<Cat> cats = animals as List<Cat>;

  int intValue = getValue<int>(10); // 调用泛型方法，传入整数类型参数
  String stringValue = getValue<String>('Hello'); // 调用泛型方法，传入字符串类型参数
}

class Point {
  final double x;
  final double y;

  Point(this.x, this.y);
}

class Point3D extends Point {
  final double z;

  Point3D(super.x, super.y, this.z);
}

class Animal {}

class Cat extends Animal {}

class Dog extends Animal {}


abstract class Repository<T> {
  Future<T> getById(int id);
}

class UserRepository implements Repository<String> {
  @override
  Future<String> getById(int id) {
// 实现获取用户信息的逻辑
    return Future.value('User $id');
  }
}

T getValue<T>(T value) {
  return value;
}