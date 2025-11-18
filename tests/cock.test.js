import request from "supertest";
import mockingoose from "mockingoose";
import app, { Cock } from "../server.js";

describe("Cock API tests", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("GET /cocks - should return list", async () => {
    const fakeData = [
      { _id: "1", name: "BigBoy", size: 32, color: "pink" },
      { _id: "2", name: "TinyTim", size: 12, color: "purple" },
    ];

    mockingoose(Cock).toReturn(fakeData, "find");

    const res = await request(app).get("/cocks");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe("BigBoy");
  });

  test("GET /cocks/:id - return single", async () => {
    const fake = { _id: "123", name: "Monster", size: 45, color: "black" };

    mockingoose(Cock).toReturn(fake, "findOne");

    const res = await request(app).get("/cocks/123");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Monster");
  });

  test("POST /cocks - create cock", async () => {
    const body = { name: "TestCock", size: 21, color: "blue" };

    mockingoose(Cock).toReturn(body, "save");

    const res = await request(app).post("/cocks").send(body);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("TestCock");
  });

  test("PUT /cocks/:id - update cock", async () => {
    const updated = { _id: "abc", name: "Updated", size: 66, color: "red" };

    mockingoose(Cock).toReturn(updated, "findOneAndUpdate");

    const res = await request(app)
      .put("/cocks/abc")
      .send({ name: "Updated", size: 66 });

    expect(res.status).toBe(200);
    expect(res.body.size).toBe(66);
  });

  test("DELETE /cocks/:id - delete cock", async () => {
    const fake = { _id: "55", name: "DeleteMe", size: 13, color: "white" };

    mockingoose(Cock).toReturn(fake, "findOneAndDelete");

    const res = await request(app).delete("/cocks/55");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted successfully");
  });
});
