const request = require("supertest");
const mockingoose = require("mockingoose");
const { app, Cock } = require("../server");

describe("Cock API", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("GET /cocks - should return all cocks", async () => {
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

  it("GET /cocks/:id - should return single cock", async () => {
    const fake = { _id: "123", name: "Monster", size: 45, color: "black" };
    mockingoose(Cock).toReturn(fake, "findOne");

    const res = await request(app).get("/cocks/123");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Monster");
  });

  it("POST /cocks - should create a cock", async () => {
    const body = { name: "TestCock", size: 21, color: "blue" };
    mockingoose(Cock).toReturn(body, "save");

    const res = await request(app).post("/cocks").send(body);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("TestCock");
  });

  it("PUT /cocks/:id - should update a cock", async () => {
    const updated = { _id: "abc", name: "Updated", size: 66, color: "red" };
    mockingoose(Cock).toReturn(updated, "findOneAndUpdate");

    const res = await request(app).put("/cocks/abc").send({ name: "Updated", size: 66 });

    expect(res.status).toBe(200);
    expect(res.body.size).toBe(66);
  });

  it("DELETE /cocks/:id - should delete a cock", async () => {
    const fake = { _id: "55", name: "DeleteMe", size: 13, color: "white" };
    mockingoose(Cock).toReturn(fake, "findOneAndDelete");

    const res = await request(app).delete("/cocks/55");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted successfully");
  });
});
