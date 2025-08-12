import express from "express";
import { graphqlHTTP } from "express-graphql";

import { schema } from './schema';
import { root } from "./resolvers"; // tus resolvers


const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true, // habilita la UI para probar consultas
  })
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`GraphQL API corriendo en http://localhost:${PORT}/graphql`);
});
