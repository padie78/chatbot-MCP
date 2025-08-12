import { users } from "./data/users";
import { orders } from "./data/orders";

// Resolvers
export const root = {
  // Consulta para obtener un usuario por ID
  user: ({ id }: { id: string }) => {
    return users.find((user) => user.id === id) || null;
  },

  // Consulta para obtener las órdenes de un usuario por userId
  ordersByUser: ({ userId }: { userId: string }) => {
    return orders.filter((order) => order.userId === userId);
  },

  // Resolver para el campo `orders` dentro de User
  User: {
    orders: (user: { id: string }) => {
      return orders.filter((order) => order.userId === user.id);
    },
  },
};
