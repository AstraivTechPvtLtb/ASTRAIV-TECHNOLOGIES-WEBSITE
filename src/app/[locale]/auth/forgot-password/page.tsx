'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Button } from '@/views/ui/button';
import { Input } from '@/views/ui/input';
import { cn } from '@/lib/utils';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth';

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Simulate password recovery dispatch / Better Auth reset link request
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSuccessMsg(
        `If an account is associated with ${data.email}, a secure password reset link has been dispatched. Please check your inbox and spam folder.`
      );
    } catch {
      setErrorMsg('Unable to process your request. Please try again or contact engineering support directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-transparent text-foreground selection:bg-primary/20 overflow-hidden transition-colors">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/5 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md my-8"
      >
        <div className="relative rounded-3xl bg-white/85 dark:bg-[#0D1320]/85 border border-slate-200/90 dark:border-white/10 backdrop-blur-2xl p-7 sm:p-10 shadow-2xl shadow-slate-900/10 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] transition-all overflow-hidden">
          {/* Subtle top edge gradient highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-blue-400/40 to-transparent pointer-events-none" />

          {/* Top Brand & Back to Login */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Login</span>
            </Link>

            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo-icon.jpg"
                alt="Astraiv Technologies Logo"
                width={28}
                height={28}
                priority
                className="rounded-full object-cover group-hover:scale-105 transition-all duration-300 ring-2 ring-primary/20 dark:ring-blue-400/30 group-hover:ring-primary/40 shadow-sm"
              />
              <span className="font-heading font-extrabold text-sm tracking-wider bg-gradient-to-r from-[#0B3D91] via-[#5B5FEF] to-[#0099FF] dark:from-[#2563EB] dark:via-[#3B82F6] dark:to-[#60A5FA] bg-clip-text text-transparent">
                ASTRAIV
              </span>
            </Link>
          </div>

          <div className="text-left mb-7">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 dark:bg-blue-400/10 border border-primary/20 dark:border-blue-400/20 text-primary dark:text-blue-300 flex items-center justify-center mb-4 shadow-md shadow-primary/10">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-[-0.025em] font-heading mb-1.5">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              Enter your registered corporate or personal email address to receive a secure recovery link.
            </p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2 mb-6"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-300 text-xs leading-relaxed flex flex-col gap-3 mb-6"
            >
              <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Recovery Link Sent</span>
              </div>
              <p>{successMsg}</p>
              <Link
                href="/auth/login"
                className="mt-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 rounded-xl text-center transition-colors"
              >
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-semibold text-foreground/80 dark:text-slate-300 uppercase tracking-wider block">
                  Registered Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className={cn(
                      'pl-10.5 h-11 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:bg-white dark:focus:bg-slate-900 focus:border-primary dark:focus:border-blue-400 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-400/20 rounded-xl transition-all',
                      errors.email && 'border-destructive focus-visible:ring-destructive/30'
                    )}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-semibold text-destructive mt-1 flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11.5 bg-gradient-to-r from-[#0B3D91] via-[#1D4ED8] to-[#2563EB] hover:from-[#082d6c] hover:via-[#1e40af] hover:to-[#1d4ed8] dark:from-[#2563EB] dark:via-[#3B82F6] dark:to-[#60A5FA] dark:hover:from-[#1d4ed8] dark:hover:via-[#2563EB] dark:hover:to-[#3b82f6] text-white font-heading font-semibold text-sm tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 dark:shadow-blue-500/20 hover:shadow-primary/35 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Recovery Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Need help footer */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 text-center text-xs text-muted-foreground">
            <span>Having trouble accessing your workspace? </span>
            <Link
              href="/contact"
              className="text-primary dark:text-blue-400 font-semibold hover:underline transition-colors ml-1"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
