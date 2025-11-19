const { app, Cock } = require("../server");
const httpMocks = require("node-mocks-http");

Cock.find = jest.fn(() => ({
    select: jest.fn().mockResolvedValue([]),
}));

test("GET /cocks responds with JSON Content-Type", async () => {
    const req = httpMocks.createRequest({ method: 'GET', url: '/cocks' });
    const res = httpMocks.createResponse();

    // ensure mock returns empty array like other tests
    Cock.find.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue([]),
    }));

    await app._router.handle(req, res, () => {});

    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toEqual(expect.stringContaining('application/json'));
});
