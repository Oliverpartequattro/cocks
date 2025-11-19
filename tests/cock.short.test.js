const { app } = require("../server");
const httpMocks = require("node-mocks-http");

test("unknown route returns 404", async () => {
    const req = httpMocks.createRequest({ method: 'GET', url: '/this-route-does-not-exist' });
    const res = httpMocks.createResponse();

    await app._router.handle(req, res, () => {});

    expect(res.statusCode).toBe(404);
});
