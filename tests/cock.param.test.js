const { app, Cock } = require("../server");
const httpMocks = require("node-mocks-http");


Cock.findById = jest.fn();

let req, res;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
});

describe("Parameterized GET /cocks/:id", () => {
    test.each([
        ["found", { type: "resolve", value: { nev: "Param" } }, 200],
        ["not found", { type: "resolve", value: null }, 404],
        ["db error", { type: "reject", value: new Error("boom") }, 500],
    ])('%s', async (_, mock, expectedStatus) => {
        // arrange mock behavior
        if (mock.type === "resolve") {
            Cock.findById.mockResolvedValue(mock.value);
        } else {
            Cock.findById.mockRejectedValue(mock.value);
        }

        req.method = "GET";
        req.url = "/cocks/42";

        // act
        await app._router.handle(req, res, () => {});

        // assert
        expect(res.statusCode).toBe(expectedStatus);
        if (expectedStatus === 200) {
            const data = JSON.parse(res._getData());
            expect(data).toHaveProperty("nev", "Param");
        }
    });
});
