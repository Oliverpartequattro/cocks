const { app, Cock } = require("../server");
const httpMocks = require("node-mocks-http");

test("POST /cocks responds with JSON Content-Type and 201", async () => {
    Cock.prototype.save = jest.fn().mockResolvedValue(true);

    const req = httpMocks.createRequest({
        method: 'POST',
        url: '/cocks',
        body: { nev: 'Poster', kor: 1 }
    });

    const res = httpMocks.createResponse();

    await app._router.handle(req, res, () => {});

    expect(res.statusCode).toBe(201);
    expect(res.getHeader('Content-Type')).toEqual(expect.stringContaining('application/json'));
});
