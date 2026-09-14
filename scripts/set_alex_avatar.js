const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Akashindia123@localhost:5432/astraiv_tech' });

async function setAlexAvatar() {
  const check = await pool.query("SELECT id, client_name, email, image_url, status, review_text FROM reviews WHERE client_name ILIKE '%Alex%'");
  console.log('Before update:', check.rows);

  await pool.query(
    "UPDATE reviews SET email = 'redoxgaming1424@gmail.com', image_url = '/images/testimonials/alex-avatar.png', updated_at = NOW() WHERE client_name ILIKE '%Alex%'"
  );

  const after = await pool.query("SELECT id, client_name, email, image_url, status, review_text FROM reviews WHERE client_name ILIKE '%Alex%'");
  console.log('After update:', after.rows);

  await pool.end();
}

setAlexAvatar().catch(console.error);
