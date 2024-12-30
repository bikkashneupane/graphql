import request from "supertest";
import app from "../src/app";

describe("Server root API EP tests: ", () => {
  it("should return a 'Server Alive' message with status 200 GET/", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Server Alive");
  });

  it("should throw a 404 error message", async () => {
    const response = await request(app).get("/api/v1/randomEP");
    expect(response.status).toBe(404);
    expect(response.body.message).toMatch("Not Found");
  });
});
