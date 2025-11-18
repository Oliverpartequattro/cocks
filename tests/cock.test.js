const { app, Cock } = require("../server");
const httpMocks = require("node-mocks-http");

// Mock függvények
Cock.find = jest.fn();
Cock.findById = jest.fn();
Cock.create = jest.fn();
Cock.findByIdAndUpdate = jest.fn();
Cock.findByIdAndDelete = jest.fn();

let req, res;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

//
// 1️⃣ GET /cocks
//
describe("GET /cocks", () => {
  it("should return empty array", async () => {
    Cock.find.mockResolvedValue([]);
    req.method = "GET";
    req.url = "/cocks";

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([]);
  });

  it("should return 2 items", async () => {
    Cock.find.mockResolvedValue([
      { name: "Big Joe", size: 30, color: "black" },
      { name: "Tiny Tim", size: 5, color: "pink" },
    ]);

    req.method = "GET";
    req.url = "/cocks";

    await app._router.handle(req, res, () => {});
    const data = JSON.parse(res._getData());

    expect(data.length).toBe(2);
  });

  it("should return 500 on DB error", async () => {
    Cock.find.mockRejectedValue(new Error("DB fail"));

    req.method = "GET";
    req.url = "/cocks";

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(500);
  });
});

//
// 2️⃣ GET /cocks/:id
//
describe("GET /cocks/:id", () => {
  it("should return one item", async () => {
    Cock.findById.mockResolvedValue({ name: "Mega", size: 40 });

    req.method = "GET";
    req.url = "/cocks/123";

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(200);
  });

  it("should return 404 if not found", async () => {
    Cock.findById.mockResolvedValue(null);
    req.method = "GET";
    req.url = "/cocks/999";

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 on DB fail", async () => {
    Cock.findById.mockRejectedValue(new Error("fail"));

    req.method = "GET";
    req.url = "/cocks/555";

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(500);
  });
});

//
// 3️⃣ POST /cocks
//
describe("POST /cocks", () => {
  it("should create new cock", async () => {
    Cock.prototype.save = jest.fn().mockResolvedValue(true);

    req.method = "POST";
    req.url = "/cocks";
    req.body = { name: "NewOne", size: 12, color: "white" };

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(201);
  });

  it("should return the created data", async () => {
    Cock.prototype.save = jest.fn();
    req.method = "POST";
    req.url = "/cocks";
    req.body = { name: "Buddy", size: 22 };

    await app._router.handle(req, res, () => {});
    expect(JSON.parse(res._getData()).name).toBe("Buddy");
  });

  it("should return 400 on invalid body", async () => {
    Cock.prototype.save = jest.fn().mockRejectedValue(new Error("invalid"));

    req.method = "POST";
    req.url = "/cocks";
    req.body = {};

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(400);
  });
});

//
// 4️⃣ PUT /cocks/:id
//
describe("PUT /cocks/:id", () => {
  it("should update an item", async () => {
    Cock.findByIdAndUpdate.mockResolvedValue({ name: "Updated" });

    req.method = "PUT";
    req.url = "/cocks/123";
    req.body = { name: "Updated" };

    await app._router.handle(req, res, () => {});
    expect(JSON.parse(res._getData()).name).toBe("Updated");
  });

  it("should return 404 on missing item", async () => {
    Cock.findByIdAndUpdate.mockResolvedValue(null);

    req.method = "PUT";
    req.url = "/cocks/444";

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(404);
  });

  it("should return 400 on DB error", async () => {
    Cock.findByIdAndUpdate.mockRejectedValue(new Error("bad data"));

    req.method = "PUT";
    req.url = "/cocks/555";

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(400);
  });
});

//
// 5️⃣ DELETE /cocks/:id
//
describe("DELETE /cocks/:id", () => {
  it("should delete an item", async () => {
    Cock.findByIdAndDelete.mockResolvedValue({});

    req.method = "DELETE";
    req.url = "/cocks/321";

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(200);
  });

  it("should return 404 if item not found", async () => {
    Cock.findByIdAndDelete.mockResolvedValue(null);

    req.method = "DELETE";
    req.url = "/cocks/000";

    await app._router.handle(req, res, () => {});
    expect(res.statusCode).toBe(404);
  });

  it("should return success message", async () => {
    Cock.findByIdAndDelete.mockResolvedValue({});

    req.method = "DELETE";
    req.url = "/cocks/999";

    await app._router.handle(req, res, () => {});
    expect(JSON.parse(res._getData()).message).toBe("Deleted successfully");
  });
});
