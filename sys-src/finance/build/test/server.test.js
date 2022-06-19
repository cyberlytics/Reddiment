"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../src/server"));
const supertest_1 = __importDefault(require("supertest"));
// test server to have route /posts
it("should have route /posts", () => {
    const result = server_1.default.stack.find((layer) => layer.route && layer.route.path === "/posts");
    expect(result).toBeDefined();
});
// supertest of server to have route /posts
describe("POST /post", () => {
    it("respond with json", (done) => {
        (0, supertest_1.default)(server_1.default).post("/posts").send({ "ticker": "test" }).expect(200, done);
    });
});
