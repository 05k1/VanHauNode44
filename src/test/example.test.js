import { expect } from "chai";

describe("Math operations", () => {
  // chua tat ca test case cua bo test nay
  it("should add two integer", () => {
    const result = 10 + 10;

    // su dung chai de mock ket qua tra ve tu function hoac bien
    expect(result).to.equal(20);
  });
  it("test with array", () => {
    const arr = [1, 2, 3];
    expect(arr).to.include(2);
  });
});
