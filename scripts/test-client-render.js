const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.cvdiedebmguahkmzkwtd:REDACTED_DATABASE_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
  ssl: { rejectUnauthorized: false },
});

async function testRender() {
  const leadRes = await pool.query("SELECT id, lead_number, name, email, company, service_id FROM crm_lead WHERE lead_number = 'AST-LEAD-2026'");
  const lead = leadRes.rows[0];
  console.log('Testing with real database lead:', lead);

  const cookieData = JSON.stringify({
    id: lead.id,
    leadNumber: lead.lead_number,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    serviceId: lead.service_id,
    role: 'CLIENT',
  });

  const res = await fetch('http://localhost:3000/en/client', {
    headers: {
      'Cookie': 'astraiv_client_lead=' + encodeURIComponent(cookieData),
    },
  });

  console.log('Status code:', res.status);
  const html = await res.text();
  console.log('Body length:', html.length);
  console.log('Has "Track Project":', html.includes('Track Project'));
  console.log('Has "Design":', html.includes('Design'));
  console.log('Has "Coding":', html.includes('Coding'));
  console.log('Has "Testing":', html.includes('Testing'));
  console.log('Has "Implementation":', html.includes('Implementation'));
  console.log('Has "Maintainance":', html.includes('Maintainance'));
  console.log('Has "Contact":', html.includes('Contact'));
  console.log('Has old "Track My Application":', html.includes('Track My Application'));
  console.log('Has old "Campus Commune":', html.includes('Campus Commune'));
  console.log('Has old "Project Dossier":', html.includes('Project Dossier'));
  console.log('Has old "Contract & NDA":', html.includes('Contract & NDA'));

  await pool.end();
}

testRender().catch(console.error);
