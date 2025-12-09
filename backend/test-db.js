const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://970189a4adf5fab6bc760ff1457d1f481b31da7f04b1d519a78565c5be61dc20:sk_zP6RkjXZ_F7tcLMhyGP0M@db.prisma.io:5432/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('Connected successfully via pg client!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Time from DB:', res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
  });
