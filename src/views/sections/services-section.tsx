'use client';

import { motion } from 'framer-motion';
import { 
  Bot, 
  Cpu, 
  Globe, 
  Smartphone, 
  Cloud, 
  Layers, 
  Network, 
  Shuffle 
} from 'lucide-react';
import { ServiceCard } from './service-card';
import { SectionHeader } from './section-header';

export function ServicesSection() {
  const services = [
    {
      icon: <Bot className="h-5 w-5" />,
      title: 'AI & Machine Learning',
      badge: 'Cognitive Engine',
      description: 'Autonomous multi-agent workflows, enterprise RAG pipelines, and customized LLM fine-tuning for domain operations.',
      imageSrc: '/images/services/service-ai.jpg',
      href: '/services#ai-intelligent-systems',
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      title: 'Custom Software Development',
      badge: 'Bespoke Engineering',
      description: 'Mission-critical distributed systems, scalable microservices, and typesafe enterprise business applications.',
      imageSrc: '/images/services/service-software.jpg',
      href: '/services#custom-software',
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: 'Web Application Development',
      badge: 'Fullstack Next.js',
      description: 'High-velocity modern SaaS platforms, client portals, and real-time dashboards utilizing Server Actions & Edge caching.',
      imageSrc: '/images/services/service-web.jpg',
      href: '/services#web-development',
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: 'Mobile App Development',
      badge: 'iOS & Android',
      description: 'High-performance cross-platform mobile experiences with offline caching, push notifications, and biometric security.',
      imageSrc: '/images/services/service-mobile.jpg',
      href: '/services#mobile-development',
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      title: 'Cloud & DevOps Infrastructure',
      badge: 'Zero-Downtime',
      description: 'Automated CI/CD pipelines, Kubernetes container orchestration, and multi-region AWS / Cloudflare global edge setups.',
      imageSrc: '/images/services/service-cloud.jpg',
      href: '/services#cloud-infrastructure',
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: 'UI/UX & Product Engineering',
      badge: 'Design System',
      description: 'Stripe-grade interfaces engineered with strict visual hierarchy, WCAG accessibility, and fluid micro-interactions.',
      imageSrc: '/images/services/service-uiux.jpg',
      href: '/services#ui-ux-design',
    },
    {
      icon: <Network className="h-5 w-5" />,
      title: 'API & System Integration',
      badge: 'Connected Systems',
      description: 'High-throughput transactional APIs, secure banking ledgers, webhook relays, and legacy ERP data synchronizations.',
      imageSrc: '/images/services/service-api.jpg',
      href: '/services#api-integration',
    },
    {
      icon: <Shuffle className="h-5 w-5" />,
      title: 'Digital Transformation',
      badge: 'Modernization',
      description: 'Migrating legacy architectures to modern cloud networks, automating manual workflows, and securing company data.',
      imageSrc: '/images/services/service-transformation.jpg',
      href: '/services#digital-transformation',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="services" className="py-20 md:py-28 px-6 bg-transparent relative overflow-hidden scroll-mt-20">
      {/* Decorative ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-primary/5 dark:bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Core Services"
          title="Technology Solutions That Move Your Business Forward"
          description="From idea to deployment, AstraIV Technologies helps businesses design, build, modernize, and scale mission-critical digital products."
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14 sm:mt-16 items-stretch"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={cardVariants} className="h-full flex flex-col">
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                href={service.href}
                imageSrc={service.imageSrc}
                badge={service.badge}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
