const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const canonicalReviews = [
  {
    clientName: 'Sarah Jenkins',
    company: 'FinanceFlow Capital',
    designation: 'Head of Financial Architecture',
    review: 'Astraiv provided the engineering rigor required for institutional financial compliance. Our auditors passed the security audit on the very first submission, and our monthly book close now takes hours instead of weeks.',
    rating: 5,
    projectId: 'financeflow',
    serviceId: 'ai-development',
    industryId: 'fintech',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop',
    status: 'approved',
    featured: true
  },
  {
    clientName: 'Marcus Vance',
    company: 'PulseFit Global',
    designation: 'Chief Technology Officer',
    review: 'Astraiv Technologies transformed our core analytics platform. The speed improvement was noticed immediately by our franchise operators, and our monthly cloud bill dropped by 40% in the first quarter.',
    rating: 5,
    projectId: 'pulsefit',
    serviceId: 'web-development',
    industryId: 'saas',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop',
    status: 'approved',
    featured: true
  },
  {
    clientName: 'David Chen',
    company: 'AeroSync Logistics',
    designation: 'VP of Operations',
    review: 'The route optimization algorithms delivered by Astraiv paid for the entire software investment in less than four months of operational fuel savings alone. Our drivers love the offline app.',
    rating: 5,
    projectId: 'aerosync',
    serviceId: 'custom-software',
    industryId: 'logistics',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&fit=crop',
    status: 'approved',
    featured: true
  },
  {
    clientName: 'Elena Rostova',
    company: 'Lumina Energy Systems',
    designation: 'VP of Marketing & Product',
    review: 'Astraiv provided Lumina with an institutional-grade brand identity that immediately unlocked enterprise utility contracts. Their token-driven workflow brought our design and engineering teams into perfect alignment.',
    rating: 5,
    projectId: 'lumina-brand-strategy',
    serviceId: 'ui-ux-design',
    industryId: 'saas',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop',
    status: 'approved',
    featured: true
  },
  {
    clientName: 'David Vance',
    company: 'Nova Global Brokerage',
    designation: 'Chief Technology Officer',
    review: 'Astraiv Technologies rebuilt our entire broker core without a single minute of downtime. The speed and real-time collaboration have transformed how our trading desks close deals.',
    rating: 5,
    projectId: 'nova-crm-saas',
    serviceId: 'web-development',
    industryId: 'fintech',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&h=256&fit=crop',
    status: 'approved',
    featured: false
  },
  {
    clientName: 'Devon Miles',
    company: 'Aether Robotics',
    designation: 'Chief Technology Officer',
    review: 'Unrivaled expertise in modern web systems, Postgres optimization, and reactive UI architecture.',
    rating: 5,
    projectId: null,
    serviceId: 'cloud-devops',
    industryId: null,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop',
    status: 'approved',
    featured: false
  }
];

async function sync() {
  for (const r of canonicalReviews) {
    const existing = await pool.query('SELECT id FROM reviews WHERE client_name = $1', [r.clientName]);
    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE reviews 
         SET company = $1, company_name = $1, designation = $2, 
             review = $3, review_text = $3, original_review = $3, 
             rating = $4, project_id = $5, service_id = $6, industry_id = $7, 
             image_url = $8, status = $9, featured = $10, 
             can_publish_review = true, published_at = COALESCE(published_at, NOW()), 
             updated_at = NOW() 
         WHERE client_name = $11`,
        [r.company, r.designation, r.review, r.rating, r.projectId, r.serviceId, r.industryId, r.imageUrl, r.status, r.featured, r.clientName]
      );
      console.log('Updated review for:', r.clientName);
    } else {
      await pool.query(
        `INSERT INTO reviews (
           id, client_name, company, company_name, designation, 
           review, review_text, original_review, rating, 
           project_id, service_id, industry_id, image_url, 
           status, featured, can_publish_review, website_publish_permission, 
           identity_display_permission, published_at, created_at, updated_at
         ) VALUES (
           gen_random_uuid(), $1, $2, $2, $3, 
           $4, $4, $4, $5, 
           $6, $7, $8, $9, 
           $10, $11, true, 'Yes', 
           'Yes', NOW(), NOW(), NOW()
         )`,
        [r.clientName, r.company, r.designation, r.review, r.rating, r.projectId, r.serviceId, r.industryId, r.imageUrl, r.status, r.featured]
      );
      console.log('Inserted review for:', r.clientName);
    }
  }

  const countRes = await pool.query('SELECT client_name, company, designation, project_id, service_id, industry_id, status, featured FROM reviews ORDER BY created_at DESC');
  console.log('\n--- ALL REVIEWS IN DATABASE ---');
  console.table(countRes.rows);
  await pool.end();
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});
