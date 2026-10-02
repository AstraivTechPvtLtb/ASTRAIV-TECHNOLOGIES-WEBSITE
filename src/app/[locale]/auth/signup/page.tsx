'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { Button } from '@/views/ui/button';
import { Input } from '@/views/ui/input';
import { signupSchema, SignupInput } from '@/lib/validations/auth';
import { signUp } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: '/dashboard', // Default callback URL
        fetchOptions: {
          onRequest: () => {
            setIsLoading(true);
          },
          onResponse: () => {
            setIsLoading(false);
          },
          onSuccess: () => {
            setSuccessMsg('Account registered successfully! Redirecting to dashboard...');
            // Redirect to user dashboard after a brief moment
            setTimeout(() => {
              router.push('/dashboard');
            }, 1200);
          },
          onError: (ctx) => {
            setErrorMsg(ctx.error.message || 'An error occurred during registration.');
          },
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during signup.';
      setErrorMsg(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-transparent text-foreground selection:bg-primary/20 overflow-hidden transition-colors">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/5 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Signup form card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md my-8"
      >
        <div className="relative rounded-3xl bg-white/85 dark:bg-[#0D1320]/85 border border-slate-200/90 dark:border-white/10 backdrop-blur-2xl p-7 sm:p-10 shadow-2xl shadow-slate-900/10 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] transition-all overflow-hidden">
          {/* Subtle top edge gradient highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-blue-400/40 to-transparent pointer-events-none" />

          {/* Header branding */}
          <div className="flex flex-col items-center justify-center text-center w-full mb-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2.5 group mb-4 mx-auto select-none"
            >
              <Image
                src="/logo-icon.jpg"
                alt="Astraiv Technologies Logo"
                width={36}
                height={36}
                priority
                className="rounded-full object-cover shrink-0 group-hover:scale-105 transition-all duration-300 ring-2 ring-primary/20 dark:ring-blue-400/30 group-hover:ring-primary/50 shadow-md"
              />
              <div className="flex flex-col items-start justify-center leading-none text-left">
                <span className="font-heading font-extrabold text-[19px] tracking-[0.06em] bg-gradient-to-r from-[#0B3D91] via-[#5B5FEF] to-[#0099FF] dark:from-[#2563EB] dark:via-[#3B82F6] dark:to-[#60A5FA] bg-clip-text text-transparent leading-none">
                  ASTRAIV
                </span>
                <span className="text-[7.5px] uppercase tracking-[0.31em] font-black text-black dark:text-white dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.85)] leading-none mt-1">
                  TECHNOLOGIES
                </span>
              </div>
            </Link>
            <h1 className="font-heading font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-foreground mb-1.5">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
              Join Astraiv and deploy your next-gen code
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Status alerts */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl p-3"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-xs rounded-xl p-3"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 animate-pulse" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-foreground/80 dark:text-slate-300 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  className={cn(
                    'pl-10.5 h-10.5 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:bg-white dark:focus:bg-slate-900 focus:border-primary dark:focus:border-blue-400 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-400/20 rounded-xl transition-all',
                    errors.name && 'border-destructive focus-visible:ring-destructive/30'
                  )}
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-foreground/80 dark:text-slate-300 uppercase tracking-wider block">
                {t('email')}
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
                  className={cn(
                    'pl-10.5 h-10.5 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:bg-white dark:focus:bg-slate-900 focus:border-primary dark:focus:border-blue-400 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-400/20 rounded-xl transition-all',
                    errors.email && 'border-destructive focus-visible:ring-destructive/30'
                  )}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-foreground/80 dark:text-slate-300 uppercase tracking-wider block">
                {t('password')}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(
                    'pl-10.5 pr-10.5 h-10.5 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:bg-white dark:focus:bg-slate-900 focus:border-primary dark:focus:border-blue-400 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-400/20 rounded-xl transition-all',
                    errors.password && 'border-destructive focus-visible:ring-destructive/30'
                  )}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1.5 leading-tight">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground/80 dark:text-slate-300 uppercase tracking-wider block">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(
                    'pl-10.5 pr-10.5 h-10.5 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:bg-white dark:focus:bg-slate-900 focus:border-primary dark:focus:border-blue-400 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-400/20 rounded-xl transition-all',
                    errors.confirmPassword && 'border-destructive focus-visible:ring-destructive/30'
                  )}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* SignUp Trigger with Astraiv Brand Gradient */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11.5 bg-gradient-to-r from-[#0B3D91] via-[#1D4ED8] to-[#2563EB] hover:from-[#082d6c] hover:via-[#1e40af] hover:to-[#1d4ed8] dark:from-[#2563EB] dark:via-[#3B82F6] dark:to-[#60A5FA] dark:hover:from-[#1d4ed8] dark:hover:via-[#2563EB] dark:hover:to-[#3b82f6] text-white font-heading font-semibold text-sm tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 dark:shadow-blue-500/20 hover:shadow-primary/35 hover:scale-[1.01] active:scale-[0.99] transition-all mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>{t('signUp')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Login link alternate */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10 text-center text-sm font-medium">
            <span className="text-muted-foreground">{t('alreadyHaveAccount').split('?')[0]}? </span>
            <Link
              href="/auth/login"
              className="text-primary dark:text-blue-400 font-semibold hover:underline transition-colors ml-1"
            >
              {t('signIn')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
