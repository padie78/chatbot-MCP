import { GraphQLClient } from "graphql-request";

const graphqlUrl = process.env.GRAPHQL_API_URL || "http://localhost:4000/graphql";

export const client = new GraphQLClient(graphqlUrl);

