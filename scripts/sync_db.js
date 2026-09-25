const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function sync() {
  const client = await pool.connect();
  try {
    console.log('Synchronizing database schema non-destructively...');

    // 1. Update reviews table missing columns
    await client.query(`
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS source_submission_id TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS company_name TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS project_name TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS email TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS overall_service_rating INTEGER;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS software_quality_rating INTEGER;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS communication_support_rating INTEGER;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 5.00;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS display_rating INTEGER DEFAULT 5;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS liked_most TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS would_recommend TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS improvement_feedback TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS original_review TEXT DEFAULT '';
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_text TEXT DEFAULT '';
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS website_publish_permission TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS can_publish_review BOOLEAN DEFAULT false;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS identity_display_permission TEXT DEFAULT 'Yes';
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS project_id TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS service_id TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS industry_id TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
    `);
    console.log('✔ reviews columns synchronized');

    // 2. Add reviews unique constraint on source_submission_id
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'reviews_source_submission_id_key'
        ) THEN
          ALTER TABLE reviews ADD CONSTRAINT reviews_source_submission_id_key UNIQUE (source_submission_id);
        END IF;
      EXCEPTION
        WHEN others THEN NULL;
      END $$;
    `);
    console.log('✔ reviews constraint ensured');

    // 3. Create compliance_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_settings (
        id TEXT PRIMARY KEY,
        iso_number TEXT NOT NULL DEFAULT 'ISO 27001:2022',
        iso_label TEXT NOT NULL DEFAULT 'Certified',
        show_iso_badge BOOLEAN NOT NULL DEFAULT true,
        show_iso_section BOOLEAN NOT NULL DEFAULT true,
        uptime_value TEXT NOT NULL DEFAULT '99.99%',
        uptime_label TEXT NOT NULL DEFAULT 'SERVER UPTIME',
        savings_value TEXT NOT NULL DEFAULT '40%+',
        savings_label TEXT NOT NULL DEFAULT 'INFRASTRUCTURE SAVING',
        actions_value TEXT NOT NULL DEFAULT '10M+',
        actions_label TEXT NOT NULL DEFAULT 'API ACTIONS',
        sla_value TEXT NOT NULL DEFAULT '100%',
        sla_label TEXT NOT NULL DEFAULT 'ON-TIME SLA DELIVERY',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE compliance_settings ADD COLUMN IF NOT EXISTS client_logos TEXT;
    `);
    console.log('✔ compliance_settings table ensured');

    // 4. Insert default compliance record
    await client.query(`
      INSERT INTO compliance_settings (
        id, iso_number, iso_label, show_iso_badge, show_iso_section,
        uptime_value, uptime_label, savings_value, savings_label,
        actions_value, actions_label, sla_value, sla_label
      ) VALUES (
        'default-compliance-id',
        'ISO 27001:2022',
        'Certified',
        true,
        true,
        '99.99%',
        'SERVER UPTIME',
        '40%+',
        'INFRASTRUCTURE SAVING',
        '10M+',
        'API ACTIONS',
        '100%',
        'ON-TIME SLA DELIVERY'
      ) ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✔ compliance_settings default record verified');

    // 5. Create footer_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS footer_settings (
        id TEXT PRIMARY KEY,
        brand_tagline TEXT NOT NULL DEFAULT 'Your trusted partner for AI, enterprise software, and scalable cloud systems.',
        phone TEXT NOT NULL DEFAULT '+91 8167409664',
        email TEXT NOT NULL DEFAULT 'info@astraivtechnologies.com',
        address TEXT NOT NULL DEFAULT 'Ashoknagar, Kolkata',
        map_url TEXT DEFAULT 'https://maps.google.com/?q=Ashoknagar,+Kolkata',
        copyright_text TEXT DEFAULT 'Astraiv Technologies. All rights reserved.',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE footer_settings ALTER COLUMN updated_at SET DEFAULT NOW();
      ALTER TABLE footer_settings ALTER COLUMN created_at SET DEFAULT NOW();
    `);
    console.log('✔ footer_settings table ensured');

    // 6. Insert default footer record
    await client.query(`
      INSERT INTO footer_settings (
        id, brand_tagline, phone, email, address, map_url, copyright_text, created_at, updated_at
      ) VALUES (
        'default-footer-id',
        'Your trusted partner for AI, enterprise software, and scalable cloud systems.',
        '+91 8167409664',
        'info@astraivtechnologies.com',
        'Ashoknagar, Kolkata',
        'https://maps.google.com/?q=Ashoknagar,+Kolkata',
        'Astraiv Technologies. All rights reserved.',
        NOW(),
        NOW()
      ) ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✔ footer_settings default record verified');

    // 7. Create social_links table
    await client.query(`
      CREATE TABLE IF NOT EXISTS social_links (
        id TEXT PRIMARY KEY,
        platform TEXT NOT NULL,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'globe',
        active BOOLEAN NOT NULL DEFAULT true,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE social_links ALTER COLUMN updated_at SET DEFAULT NOW();
      ALTER TABLE social_links ALTER COLUMN created_at SET DEFAULT NOW();
    `);
    console.log('✔ social_links table ensured');

    // Default social links
    await client.query(`
      INSERT INTO social_links (id, platform, name, url, icon, active, order_index, created_at, updated_at)
      VALUES 
        ('social-github', 'github', 'GitHub', 'https://github.com/astraiv', 'github', true, 1, NOW(), NOW()),
        ('social-linkedin', 'linkedin', 'LinkedIn', 'https://linkedin.com/company/astraiv', 'linkedin', true, 2, NOW(), NOW()),
        ('social-twitter', 'twitter', 'Twitter', 'https://twitter.com/astraiv', 'twitter', true, 3, NOW(), NOW()),
        ('social-whatsapp', 'whatsapp', 'WhatsApp', 'https://wa.me/918167409664', 'phone', true, 4, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✔ default social_links verified');

    // 8. Create job_openings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_openings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL DEFAULT 'Engineering',
        type TEXT NOT NULL DEFAULT 'Full-Time / Remote',
        location TEXT NOT NULL DEFAULT 'Remote',
        experience TEXT,
        description TEXT NOT NULL,
        skills TEXT[] NOT NULL DEFAULT '{}',
        salary TEXT,
        apply_url TEXT DEFAULT '/contact',
        active BOOLEAN NOT NULL DEFAULT true,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✔ job_openings table ensured');

    // 9. Create pricing_plans table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        badge TEXT,
        is_popular BOOLEAN NOT NULL DEFAULT false,
        price_type TEXT NOT NULL DEFAULT 'fixed',
        price_monthly_inr DOUBLE PRECISION,
        price_yearly_inr DOUBLE PRECISION,
        price_monthly_usd DOUBLE PRECISION,
        price_yearly_usd DOUBLE PRECISION,
        custom_price_label TEXT DEFAULT 'Custom',
        features TEXT[] NOT NULL DEFAULT '{}',
        button_text TEXT NOT NULL DEFAULT 'Start Building',
        button_url TEXT NOT NULL DEFAULT '/contact',
        active BOOLEAN NOT NULL DEFAULT true,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✔ pricing_plans table ensured');

    console.log('\n🎉 ALL TABLES & COLUMNS SUCCESSFULLY SYNCHRONIZED!');
  } catch (err) {
    console.error('Error during database synchronization:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

sync();
