import fetch from "node-fetch";

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql"; // Cambia si tu endpoint es otro

export async function getUser({ id }: { id: string }) {
  const query = `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
      }
    }
  `;

  const variables = { id };

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const text = await response.text();
    console.log("Respuesta cruda de GraphQL:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch (jsonError) {
      console.error("Error parseando JSON:", jsonError);
      return { error: "Respuesta de GraphQL no es JSON válido" };
    }

    if (json.errors) {
      return { error: json.errors.map((e: any) => e.message).join(", ") };
    }

    if (!json.data || !json.data.user) {
      return { error: `Usuario con ID ${id} no encontrado` };
    }

    return json.data.user;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error al conectar con GraphQL:", errorMessage);
    return { error: "Error al conectar con GraphQL: " + errorMessage };
  }
}
