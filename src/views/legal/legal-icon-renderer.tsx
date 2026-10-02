'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Globe,
  Mail,
  FileText,
  ShieldAlert,
  Award,
  RefreshCw,
  CheckCircle2,
  Scale,
  FileCode,
  HelpCircle,
} from 'lucide-react';

interface LegalIconProps {
  name?: string;
  className?: string;
}

export function LegalIcon({ name, className }: LegalIconProps) {
  const iconName = (name || '').toLowerCase().trim();

  switch (iconName) {
    case 'eye':
      return <Eye className={className || 'h-5 w-5 text-primary'} />;
    case 'database':
      return <Database className={className || 'h-5 w-5 text-primary dark:text-blue-400'} />;
    case 'lock':
      return <Lock className={className || 'h-5 w-5 text-primary dark:text-cyan-400'} />;
    case 'globe':
      return <Globe className={className || 'h-5 w-5 text-primary dark:text-blue-400'} />;
    case 'shieldcheck':
    case 'shield-check':
      return <ShieldCheck className={className || 'h-5 w-5 text-primary dark:text-cyan-400'} />;
    case 'mail':
      return <Mail className={className || 'h-5 w-5 text-primary'} />;
    case 'filetext':
    case 'file-text':
      return <FileText className={className || 'h-5 w-5 text-primary'} />;
    case 'award':
      return <Award className={className || 'h-5 w-5 text-primary dark:text-cyan-400'} />;
    case 'shieldalert':
    case 'shield-alert':
      return <ShieldAlert className={className || 'h-5 w-5 text-primary dark:text-blue-400'} />;
    case 'checkcircle2':
    case 'check-circle':
    case 'check':
      return <CheckCircle2 className={className || 'h-5 w-5 text-primary dark:text-cyan-400'} />;
    case 'refreshcw':
    case 'refresh':
      return <RefreshCw className={className || 'h-5 w-5 text-primary dark:text-blue-400'} />;
    case 'scale':
      return <Scale className={className || 'h-5 w-5 text-primary dark:text-cyan-400'} />;
    case 'filecode':
    case 'code':
      return <FileCode className={className || 'h-5 w-5 text-primary'} />;
    default:
      return <HelpCircle className={className || 'h-5 w-5 text-primary'} />;
  }
}
