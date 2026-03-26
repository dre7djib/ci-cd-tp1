import { isValidProductPrice, MAX_PRODUCT_PRICE } from "./productPrice";

describe("isValidProductPrice", () => {
  test("accepts zero and positive finite values within bound", () => {
    expect(isValidProductPrice(0)).toBe(true);
    expect(isValidProductPrice(10.5)).toBe(true);
    expect(isValidProductPrice(MAX_PRODUCT_PRICE)).toBe(true);
  });

  test("rejects negative, NaN, non-finite", () => {
    expect(isValidProductPrice(-1)).toBe(false);
    expect(isValidProductPrice(Number.NaN)).toBe(false);
    expect(isValidProductPrice(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isValidProductPrice(Number.NEGATIVE_INFINITY)).toBe(false);
  });

  test("rejects above max business bound", () => {
    expect(isValidProductPrice(MAX_PRODUCT_PRICE + 1)).toBe(false);
  });
});
