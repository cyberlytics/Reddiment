import { gql } from "apollo-server-core";

const typeDefs = gql`
    type Test {
        dummy: String
    }

    type Query {
        test: Test
    }
`;

export default typeDefs;