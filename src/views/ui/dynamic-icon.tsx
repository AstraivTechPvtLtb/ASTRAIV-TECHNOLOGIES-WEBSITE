'use client';

import React from 'react';
import {
  Compass,
  Users,
  HeartHandshake,
  Globe2,
  Code2,
  Brain,
  ShieldCheck,
  Briefcase,
  Cpu,
  Laptop,
  Zap,
  Terminal,
  CheckCircle2,
  Sparkles,
  Layers,
  Send,
  Lock,
  Workflow,
  Rocket,
  Server,
  Database,
  Cloud,
  Award,
  BookOpen,
  Coffee,
  DollarSign,
  Gift,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Compass,
  Users,
  HeartHandshake,
  Globe2,
  Code2,
  Brain,
  ShieldCheck,
  Briefcase,
  Cpu,
  Laptop,
  Zap,
  Terminal,
  CheckCircle2,
  Sparkles,
  Layers,
  Send,
  Lock,
  Workflow,
  Rocket,
  Server,
  Database,
  Cloud,
  Award,
  BookOpen,
  Coffee,
  DollarSign,
  Gift,
  HelpCircle,
};

interface DynamicIconProps extends LucideProps {
  name: string;
  fallback?: React.ComponentType<LucideProps>;
}

export function DynamicIcon({
  name,
  fallback = Briefcase,
  className = 'h-5 w-5',
  ...props
}: DynamicIconProps) {
  const IconComponent = ICON_MAP[name] || fallback;
  return <IconComponent className={className} {...props} />;
}
