'use client';

/**
 * @file client/src/views/sections/services-section.tsx
 * @description [VIEW] Client homepage services section driven dynamically by PostgreSQL database records.
 */

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ServiceCard } from './service-card';
import { SectionHeader } from './section-header';
import { ServiceIcon } from '@/views/ui/service-icon';
import { PublicServiceItem } from '@/controllers/services.controller';

interface ServicesSectionProps {
  initialServices?: PublicServiceItem[];
}

export function ServicesSection({ initialServices = [] }: ServicesSectionProps) {
  const t = useTranslations('Services');

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
    <section id="services" className="py-20 md:py-28 px-6 bg-transparent relative overflow-hidden">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16 items-stretch"
        >
          {initialServices.map((service) => (
            <motion.div key={service.id || service.slug} variants={cardVariants} className="h-full flex flex-col">
              <ServiceCard
                icon={<ServiceIcon name={service.icon} className="h-5 w-5" />}
                title={service.title}
                description={service.shortDesc}
                href={`/services/${service.slug}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
