const { app, Cock } = require("../server");
const httpMocks = require("node-mocks-http");


Cock.find = jest.fn(() => ({
    select: jest.fn().mockResolvedValue([]),
}));

Cock.findById = jest.fn();
Cock.create = jest.fn();
Cock.findByIdAndUpdate = jest.fn();
Cock.findByIdAndDelete = jest.fn();

Cock.prototype.save = jest.fn();

let req, res;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();


    Cock.find.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue([]),
    }));
});



describe("GET /cocks", () => {
    it("should return empty array", async () => {
        Cock.find.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue([]),
        }));

        req.method = "GET";
        req.url = "/cocks";

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res._getData())).toEqual([]);
    });

    it("should return 2 items", async () => {
        Cock.find.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue([
                { nev: "Big Joe", kor: 3 },
                { nev: "Tiny Tim", kor: 1 },
            ]),
        }));

        req.method = "GET";
        req.url = "/cocks";

        await app._router.handle(req, res, () => { });
        const data = JSON.parse(res._getData());

        expect(data.length).toBe(2);
    });

    test("should return 500 if database throws an error", async () => {
        Cock.find.mockImplementation(() => {
            throw new Error("Database error");
        });

        req.method = "GET";
        req.url = "/cocks";

        await app._router.handle(req, res, () => { });

        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res._getData()).error).toBe("Database error");
    });

    test("should return items with required fields", async () => {
        Cock.find.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue([
                { _id: 1, nev: "Alpha", kor: 2, fogadas_osszeg: 10, kedvenc_kakas: "Red", battle_id: 5 },
                { _id: 2, nev: "Beta", kor: 3, fogadas_osszeg: 20, kedvenc_kakas: "Blue", battle_id: 6 },
            ]),
        }));

        req.method = "GET";
        req.url = "/cocks";

        await app._router.handle(req, res, () => { });
        const data = JSON.parse(res._getData());

        expect(res.statusCode).toBe(200);
        data.forEach(item => {
            expect(item).toHaveProperty("_id");
            expect(item).toHaveProperty("nev");
            expect(item).toHaveProperty("kor");
            expect(item).toHaveProperty("fogadas_osszeg");
            expect(item).toHaveProperty("kedvenc_kakas");
            expect(item).toHaveProperty("battle_id");
        });
    });


});



describe("GET /cocks/:id", () => {
    it("should return one item", async () => {
        Cock.findById.mockResolvedValue({ nev: "Mega", kor: 5 });

        req.method = "GET";
        req.url = "/cocks/123";

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(200);
    });

    it("should return 404 if not found", async () => {
        Cock.findById.mockResolvedValue(null);

        req.method = "GET";
        req.url = "/cocks/999";

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(404);
    });

    it("should return 500 on DB fail", async () => {
        Cock.findById.mockRejectedValue(new Error("fail"));

        req.method = "GET";
        req.url = "/cocks/555";

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(500);
    });

    it("should return item with nev field", async () => {
        Cock.findById.mockResolvedValue({ nev: "Champion" });

        req.method = "GET";
        req.url = "/cocks/123";

        await app._router.handle(req, res, () => { });
        const data = JSON.parse(res._getData());

        expect(res.statusCode).toBe(200);
        expect(data).toHaveProperty("nev");
    });

    test("should return nev and kor fields", async () => {
    Cock.findById.mockResolvedValue({ nev: "Unique", kor: 4, extra: "ignoreMe" });

    req.method = "GET";
    req.url = "/cocks/321";

    await app._router.handle(req, res, () => {});
    const data = JSON.parse(res._getData());

    expect(data.nev).toBe("Unique");
    expect(data.kor).toBe(4);
});
});



describe("POST /cocks", () => {
    it("should create new cock", async () => {
        Cock.prototype.save = jest.fn().mockResolvedValue(true);

        req.method = "POST";
        req.url = "/cocks";
        req.body = { nev: "NewOne", kor: 2 };

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(201);
    });

    it("should return the created data", async () => {
        Cock.prototype.save = jest.fn().mockResolvedValue(true);

        req.method = "POST";
        req.url = "/cocks";
        req.body = { nev: "Buddy", kor: 3 };

        await app._router.handle(req, res, () => { });
        const data = JSON.parse(res._getData());

        expect(data.nev).toBe("Buddy");
    });

    it("should return 400 on invalid body", async () => {
        Cock.prototype.save = jest.fn().mockRejectedValue(new Error("invalid"));

        req.method = "POST";
        req.url = "/cocks";
        req.body = {};

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(400);
    });

    test("should return all fields from request after creation", async () => {
        Cock.prototype.save = jest.fn().mockResolvedValue(true);

        req.method = "POST";
        req.url = "/cocks";
        req.body = { nev: "bubika", kor: 2, fogadas_osszeg: 50, kedvenc_kakas: "Red", battle_id: 1 };

        await app._router.handle(req, res, () => { });
        const data = JSON.parse(res._getData());


        expect(data).toMatchObject(req.body);
    });

    test("should return 400 if request body is not valid JSON", async () => {
        Cock.prototype.save = jest.fn();

        req.method = "POST";
        req.url = "/cocks";
        req.body = "not a JSON object";

        await app._router.handle(req, res, () => { });

        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData()).error).toBeDefined();
    });

});



describe("PUT /cocks/:id", () => {
    it("should update an item", async () => {
        Cock.findByIdAndUpdate.mockResolvedValue({ nev: "Updated" });

        req.method = "PUT";
        req.url = "/cocks/123";
        req.body = { nev: "Updated" };

        await app._router.handle(req, res, () => { });
        expect(JSON.parse(res._getData()).nev).toBe("Updated");
    });

    it("should return 404 on missing item", async () => {
        Cock.findByIdAndUpdate.mockResolvedValue(null);

        req.method = "PUT";
        req.url = "/cocks/444";

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(404);
    });

    it("should return 400 on DB error", async () => {
        Cock.findByIdAndUpdate.mockRejectedValue(new Error("bad data"));

        req.method = "PUT";
        req.url = "/cocks/555";

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(400);
    });

    test("should call findByIdAndUpdate with correct ID and body", async () => {
        Cock.findByIdAndUpdate.mockResolvedValue({ nev: "UpdatedAgain" });

        req.method = "PUT";
        req.url = "/cocks/777";
        req.body = { nev: "UpdatedAgain" };

        await app._router.handle(req, res, () => { });

        expect(Cock.findByIdAndUpdate).toHaveBeenCalledWith(
            "777",
            { nev: "UpdatedAgain" },
            { new: true }
        );
    });

    test("should update only specified fields", async () => {
        Cock.findByIdAndUpdate.mockResolvedValue({ nev: "Partial", kor: 5 });

        req.method = "PUT";
        req.url = "/cocks/888";
        req.body = { kor: 5 };

        await app._router.handle(req, res, () => { });
        const data = JSON.parse(res._getData());

        expect(res.statusCode).toBe(200);
        expect(data.kor).toBe(5);
        expect(data.nev).toBe("Partial");
    });

});


describe("DELETE /cocks/:id", () => {
    it("should delete an item", async () => {
        Cock.findByIdAndDelete.mockResolvedValue({});

        req.method = "DELETE";
        req.url = "/cocks/321";

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(200);
    });

    it("should return 404 if item not found", async () => {
        Cock.findByIdAndDelete.mockResolvedValue(null);

        req.method = "DELETE";
        req.url = "/cocks/000";

        await app._router.handle(req, res, () => { });
        expect(res.statusCode).toBe(404);
    });

    test("should call findByIdAndDelete with correct ID", async () => {
        Cock.findByIdAndDelete.mockResolvedValue({});

        req.method = "DELETE";
        req.url = "/cocks/777";

        await app._router.handle(req, res, () => { });

        expect(Cock.findByIdAndDelete).toHaveBeenCalledWith("777");
    });

    test("should return 404 if numeric _id not found", async () => {
        Cock.findByIdAndDelete.mockResolvedValue(null);

        req.method = "DELETE";
        req.url = "/cocks/999";

        await app._router.handle(req, res, () => { });

        expect(res.statusCode).toBe(404);
    });

    test("should return 500 if database throws an error", async () => {
        Cock.findByIdAndDelete.mockRejectedValue(new Error("DB failure"));

        req.method = "DELETE";
        req.url = "/cocks/123";

        await app._router.handle(req, res, () => { });

        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res._getData()).error).toBe("DB failure");
    });



});
