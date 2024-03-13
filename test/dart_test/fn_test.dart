void main() {
  print('test function');
  var (a, b) = (1, 2);
  print((1, 2).runtimeType); // (int, int)

  print('add1(a, b): ${add1(a, b)}'); // add1(a, b): 3
  print('add2(): ${add2()}'); // add2(): 0
  print('add3(): ${add3()}'); // add3(): 0
  print('add3(x: 1, y: 2): ${add3(x: 1, y: 2)}'); // add3(x: 1, y: 2): 3

  print('addDouble(x: 1): ${addDouble(x: 1)}'); // addDouble(x: 1): 3
  print(
      'addDouble(x: 1, y:4): ${addDouble(x: 1, y: 4)}'); // addDouble(x: 1, y:4): 5

  print('addThree(1,5): ${addThree(1, 5)}'); // addThree(1,5): 6

  print('addThree(1,5,2): ${addThree(1, 5, 2)}'); // addThree(1,5,2): 8

  print('addAll(): ${addAll([1, 2, 3, 4, 5, 6])}');
  // addAll params: [1, 2, 3, 4, 5, 6]
  // addAll(): 21

  var double = multi(2);
  print('double(3): ${double(3)}'); // double(3): 6

}

// 必须都要传
int add1(int x, int y) {
  return x + y;
}

// 都可选，无默认值
int add2({int? x, int? y}) {
  return (x ?? 0) + (y ?? 0);
}

// 命名参数：都可选，有默认值, 传值的话必须指明参数名
int add3({int x = 0, int y = 0}) {
  return x + y;
}

// 命名参数：x必须要传，y可选
int addDouble({required int x, int y = 2}) {
  return x + y;
}

// x, y 必须要传， z可选
int addThree(int x, int y, [int z = 0]) {
  return x + y + z;
}

int addAll(List<int> params) {
  print('addAll params: $params');
  var result = 0;
  params.forEach((element) {
    result += element;
  });

  return result;
}

Function multi(int x) {
  return (int y) => x * y;
}