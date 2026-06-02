import mockOrders from "../data/mockOrders";

const STORAGE_KEY = "orders";

export const getOrders = () => {
  const saved =
    localStorage.getItem(STORAGE_KEY);

  return saved
    ? JSON.parse(saved)
    : mockOrders;
};

export const saveOrders = (orders) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(orders)
  );
};

export const addOrder = (order) => {
  const orders = getOrders();

  const updated = [
    order,
    ...orders,
  ];

  saveOrders(updated);

  return updated;
};

export const updateOrder = (
  id,
  data
) => {
  const updated =
    getOrders().map((order) =>
      order.id === id
        ? {
            ...order,
            ...data,
          }
        : order
    );

  saveOrders(updated);

  return updated;
};

export const deleteOrder = (
  id
) => {
  const updated =
    getOrders().filter(
      (order) => order.id !== id
    );

  saveOrders(updated);

  return updated;
};