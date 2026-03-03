const customers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const orders = [
  { id: 1, customerId: 1, total: 120 },
  { id: 2, customerId: 1, total: 80 },
  { id: 3, customerId: 2, total: 50 },
  { id: 4, customerId: 3, total: 200 },
  { id: 5, customerId: 3, total: 150 },
  { id: 6, customerId: 3, total: 300 },
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

exports.getCustomers = async () => {
  await delay(100);
  return customers;
};

exports.getOrdersByCustomerId = async (customerId) => {
  await delay(100);
  return orders.filter((o) => o.customerId === customerId);
};
