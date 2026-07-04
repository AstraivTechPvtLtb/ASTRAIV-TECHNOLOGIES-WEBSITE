'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Bot, 
  Terminal, 
  Cpu, 
  Cloud, 
  Globe, 
  Smartphone, 
  Layers, 
  Settings, 
  Shuffle, 
  HelpCircle,
  Database,
  GitBranch
} from 'lucide-react';
import { ServiceCard } from './service-card';
import { SectionHeader } from './section-header';

export function ServicesSection() {
  const t = useTranslations('Services');

  const services = [
    {
      icon: <Bot className="h-5 w-5" />,
      title: t('aiSolutions'),
      description: t('aiSolutionsDesc'),
      href: '#contact',
    },
    {
      icon: <Terminal className="h-5 w-5" />,
      title: t('webApps'),
      description: t('webAppsDesc'),
      href: '#contact',
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      title: 'Custom Software',
      description: 'Bespoke, high-performance software engineered specifically for your core business operations.',
      href: '#contact',
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      title: t('cloud'),
      description: t('cloudDesc'),
      href: '#contact',
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: t('webDev'),
      description: t('webDevDesc'),
      href: '#contact',
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: 'Mobile Apps',
      description: 'Premium cross-platform iOS and Android applications designed with native performance.',
      href: '#contact',
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: t('uiux'),
      description: t('uiuxDesc'),
      href: '#contact',
    },
    {
      icon: <GitBranch className="h-5 w-5" />,
      title: 'DevOps & CI/CD',
      description: 'Zero-downtime deployment pipelines, automated tests, and Kubernetes container management.',
      href: '#contact',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: t('automation'),
      description: t('automationDesc'),
      href: '#contact',
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: 'Enterprise Software',
      description: 'Highly available databases, microservices architectures, and legacy system refactoring.',
      href: '#contact',
    },
    {
      icon: <Shuffle className="h-5 w-5" />,
      title: 'Digital Transformation',
      description: 'Transitioning analog workflows to scalable cloud platforms with automated logging.',
      href: '#contact',
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: 'IT Consulting',
      description: 'Senior architectural audits, technology risk assessment, and system optimization plans.',
      href: '#contact',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="services" className="py-20 md:py-28 px-6 bg-background relative overflow-hidden">
      {/* Decorative Light Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Services"
          title={t('title')}
          description={t('subtitle')}
        />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={cardVariants}>
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                href={service.href}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
