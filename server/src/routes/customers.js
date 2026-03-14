import express from 'express';
import { getPool, sql } from '../db.js';
import { memoryService, store } from '../memoryStore.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = Number(req.query.page || 1);
  const pageSize = Math.min(Number(req.query.pageSize || 10), 50);
  const offset = (page - 1) * pageSize;

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('offset', sql.Int, offset)
      .input('pageSize', sql.Int, pageSize)
      .query(`
        SELECT Id, FullName, Email, Phone, CreatedAt
        FROM Customers
        ORDER BY CreatedAt DESC
        OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;

        SELECT COUNT(*) AS total FROM Customers;
      `);

    return res.json({
      data: result.recordsets[0],
      total: result.recordsets[1][0].total,
      page,
      pageSize,
      mode: 'mssql',
    });
  } catch {
    const sorted = [...store.customers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const data = sorted.slice(offset, offset + pageSize);
    return res.json({ data, total: sorted.length, page, pageSize, mode: 'memory' });
  }
});

router.post('/', async (req, res) => {
  const { fullName, email, phone } = req.body;
  if (!fullName || !email) return res.status(400).json({ message: 'fullName and email are required' });

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('fullName', fullName)
      .input('email', email)
      .input('phone', phone || null)
      .query(`
        INSERT INTO Customers (FullName, Email, Phone)
        OUTPUT INSERTED.Id, INSERTED.FullName, INSERTED.Email, INSERTED.Phone, INSERTED.CreatedAt
        VALUES (@fullName, @email, @phone)
      `);
    return res.status(201).json(result.recordset[0]);
  } catch {
    const customer = memoryService.createCustomer({ fullName, email, phone: phone || '' });
    return res.status(201).json(customer);
  }
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { fullName, email, phone } = req.body;

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('fullName', fullName)
      .input('email', email)
      .input('phone', phone || null)
      .query(`
        UPDATE Customers
        SET FullName = @fullName, Email = @email, Phone = @phone
        OUTPUT INSERTED.Id, INSERTED.FullName, INSERTED.Email, INSERTED.Phone, INSERTED.CreatedAt
        WHERE Id = @id
      `);

    if (!result.recordset[0]) return res.status(404).json({ message: 'Customer not found' });
    return res.json(result.recordset[0]);
  } catch {
    const customer = memoryService.updateCustomer(id, { fullName, email, phone });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    return res.json(customer);
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const pool = await getPool();
    const result = await pool.request().input('id', id).query('DELETE FROM Customers WHERE Id = @id');
    if (!result.rowsAffected[0]) return res.status(404).json({ message: 'Customer not found' });
    return res.status(204).send();
  } catch {
    const deleted = memoryService.deleteCustomer(id);
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    return res.status(204).send();
  }
});

export default router;
