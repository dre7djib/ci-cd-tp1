import { jest } from "@jest/globals";

jest.mock("../config/redis", () => ({
  redisClient: { isOpen: false, on: jest.fn() },
  connectRedis: jest.fn(async () => {}),
  disconnectRedis: jest.fn(async () => {}),
  isRedisAvailable: (): boolean => false,
  cacheGetJson: jest.fn(async () => null),
  cacheSetJson: jest.fn(async () => {}),
  cacheDelKeys: jest.fn(async () => {}),
  cacheDelPattern: jest.fn(async () => {}),
}));

import * as productService from "../services/service.product";

const emptyResult = { data: [], error: null };

const mockChain = () => ({
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue(emptyResult as never),
});

jest.mock("../config/db", () => ({
  supabase: {
    from: jest.fn(() => ({
      ...mockChain(),
      delete: jest.fn().mockReturnValue({
        ...mockChain(),
        gte: jest.fn().mockResolvedValue(emptyResult as never),
        eq: jest.fn().mockResolvedValue(emptyResult as never),
        select: jest.fn().mockResolvedValue(emptyResult as never),
      }),
    })),
  },
}));

describe("Product service", () => {
  beforeEach(async () => {
    await productService.resetProducts();
  });

  test("returns average price", async () => {
    jest.spyOn(productService, "getAllProducts").mockResolvedValue([
      { id: 1, name: "Product 1", price: 100, description: null },
      { id: 2, name: "Product 2", price: 50, description: null },
    ]);
    const averagePrice = await productService.getAverageProductPrice();
    expect(averagePrice).toBe(75);
    jest.restoreAllMocks();
  });

  test("returns 0 if there are no products", async () => {
    jest.spyOn(productService, "getAllProducts").mockResolvedValue([]);
    const averagePrice = await productService.getAverageProductPrice();
    expect(averagePrice).toBe(0);
    jest.restoreAllMocks();
  });

  test("returns positive value", async () => {
    jest.spyOn(productService, "getAllProducts").mockResolvedValue([
      { id: 1, name: "Product 1", price: 100, description: null },
    ]);
    const averagePrice = await productService.getAverageProductPrice();
    expect(averagePrice).toBe(100);
    jest.restoreAllMocks();
  });
});
