"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../src/server"));
// test server to have route /posts
it("should have route /post", () => {
    const result = server_1.default.stack.find((layer) => layer.route && layer.route.path === "/post");
    expect(result).toBeDefined();
});
