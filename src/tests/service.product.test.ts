import { resetProducts } from "../services/service.product";
import { getAverageProductPrice } from "../services/service.product";
import { jest } from "@jest/globals";
import * as productService from "../services/service.product";

describe("Product service", () => {
  beforeEach(() => {
    resetProducts();
  });
    // Should return the average price of all products
  // Should return 0 if there are no products
  // The return value should be a number
  // The return value should be positive

  test("returns average price", () => {
    jest.spyOn(productService, "getAllProducts").mockReturnValue([
      { id: 1, name: "Product 1", price: 100 },
      { id: 2, name: "Product 2", price: 50 },
    ]);
    const averagePrice = getAverageProductPrice();
    expect(averagePrice).toBe(75);
    jest.restoreAllMocks();
  });

  test("returns 0 if there are no products", () => {
    jest.spyOn(productService, "getAllProducts").mockReturnValue([]);
    const averagePrice = getAverageProductPrice();
    expect(averagePrice).toBe(0);
    jest.restoreAllMocks();
  });

  test("returns positive value", () => {
    jest.spyOn(productService, "getAllProducts").mockReturnValue([
      { id: 1, name: "Product 1", price: 100 },
    ]);
    const averagePrice = getAverageProductPrice();
    expect(averagePrice).toBe(100);
    jest.restoreAllMocks();
  });
});
