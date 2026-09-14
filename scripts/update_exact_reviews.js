const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Akashindia123@localhost:5432/astraiv_tech' });

async function updateExactReviews() {
  // 1. Update DEPANNITA SEN (Row 2 in Google Sheet)
  await pool.query(`
    UPDATE reviews 
    SET 
      original_review = 'Very good',
      review_text = 'Very good',
      review = 'Very good',
      liked_most = 'Yes',
      would_recommend = 'Yes',
      updated_at = NOW()
    WHERE source_submission_id = 'GF-SHEET-ROW-2' OR client_name ILIKE '%DEPANNITA%'
  `);

  // 2. Update Anubhab Bera (Row 3 in Google Sheet)
  await pool.query(`
    UPDATE reviews 
    SET 
      original_review = 'lll',
      review_text = 'lll',
      review = 'lll',
      liked_most = 'aaa',
      would_recommend = 'Yes',
      updated_at = NOW()
    WHERE source_submission_id = 'GF-SHEET-ROW-3' OR client_name ILIKE '%Anubhab%'
  `);

  // 3. Update Alex (Row 4 in Google Sheet)
  await pool.query(`
    UPDATE reviews 
    SET 
      original_review = 'Very good',
      review_text = 'Very good',
      review = 'Very good',
      liked_most = 'Nothing',
      would_recommend = 'Yes',
      updated_at = NOW()
    WHERE source_submission_id = 'GF-SHEET-ROW-4' OR client_name ILIKE '%Alex%'
  `);

  const res = await pool.query(`
    SELECT client_name, project_name, original_review, review_text, liked_most, would_recommend, status 
    FROM reviews 
    WHERE status = 'pending'
    ORDER BY created_at DESC
  `);
  console.log('UPDATED PENDING REVIEWS:');
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

updateExactReviews().catch(console.error);
