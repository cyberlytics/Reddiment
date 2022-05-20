
const resolvers = {
    Test: {
        dummy: (parent: any) => "hello, world",
    },

    Query: {
        test: () => ({ dummy: "hello" }),
    },
};

export default resolvers;