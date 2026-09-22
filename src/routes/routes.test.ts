import { describe, it, expect } from 'vitest';
import {
  ROUTES,
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  PORTAL_ROUTES,
  API_ROUTES,
  getRoleNavLinks,
  normalizePath,
  isActiveRoute,
  getLocalizedPath,
  buildBreadcrumbs,
} from './index';

describe('MVC Routes Layer', () => {
  describe('Static & Dynamic Route Paths', () => {
    it('defines public routes correctly', () => {
      expect(PUBLIC_ROUTES.HOME).toBe('/');
      expect(PUBLIC_ROUTES.SERVICES).toBe('/services');
      expect(PUBLIC_ROUTES.INSIGHTS).toBe('/insights');
      expect(PUBLIC_ROUTES.INSIGHTS_BLOG).toBe('/insights/blog');
      expect(PUBLIC_ROUTES.INSIGHTS_DETAIL('ai-trends')).toBe('/insights/ai-trends');
      expect(PUBLIC_ROUTES.BLOG).toBe('/insights/blog');
      expect(PUBLIC_ROUTES.BLOG_DETAIL('ai-trends')).toBe('/insights/ai-trends');
      expect(PUBLIC_ROUTES.CONTACT).toBe('/contact');
      expect(PUBLIC_ROUTES.COMPANY).toBe('/company');
      expect(PUBLIC_ROUTES.INDUSTRIES).toBe('/industries');
      expect(PUBLIC_ROUTES.WORK).toBe('/work');
      expect(PUBLIC_ROUTES.CASE_STUDIES).toBe('/work/case-studies');
      expect(PUBLIC_ROUTES.CASE_STUDY_DETAIL('pulsefit')).toBe('/work/case-studies/pulsefit');
      expect(PUBLIC_ROUTES.PORTFOLIO).toBe('/work/case-studies');
      expect(PUBLIC_ROUTES.PORTFOLIO_DETAIL('pulsefit')).toBe('/work/case-studies/pulsefit');
      expect(PUBLIC_ROUTES.SOLUTIONS).toBe('/solutions');
      expect(PUBLIC_ROUTES.TECHNOLOGY).toBe('/technology');
      expect(PUBLIC_ROUTES.CAREERS).toBe('/careers');
      expect(PUBLIC_ROUTES.CAREER_DETAIL('senior-full-stack-architect')).toBe('/careers/senior-full-stack-architect');
      expect(PUBLIC_ROUTES.CAREER_APPLY('senior-full-stack-architect')).toBe('/careers/senior-full-stack-architect#apply');
      expect(PUBLIC_ROUTES.CAREER_CONFIRMATION).toBe('/careers/confirmation');
      expect(PUBLIC_ROUTES.PRICING).toBe('/pricing');
      expect(PUBLIC_ROUTES.FAQ).toBe('/faq');
      expect(PUBLIC_ROUTES.PRIVACY).toBe('/privacy');
      expect(PUBLIC_ROUTES.TERMS).toBe('/terms');
      expect(PUBLIC_ROUTES.SOLUTION_DETAIL('ai-agents')).toBe('/solutions/ai-agents');
      expect(PUBLIC_ROUTES.INDUSTRY_DETAIL('fintech')).toBe('/industries/fintech');
      expect(PUBLIC_ROUTES.REWARDS_ACCOLADES).toBe('/company/rewards-accolades');
      expect(PUBLIC_ROUTES.START_PROJECT).toBe('/start-project');
      expect(PUBLIC_ROUTES.THANK_YOU).toBe('/thank-you');
      expect(PUBLIC_ROUTES.CLIENT_PORTAL).toBe('/auth/login');
    });

    it('defines anchor routes correctly', () => {
      // Canonical Services Anchors
      expect(PUBLIC_ROUTES.SERVICES_ANCHORS.AI_DEVELOPMENT).toBe('/services#ai-development');
      expect(PUBLIC_ROUTES.SERVICES_ANCHORS.CUSTOM_SOFTWARE).toBe('/services#custom-software');
      expect(PUBLIC_ROUTES.SERVICES_ANCHORS.WEB_DEVELOPMENT).toBe('/services#web-development');
      expect(PUBLIC_ROUTES.SERVICES_ANCHORS.MOBILE_DEVELOPMENT).toBe('/services#mobile-development');
      expect(PUBLIC_ROUTES.SERVICES_ANCHORS.CLOUD_ENGINEERING).toBe('/services#cloud-engineering');
      expect(PUBLIC_ROUTES.SERVICES_ANCHORS.DEVOPS).toBe('/services#devops');
      expect(PUBLIC_ROUTES.SERVICES_ANCHORS.UI_UX_DESIGN).toBe('/services#ui-ux-design');
      expect(PUBLIC_ROUTES.SERVICES_ANCHORS.TECHNOLOGY_CONSULTING).toBe('/services#technology-consulting');

      // Canonical Solutions Anchors & Aliases
      expect(PUBLIC_ROUTES.SOLUTIONS_ANCHORS.AI_BUSINESS_AUTOMATION).toBe('/solutions#ai-business-automation');
      expect(PUBLIC_ROUTES.SOLUTIONS_ANCHORS.RAG_KNOWLEDGE).toBe('/solutions#rag-knowledge');
      expect(PUBLIC_ROUTES.SOLUTIONS_ANCHORS.SAAS_PLATFORMS).toBe('/solutions#saas-platforms');
      expect(PUBLIC_ROUTES.SOLUTIONS_ANCHORS.DATA_ANALYTICS).toBe('/solutions#data-analytics');
      expect(PUBLIC_ROUTES.SOLUTIONS_ANCHORS.BUSINESS_PROCESS_AUTOMATION).toBe('/solutions#business-process-automation');
      expect(PUBLIC_ROUTES.SOLUTIONS_ANCHORS.LEGACY_MODERNIZATION).toBe('/solutions#legacy-modernization');
      expect(PUBLIC_ROUTES.SOLUTIONS_ANCHORS.DIGITAL_TRANSFORMATION).toBe('/solutions#digital-transformation');
      expect(PUBLIC_ROUTES.SOLUTIONS_ANCHORS.AI_AGENTS).toBe('/solutions#ai-business-automation');

      // Other Anchors
      expect(PUBLIC_ROUTES.TECHNOLOGY_ANCHORS.ARCHITECTURE).toBe('/technology#architecture');
      expect(PUBLIC_ROUTES.TECHNOLOGY_ANCHORS.ALL_TECHNOLOGIES).toBe('/technology#technologies');
      expect(PUBLIC_ROUTES.COMPANY_ANCHORS.WHY_US).toBe('/company#why-us');
      expect(PUBLIC_ROUTES.COMPANY_ANCHORS.ENGAGEMENT_MODELS).toBe('/company#engagement-models');
      expect(PUBLIC_ROUTES.INDUSTRIES_ANCHORS.FINTECH).toBe('/industries#fintech');
      expect(PUBLIC_ROUTES.INDUSTRIES_ANCHORS.FINTECH_BANKING).toBe('/industries#fintech-banking');
    });

    it('defines auth routes correctly', () => {
      expect(AUTH_ROUTES.LOGIN).toBe('/auth/login');
      expect(AUTH_ROUTES.SIGNUP).toBe('/auth/signup');
      expect(AUTH_ROUTES.FORGOT_PASSWORD).toBe('/auth/forgot-password');
    });

    it('defines portal routes correctly', () => {
      expect(PORTAL_ROUTES.DASHBOARD).toBe('/dashboard');
      expect(PORTAL_ROUTES.SETTINGS).toBe('/settings');
      expect(PORTAL_ROUTES.CLIENT.PROJECTS).toBe('/client/projects');
      expect(PORTAL_ROUTES.CLIENT.TICKETS).toBe('/client/tickets');
      expect(PORTAL_ROUTES.CLIENT.BILLING).toBe('/client/billing');
      expect(PORTAL_ROUTES.ADMIN.HOME).toBe('/admin');
    });

    it('defines api routes correctly', () => {
      expect(API_ROUTES.AUTH).toBe('/api/auth');
      expect(API_ROUTES.REVIEWS).toBe('/api/reviews');
      expect(API_ROUTES.WEBHOOKS_GOOGLE_SHEETS).toBe('/api/webhooks/google-sheets');
      expect(API_ROUTES.START_PROJECT).toBe('/api/start-project');
    });

    it('is accessible via the central ROUTES namespace', () => {
      expect(ROUTES.PUBLIC.SERVICES).toBe('/services');
      expect(ROUTES.AUTH.LOGIN).toBe('/auth/login');
      expect(ROUTES.PORTAL.DASHBOARD).toBe('/dashboard');
      expect(ROUTES.API.REVIEWS).toBe('/api/reviews');
    });
  });

  describe('Route Helpers', () => {
    it('normalizes paths properly', () => {
      expect(normalizePath('/services/')).toBe('/services');
      expect(normalizePath('/services')).toBe('/services');
      expect(normalizePath('/')).toBe('/');
      expect(normalizePath('')).toBe('/');
      expect(normalizePath('/services#ai-intelligent-systems')).toBe('/services');
      expect(normalizePath('/blog?page=2')).toBe('/blog');
    });

    it('calculates active routes correctly', () => {
      // Home page check
      expect(isActiveRoute('/', '/')).toBe(true);
      expect(isActiveRoute('/', '/services')).toBe(false);

      // Root path does not mark other pages active
      expect(isActiveRoute('/services', '/')).toBe(false);

      // Prefix match
      expect(isActiveRoute('/services', '/services')).toBe(true);
      expect(isActiveRoute('/services/web-dev', '/services')).toBe(true);
      expect(isActiveRoute('/blog/my-post', '/blog')).toBe(true);

      // Exact match
      expect(isActiveRoute('/services/web-dev', '/services', true)).toBe(false);
      expect(isActiveRoute('/services', '/services', true)).toBe(true);

      // With hash anchors in target
      expect(isActiveRoute('/services', '/services#ai-intelligent-systems')).toBe(true);
    });

    it('generates localized paths correctly', () => {
      expect(getLocalizedPath('/services', 'en')).toBe('/en/services');
      expect(getLocalizedPath('/', 'es')).toBe('/es');
      expect(getLocalizedPath('/auth/login', 'bn')).toBe('/bn/auth/login');
      expect(getLocalizedPath('/blog#faq', 'en')).toBe('/en/blog#faq');
      expect(getLocalizedPath('/services')).toBe('/services');
    });

    it('builds breadcrumb structures correctly', () => {
      const crumbs = buildBreadcrumbs([
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings' },
      ]);
      expect(crumbs).toHaveLength(2);
      expect(crumbs[0]).toEqual({ label: 'Dashboard', href: '/dashboard' });
      expect(crumbs[1]).toEqual({ label: 'Settings', href: undefined });
    });
  });

  describe('Role-based Portal Navigation', () => {
    it('returns client role navigation links', () => {
      const clientLinks = getRoleNavLinks('CLIENT');
      const hrefs = clientLinks.map((l) => l.href);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.HOME);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.PROJECTS);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.TICKETS);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.BILLING);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.SETTINGS);
    });

    it('returns admin role navigation links', () => {
      const adminLinks = getRoleNavLinks('ADMIN');
      const hrefs = adminLinks.map((l) => l.href);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.HOME);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.USERS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.PROJECTS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.LEADS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.TICKETS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.BLOG);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.SETTINGS);
    });

    it('returns project manager navigation links', () => {
      const managerLinks = getRoleNavLinks('PROJECT_MANAGER');
      const hrefs = managerLinks.map((l) => l.href);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.HOME);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.PROJECTS);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.TICKETS);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.SETTINGS);
    });

    it('returns regular user navigation links by default', () => {
      const userLinks = getRoleNavLinks('USER');
      const hrefs = userLinks.map((l) => l.href);
      expect(hrefs).toContain(PORTAL_ROUTES.DASHBOARD);
      expect(hrefs).toContain(PORTAL_ROUTES.PROFILE);
      expect(hrefs).toContain(PORTAL_ROUTES.BILLING);
      expect(hrefs).toContain(PORTAL_ROUTES.SUPPORT);
      expect(hrefs).toContain(PORTAL_ROUTES.SETTINGS);
    });
  });

  describe('Cross-Page Intentional User Journeys', () => {
    it('validates 1. SERVICE JOURNEY: Home -> Services -> Service -> Case Study -> Start a Project', () => {
      const step1_Home = ROUTES.PUBLIC.HOME;
      const step2_Services = ROUTES.PUBLIC.SERVICES;
      const step3_ServiceDetail = ROUTES.PUBLIC.SERVICES_ANCHORS.AI_DEVELOPMENT;
      const step4_CaseStudy = ROUTES.PUBLIC.CASE_STUDY_DETAIL('pulsefit');
      const step5_StartProject = ROUTES.PUBLIC.START_PROJECT;

      expect(step1_Home).toBe('/');
      expect(step2_Services).toBe('/services');
      expect(step3_ServiceDetail).toBe('/services#ai-development');
      expect(step4_CaseStudy).toBe('/work/case-studies/pulsefit');
      expect(step5_StartProject).toBe('/start-project');
    });

    it('validates 2. SOLUTION JOURNEY: Home -> Solutions -> Solution -> Related Service -> Case Study -> Talk to an Expert', () => {
      const step1_Home = ROUTES.PUBLIC.HOME;
      const step2_Solutions = ROUTES.PUBLIC.SOLUTIONS;
      const step3_Solution = ROUTES.PUBLIC.SOLUTION_DETAIL('ai-business-automation');
      const step4_RelatedService = ROUTES.PUBLIC.SERVICES_ANCHORS.AI_DEVELOPMENT;
      const step5_CaseStudy = ROUTES.PUBLIC.CASE_STUDY_DETAIL('pulsefit');
      const step6_TalkExpert = `${ROUTES.PUBLIC.CONTACT}#schedule`;

      expect(step1_Home).toBe('/');
      expect(step2_Solutions).toBe('/solutions');
      expect(step3_Solution).toBe('/solutions/ai-business-automation');
      expect(step4_RelatedService).toBe('/services#ai-development');
      expect(step5_CaseStudy).toBe('/work/case-studies/pulsefit');
      expect(step6_TalkExpert).toBe('/contact#schedule');
    });

    it('validates 3. INDUSTRY JOURNEY: Home -> Industries -> Industry -> Relevant Solution -> Relevant Service -> Case Study -> Start a Project', () => {
      const step1_Home = ROUTES.PUBLIC.HOME;
      const step2_Industries = ROUTES.PUBLIC.INDUSTRIES;
      const step3_Industry = ROUTES.PUBLIC.INDUSTRY_DETAIL('fintech-banking');
      const step4_Solution = ROUTES.PUBLIC.SOLUTION_DETAIL('saas-platforms');
      const step5_Service = ROUTES.PUBLIC.SERVICES_ANCHORS.CLOUD_ENGINEERING;
      const step6_CaseStudy = ROUTES.PUBLIC.CASE_STUDY_DETAIL('novapay');
      const step7_StartProject = ROUTES.PUBLIC.START_PROJECT;

      expect(step1_Home).toBe('/');
      expect(step2_Industries).toBe('/industries');
      expect(step3_Industry).toBe('/industries/fintech-banking');
      expect(step4_Solution).toBe('/solutions/saas-platforms');
      expect(step5_Service).toBe('/services#cloud-engineering');
      expect(step6_CaseStudy).toBe('/work/case-studies/novapay');
      expect(step7_StartProject).toBe('/start-project');
    });

    it('validates 4. CASE STUDY JOURNEY: Work -> Case Study -> Related Service -> Need Something Similar? -> Start a Project', () => {
      const step1_Work = ROUTES.PUBLIC.WORK;
      const step2_CaseStudy = ROUTES.PUBLIC.CASE_STUDY_DETAIL('pulsefit');
      const step3_RelatedService = ROUTES.PUBLIC.SERVICES_ANCHORS.AI_DEVELOPMENT;
      const step4_StartProject = ROUTES.PUBLIC.START_PROJECT;

      expect(step1_Work).toBe('/work');
      expect(step2_CaseStudy).toBe('/work/case-studies/pulsefit');
      expect(step3_RelatedService).toBe('/services#ai-development');
      expect(step4_StartProject).toBe('/start-project');
    });

    it('validates 5. BLOG / INSIGHTS JOURNEY: Search -> Blog Article -> Related Solution -> Related Service -> Case Study -> Start a Project', () => {
      const step1_Article = ROUTES.PUBLIC.INSIGHTS_DETAIL('how-rag-systems-improve-enterprise-knowledge');
      const step2_Solution = ROUTES.PUBLIC.SOLUTION_DETAIL('ai-business-automation');
      const step3_Service = ROUTES.PUBLIC.SERVICES_ANCHORS.AI_DEVELOPMENT;
      const step4_CaseStudy = ROUTES.PUBLIC.CASE_STUDY_DETAIL('pulsefit');
      const step5_StartProject = ROUTES.PUBLIC.START_PROJECT;

      expect(step1_Article).toBe('/insights/how-rag-systems-improve-enterprise-knowledge');
      expect(step2_Solution).toBe('/solutions/ai-business-automation');
      expect(step3_Service).toBe('/services#ai-development');
      expect(step4_CaseStudy).toBe('/work/case-studies/pulsefit');
      expect(step5_StartProject).toBe('/start-project');
    });

    it('validates 6. TESTIMONIAL JOURNEY: Testimonials -> Related Project -> Case Study -> Related Service -> Start a Project', () => {
      const step1_Testimonials = ROUTES.PUBLIC.TESTIMONIALS;
      const step2_CaseStudy = ROUTES.PUBLIC.CASE_STUDY_DETAIL('pulsefit');
      const step3_RelatedService = '/services/ai-development';
      const step4_StartProject = ROUTES.PUBLIC.START_PROJECT;

      expect(step1_Testimonials).toBe('/work/testimonials');
      expect(step2_CaseStudy).toBe('/work/case-studies/pulsefit');
      expect(step3_RelatedService).toBe('/services/ai-development');
      expect(step4_StartProject).toBe('/start-project');
    });

    it('validates 7. COMPANY JOURNEY: About -> Why Astraiv -> Case Studies -> Start a Project', () => {
      const step1_About = ROUTES.PUBLIC.ABOUT;
      const step2_WhyAstraiv = ROUTES.PUBLIC.COMPANY_ANCHORS.WHY_US;
      const step3_CaseStudies = ROUTES.PUBLIC.CASE_STUDIES;
      const step4_StartProject = ROUTES.PUBLIC.START_PROJECT;

      expect(step1_About).toBe('/company');
      expect(step2_WhyAstraiv).toBe('/company#why-us');
      expect(step3_CaseStudies).toBe('/work/case-studies');
      expect(step4_StartProject).toBe('/start-project');
    });

    it('validates 8. CAREER JOURNEY: Company -> Careers -> Position -> Apply -> Confirmation', () => {
      const step1_Company = ROUTES.PUBLIC.COMPANY;
      const step2_Careers = ROUTES.PUBLIC.CAREERS;
      const step3_Position = ROUTES.PUBLIC.CAREER_DETAIL('senior-ai-engineer');
      const step4_Apply = ROUTES.PUBLIC.CAREER_APPLY('senior-ai-engineer');
      const step5_Confirmation = ROUTES.PUBLIC.CAREER_CONFIRMATION;

      expect(step1_Company).toBe('/company');
      expect(step2_Careers).toBe('/careers');
      expect(step3_Position).toBe('/careers/senior-ai-engineer');
      expect(step4_Apply).toBe('/careers/senior-ai-engineer#apply');
      expect(step5_Confirmation).toBe('/careers/confirmation');
    });

    it('validates 9. CLIENT JOURNEY: Home -> Client Portal Gateway -> Sign In -> Dashboard', () => {
      const step1_Home = ROUTES.PUBLIC.HOME;
      const step2_ClientGateway = PORTAL_ROUTES.CLIENT.HOME;
      const step3_Login = `${ROUTES.AUTH.LOGIN}?redirect=/client/projects`;
      const step4_ClientDashboard = PORTAL_ROUTES.CLIENT.PROJECTS;

      expect(step1_Home).toBe('/');
      expect(step2_ClientGateway).toBe('/client');
      expect(step3_Login).toBe('/auth/login?redirect=/client/projects');
      expect(step4_ClientDashboard).toBe('/client/projects');
    });
  });
});
