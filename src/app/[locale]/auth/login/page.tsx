'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { Button } from '@/views/ui/button';
import { Input } from '@/views/ui/input';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onRequest: () => {
            setIsLoading(true);
          },
          onResponse: () => {
            setIsLoading(false);
          },
          onSuccess: (ctx) => {
            setSuccessMsg('Successfully signed in! Redirecting...');
            
            // Redirect based on role in 800ms for smooth animation
            const user = ctx.data?.user;
            const role = user?.role || 'USER';
            
            setTimeout(() => {
              switch (role) {
                case 'ADMIN':
                  router.push('/admin');
                  break;
                case 'PROJECT_MANAGER':
                  router.push('/manager');
                  break;
                case 'CLIENT':
                  router.push('/client');
                  break;
                case 'USER':
                default:
                  router.push('/dashboard');
                  break;
              }
            }, 800);
          },
          onError: (ctx) => {
            setErrorMsg(ctx.error.message || 'Invalid email or password.');
          },
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
      setErrorMsg(message);
      setIsLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-transparent text-foreground selection:bg-primary/20 overflow-hidden transition-colors">
      {/* Dynamic Ambient Background Glows matching the rest of the website */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/5 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main card viewport */}
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
          <div className="flex flex-col items-center mb-7 text-center">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <Image
                src="/logo-icon.jpg"
                alt="Astraiv Technologies Logo"
                width={38}
                height={38}
                priority
                className="rounded-full object-cover group-hover:scale-105 transition-all duration-300 ring-2 ring-primary/20 dark:ring-blue-400/30 group-hover:ring-primary/50 shadow-md"
              />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-heading font-extrabold text-[20px] tracking-wider bg-gradient-to-r from-[#0B3D91] via-[#5B5FEF] to-[#0099FF] dark:from-[#2563EB] dark:via-[#3B82F6] dark:to-[#60A5FA] bg-clip-text text-transparent pb-0.5">
                  ASTRAIV
                </span>
                <span className="text-[8px] uppercase tracking-[0.28em] font-black text-black dark:text-white dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.85)]">
                  TECHNOLOGIES
                </span>
              </div>
            </Link>
            <h1 className="font-heading font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-foreground mb-1.5">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground font-normal leading-relaxed">
              Access your engineering cockpit
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Status updates notifications */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3.5"
                >
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-sm rounded-xl p-3.5"
                >
                  <Sparkles className="h-4.5 w-4.5 shrink-0 mt-0.5 animate-pulse" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email input field */}
            <div className="space-y-2">
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

            {/* Password input field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-foreground/80 dark:text-slate-300 uppercase tracking-wider block">
                  {t('password')}
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(
                    'pl-10.5 pr-10.5 h-11 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:bg-white dark:focus:bg-slate-900 focus:border-primary dark:focus:border-blue-400 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-400/20 rounded-xl transition-all',
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
                <p className="text-xs font-semibold text-destructive mt-1 flex items-center gap-1.5 animate-pulse">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me toggle check */}
            <div className="flex items-center gap-2.5">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded-md border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900 text-primary focus:ring-primary focus:ring-offset-background accent-primary transition-colors cursor-pointer"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="text-xs font-medium text-muted-foreground hover:text-foreground select-none cursor-pointer transition-colors">
                Keep me signed in on this device
              </label>
            </div>

            {/* Signin CTA trigger with Astraiv Brand Gradient */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11.5 bg-gradient-to-r from-[#0B3D91] via-[#1D4ED8] to-[#2563EB] hover:from-[#082d6c] hover:via-[#1e40af] hover:to-[#1d4ed8] dark:from-[#2563EB] dark:via-[#3B82F6] dark:to-[#60A5FA] dark:hover:from-[#1d4ed8] dark:hover:via-[#2563EB] dark:hover:to-[#3b82f6] text-white font-heading font-semibold text-sm tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 dark:shadow-blue-500/20 hover:shadow-primary/35 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>{t('signIn')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Footer swap */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 text-center text-sm font-medium">
            <span className="text-muted-foreground">{t('dontHaveAccount').split('?')[0]}? </span>
            <Link
              href="/auth/signup"
              className="text-primary dark:text-blue-400 font-semibold hover:underline transition-colors ml-1"
            >
              {t('signUp')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
