import bcrypt from 'bcryptjs';

const passwordHash = bcrypt.hashSync('admin123', 10);

export const store = {
  users: [{ id: 1, name: 'Admin Agent', email: 'admin@aircrm.com', passwordHash }],
  customers: [
    { id: 1, fullName: 'Aisha Khan', email: 'aisha@example.com', phone: '+971500000000', createdAt: new Date().toISOString() },
    { id: 2, fullName: 'Omar Ali', email: 'omar@example.com', phone: '+971511111111', createdAt: new Date().toISOString() }
  ],
  tickets: [
    { id: 1, customerId: 1, flightNo: 'EK202', departure: 'DXB', arrival: 'JFK', departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), status: 'CONFIRMED' },
    { id: 2, customerId: 2, flightNo: 'QR100', departure: 'DOH', arrival: 'LHR', departureTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), status: 'DELAYED' }
  ],
};

const nextId = (collection) => (collection.length ? Math.max(...collection.map((item) => item.id)) + 1 : 1);

export const memoryService = {
  createCustomer(payload) {
    const customer = { id: nextId(store.customers), ...payload, createdAt: new Date().toISOString() };
    store.customers.push(customer);
    return customer;
  },
  updateCustomer(id, payload) {
    const idx = store.customers.findIndex((c) => c.id === id);
    if (idx < 0) return null;
    store.customers[idx] = { ...store.customers[idx], ...payload };
    return store.customers[idx];
  },
  deleteCustomer(id) {
    const before = store.customers.length;
    store.customers = store.customers.filter((c) => c.id !== id);
    return store.customers.length < before;
  },
};
