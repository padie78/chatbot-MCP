import { buildSchema } from "graphql";

// Definimos el esquema GraphQL
export const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!,
    orders: [Order!]!
  }

  type Order {
    id: ID!
    product: String!
    quantity: Int!
    price: Float!
    userId: ID!
  }

  type Query {
    user(id: ID!): User
    ordersByUser(userId: ID!): [Order!]!
  }
`);
