import React from 'react';
import {
  Bot,
  Terminal,
  Cpu,
  Cloud,
  Globe,
  Smartphone,
  Layers,
  GitBranch,
  Settings,
  Database,
  Shuffle,
  HelpCircle,
  ShieldCheck,
  Shield,
  Lock,
  Code2,
  Code,
  Server,
  Zap,
  BarChart3,
  BarChart,
  Workflow,
  Monitor,
  Layout,
  Sparkles,
  Activity,
  CheckCircle2,
  Network,
  Boxes,
  FileCode,
  Binary,
  Component,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  bot: Bot,
  terminal: Terminal,
  cpu: Cpu,
  cloud: Cloud,
  globe: Globe,
  smartphone: Smartphone,
  mobile: Smartphone,
  layers: Layers,
  gitbranch: GitBranch,
  'git-branch': GitBranch,
  settings: Settings,
  database: Database,
  shuffle: Shuffle,
  helpcircle: HelpCircle,
  'help-circle': HelpCircle,
  shieldcheck: ShieldCheck,
  'shield-check': ShieldCheck,
  shield: Shield,
  lock: Lock,
  code2: Code2,
  code: Code,
  server: Server,
  zap: Zap,
  barchart3: BarChart3,
  'bar-chart-3': BarChart3,
  barchart: BarChart,
  'bar-chart': BarChart,
  workflow: Workflow,
  monitor: Monitor,
  layout: Layout,
  sparkles: Sparkles,
  activity: Activity,
  checkcircle2: CheckCircle2,
  'check-circle-2': CheckCircle2,
  network: Network,
  boxes: Boxes,
  filecode: FileCode,
  'file-code': FileCode,
  binary: Binary,
  component: Component,
};

interface ServiceIconProps {
  name?: string | null;
  className?: string;
}

export function ServiceIcon({ name, className = 'h-5 w-5' }: ServiceIconProps) {
  if (!name) {
    return <Cpu className={className} />;
  }

  const normalized = name.toLowerCase().trim();
  const IconComponent = ICON_MAP[normalized] || Cpu;

  return <IconComponent className={className} />;
}
