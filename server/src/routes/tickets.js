import express from 'express';
import { getPool } from '../db.js';
import { store } from '../memoryStore.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT t.Id, t.CustomerId, c.FullName AS CustomerName, t.FlightNo, t.Departure, t.Arrival, t.DepartureTime, t.Status
      FROM Tickets t
      INNER JOIN Customers c ON c.Id = t.CustomerId
      ORDER BY t.DepartureTime ASC
    `);
    return res.json({ data: result.recordset, mode: 'mssql' });
  } catch {
    const data = store.tickets.map((t) => ({ ...t, customerName: store.customers.find((c) => c.id === t.customerId)?.fullName || 'Unknown' }));
    return res.json({ data, mode: 'memory' });
  }
});

export default router;
