const { app, Cock } = require("../server");
const httpMocks = require("node-mocks-http");

Cock.findByIdAndDelete = jest.fn();

test("DELETE /cocks/:id returns empty object body on success", async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', url: '/cocks/42' });
    const res = httpMocks.createResponse();

    Cock.findByIdAndDelete.mockResolvedValue({});

    await app._router.handle(req, res, () => {});

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({});
});
