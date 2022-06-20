

import router from "../src/server"
import request from "supertest"

// test server to have route /posts
it("should have route /post", () => {
    const result = router.stack.find(
        (layer) => layer.route && layer.route.path === "/post")
    expect(result).toBeDefined()
});

