void main() {
  try {
    // throw FormatException('Expected at least 1 section');
    // throw 'test error!';
    // throw 111;
  } on FormatException {  // 具体的Exception
    try {
      print('FormatException');
      throw 'test error!';
    } catch (e) { // 捕获Exception
      print('Exception: $e');
    }
  } on String { // String Exception
    print('String Exception');
  } on Object { // Int Exception
    print('Object Exception');
  } catch (e) { // 捕获Exception
    print('Exception catch: $e');
  } finally {
    print('finally');
  }
}
