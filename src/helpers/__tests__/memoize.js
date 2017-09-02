import memoize from "../memoize";

describe("The memoize function", function() {
  it("should take a function and return a function", function() {
    expect(typeof memoize((x, y) => "test")).toBe("function");
  });
});

describe("A memoized function", function() {
  it("should return the same values as the unmemoized function", function() {
    const testFn = (x, y) => x + y;
    const testFnMemo = memoize(testFn);

    expect(testFnMemo(1, 2)).toBe(3);
    expect(testFnMemo(2, 2)).toBe(4);
    expect(testFnMemo(1, 5)).toBe(6);
  });

  it("should return the same output for the same inputs", function() {
    // Need to keep references so they don't get garbage collected
    const testObj1 = {};
    const testObj2 = {};

    let called = false;
    const testFn = (x, y) => {
      if (!called) {
        called = true;
        return testObj1;
      }

      return testObj2;
    };

    const testFnMemo = memoize(testFn);

    const testArgs = [1, 2];

    const result1 = testFnMemo(...testArgs);
    const result2 = testFnMemo(...testArgs);

    expect(result2).toBe(result1);
  });
});
