import fetch from "node-fetch";

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql"; // Cambia a tu endpoint GraphQL real

export async function getOrdersByUser({ userId }: { userId: string }) {
  const query = `
    query GetOrdersByUser($userId: ID!) {
      ordersByUser(userId: $userId) {
        id
        product
        quantity
        price
        userId
      }
    }
  `;

  const variables = { userId };

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const text = await response.text();
    console.log("Respuesta cruda de GraphQL (ordersByUser):", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch (jsonError) {
      console.error("Error parseando JSON de ordersByUser:", jsonError);
      return { error: "Respuesta de GraphQL no es JSON válido" };
    }

    if (json.errors) {
      return { error: json.errors.map((e: any) => e.message).join(", ") };
    }

    if (!json.data || !json.data.ordersByUser || json.data.ordersByUser.length === 0) {
      return { error: `No hay órdenes para el usuario con ID ${userId}` };
    }

    return json.data.ordersByUser;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error al conectar con GraphQL (ordersByUser):", errorMessage);
    return { error: "Error al conectar con GraphQL: " + errorMessage };
  }
}
