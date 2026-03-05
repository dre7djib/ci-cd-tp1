import request from "supertest";
import app from "./app";

describe("Product routes", () => {
  test("creates and retrieves a product", async () => {
    const createResponse = await request(app)
      .post("/products")
      .send({ name: "Test product", price: 9.99 });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toEqual({
      id: expect.any(Number),
      name: "Test product",
      price: 9.99,
    });

    const id: number = createResponse.body.id;

    const getResponse = await request(app).get(`/products/${id}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id,
      name: "Test product",
      price: 9.99,
    });
  });

  test("returns 404 for unknown product", async () => {
    const response = await request(app).get("/products/99999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Product not found" });
  });

  test("updates and deletes a product", async () => {
    const createResponse = await request(app)
      .post("/products")
      .send({ name: "Old name", price: 5 });

    const id: number = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/products/${id}`)
      .send({ name: "New name", price: 10 });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({
      id,
      name: "New name",
      price: 10,
    });

    const deleteResponse = await request(app).delete(`/products/${id}`);
    expect(deleteResponse.status).toBe(204);

    const getAfterDeleteResponse = await request(app).get(`/products/${id}`);
    expect(getAfterDeleteResponse.status).toBe(404);
  });
});
