void main() {
  #Symbol;
  #test;

  var n = null;
  print('n=null: $n'); // n=null: null
  print(#test); // Symbol("test")

  // numbers
  const PI = 3.14;
  double pi = 3.14;
  int age = 16;

  // string
  var s1 = 'dart';
  var s2 = 'hello ' + s1;
  var s3 = 'hello $s1';
  String s4 = "hello world";
  String s5 = '''
    hello world,
    $s1
    $s2
  ''';

  // booleans
  var isAdult = age > 18;
  bool good = true;
  const ok = false;
  bool flag;
  if (ok) {
    flag = true;
  }

  late bool doIt;
  if (good) {
    doIt = true;
  }

  // record
  var r1 = ('first', a: 2, b: false, c: 'c', 'last');
  // get element
  var first = r1.$1;
  var last = r1.$2;
  var a = r1.a;

  // 定义record
  ({int a, bool b}) r2;
  // 赋值record
  r2 = (a: 1, b: false);
  print(r2.runtimeType); // ({int a, bool b})

  // 直接初始化record
  (int x, int y, int z) point = (1, 2, 3);
  (int r, int g, int b) color = (1, 2, 3);
  // 比较
  print(point == color); // Prints 'true'.

  // 全部取出来
  var (x, y, z) = point;

  // lists
  var list = [1, 2, 3];
  print('list: ${list}'); // list: [1, 2, 3]

  print('list.length: ${list.length}'); // list.length: 3

  print('list.first: ${list.first}'); //  list.first: 1
  print('list.last: ${list.last}'); // list.last: 3

  print('list[1]: ${list[1]}'); // list[1]: 2

  list.add(4);
  list.removeLast();
  list.addAll([4, 5, 6]);
  print('list: ${list}'); // list: [1, 2, 3, 4, 5, 6]
  list.removeAt(0);
  // list.removeAt(-1); // error
  print('list.contains(1): ${list.contains(1)}'); // list.contains(1): false
  print('list.reversed;: ${list.reversed}'); // list.reversed;: (6, 5, 4, 3, 2)
  // print('list[-1];: ${list[-1]}'); error
  var list2 = [0, ...list, 6];
  print('list2;: ${list2}'); //  [0, 2, 3, 4, 5, 6, 6]

  // 类似python，支持if，if-case操作
  var nav = ['Home', 'Furniture', 'Plants', if (ok) 'Outlet'];

  // sets
  var fruits = {'apple', 'orange', 'banana'};
  print('fruits: ${fruits}');
  fruits.add('apple'); // 不会加进去
  print('fruits: ${fruits}'); // fruits: {'apple', 'orange', 'banana'}

  var nums = <int>{};
  print('nums.length: ${nums.length}'); //nums.length: 0
  nums.add(0);
  nums.addAll([1, 2, 3, 4, 3, 3, 2, 1]);
  print('nums: ${nums}'); // nums: {0, 1, 2, 3, 4}

  // maps 类似ts中的object
  var gifts1 = {
    // Key:    Value
    'first': 'partridge',
    'second': 'turtledoves',
    'fifth': 'golden rings'
  };

  var nobleGases1 = {
    2: 'helium',
    10: 'neon',
    18: 'argon',
  };

  var gifts2 = Map<String, String>();
  gifts2['first'] = 'partridge';
  gifts2['second'] = 'turtledoves';
  gifts2['fifth'] = 'golden rings';

  var nobleGases2 = Map<int, String>();
  nobleGases2[2] = 'helium';
  nobleGases2[10] = 'neon';
  nobleGases2[18] = 'argon';
}
