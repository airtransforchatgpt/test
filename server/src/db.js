import sql from 'mssql';

let poolPromise;

const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  port: Number(process.env.MSSQL_PORT || 1433),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const getPool = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
};

export { sql };
