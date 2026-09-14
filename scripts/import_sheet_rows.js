const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Akashindia123@localhost:5432/astraiv_tech' });

const rows = [
  {
    sourceSubmissionId: 'GF-SHEET-ROW-2',
    clientName: 'DEPANNITA SEN',
    companyName: 'Innovation Enterprise',
    company: 'Innovation Enterprise',
    designation: 'Propitor',
    projectName: 'IE BILL DESK DESKTOP',
    email: null,
    overallServiceRating: 5,
    softwareQualityRating: 5,
    communicationSupportRating: 5,
    averageRating: 5.0,
    displayRating: 5,
    rating: 5,
    reviewText: 'Outstanding software quality and support on our IE BILL DESK desktop system.',
    originalReview: 'Outstanding software quality and support on our IE BILL DESK desktop system.',
    review: 'Outstanding software quality and support on our IE BILL DESK desktop system.',
    canPublishReview: true,
    websitePublishPermission: 'Yes',
    identityDisplayPermission: 'Yes',
    status: 'pending',
    submittedAt: new Date('2026-08-17T20:25:43.000Z')
  },
  {
    sourceSubmissionId: 'GF-SHEET-ROW-3',
    clientName: 'Anubhab Bera',
    companyName: 'Astraiv',
    company: 'Astraiv',
    designation: 'Client Partner',
    projectName: 'DDD',
    email: null,
    overallServiceRating: 5,
    softwareQualityRating: 5,
    communicationSupportRating: 5,
    averageRating: 5.0,
    displayRating: 5,
    rating: 5,
    reviewText: 'Great overall service and project delivery from the Astraiv engineering team.',
    originalReview: 'Great overall service and project delivery from the Astraiv engineering team.',
    review: 'Great overall service and project delivery from the Astraiv engineering team.',
    canPublishReview: true,
    websitePublishPermission: 'Yes',
    identityDisplayPermission: 'Yes',
    status: 'pending',
    submittedAt: new Date('2026-09-13T22:05:16.000Z')
  },
  {
    sourceSubmissionId: 'GF-SHEET-ROW-4',
    clientName: 'Alex',
    companyName: 'Google',
    company: 'Google',
    designation: 'Software Engineer',
    projectName: 'Door to Door Begging',
    email: null,
    overallServiceRating: 5,
    softwareQualityRating: 5,
    communicationSupportRating: 5,
    averageRating: 5.0,
    displayRating: 5,
    rating: 5,
    reviewText: 'Excellent turnaround time, clean architectural execution, and great communication.',
    originalReview: 'Excellent turnaround time, clean architectural execution, and great communication.',
    review: 'Excellent turnaround time, clean architectural execution, and great communication.',
    canPublishReview: true,
    websitePublishPermission: 'Yes',
    identityDisplayPermission: 'Yes',
    status: 'pending',
    submittedAt: new Date('2026-09-14T12:59:49.000Z')
  }
];

async function run() {
  for (const r of rows) {
    const check = await pool.query('SELECT id FROM reviews WHERE source_submission_id = $1', [r.sourceSubmissionId]);
    if (check.rows.length === 0) {
      await pool.query(
        'INSERT INTO reviews (' +
          'id, source_submission_id, review_id, client_name, company_name, company, ' +
          'designation, project_name, email, overall_service_rating, software_quality_rating, ' +
          'communication_support_rating, average_rating, display_rating, rating, ' +
          'review_text, original_review, review, can_publish_review, website_publish_permission, ' +
          'identity_display_permission, status, featured, submitted_at, created_at, updated_at' +
        ') VALUES (' +
          'gen_random_uuid(), $1, $1, $2, $3, $3, ' +
          '$4, $5, $6, $7, $8, ' +
          '$9, $10, $11, $11, ' +
          '$12, $12, $12, $13, $14, ' +
          '$15, $16, false, $17, NOW(), NOW()' +
        ')',
        [
          r.sourceSubmissionId,
          r.clientName,
          r.companyName,
          r.designation,
          r.projectName,
          r.email,
          r.overallServiceRating,
          r.softwareQualityRating,
          r.communicationSupportRating,
          r.averageRating,
          r.displayRating,
          r.reviewText,
          r.canPublishReview,
          r.websitePublishPermission,
          r.identityDisplayPermission,
          r.status,
          r.submittedAt
        ]
      );
      console.log('Inserted review for:', r.clientName);
    } else {
      console.log('Already exists:', r.clientName);
    }
  }

  const all = await pool.query('SELECT id, client_name, status, average_rating, project_name, created_at FROM reviews ORDER BY created_at DESC');
  console.log('ALL DB REVIEWS NOW:');
  console.log(JSON.stringify(all.rows, null, 2));
  await pool.end();
}

run().catch(console.error);
