'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signupSchema, SignupInput } from '@/lib/validations/auth';
import { signUp } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { CircuitBackground } from '@/components/sections/circuit-background';

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
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-950 overflow-hidden">
      {/* Visual background lines and shadows */}
      <CircuitBackground />
      
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(15,23,42,0.9)] pointer-events-none" />

      {/* Signup form card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md my-8"
      >
        <div className="glass-dark rounded-[20px] shadow-[0_20px_50px_rgba(9,11,18,0.6)] border border-slate-800/80 p-8 backdrop-blur-3xl">
          {/* Header branding */}
          <div className="flex flex-col items-center mb-6 text-center">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 shadow-md flex items-center justify-center">
                <div className="bg-slate-950 w-full h-full rounded-full flex items-center justify-center font-bold text-xs text-white">AI</div>
              </div>
              <div className="flex flex-col items-start leading-[1.05]">
                <span className="font-heading font-extrabold text-lg tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">ASTRAIV</span>
                <span className="text-[7px] uppercase tracking-[0.28em] font-black text-white/90">TECHNOLOGIES</span>
              </div>
            </Link>
            <h2 className="font-heading font-extrabold text-2xl tracking-tight text-white mb-1.5">
              Create an Account
            </h2>
            <p className="text-xs text-muted-foreground/80 font-medium">
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
                  className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-[12px] p-3"
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
                  className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-[12px] p-3"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 animate-pulse" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  className={cn(
                    'pl-10.5 h-10.5 border-slate-800/80 bg-slate-900/40 text-slate-200 placeholder:text-slate-650 focus-visible:border-primary',
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
              <label htmlFor="email" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                {t('email')}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  className={cn(
                    'pl-10.5 h-10.5 border-slate-800/80 bg-slate-900/40 text-slate-200 placeholder:text-slate-655 focus-visible:border-primary',
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
              <label htmlFor="password" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                {t('password')}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(
                    'pl-10.5 pr-10.5 h-10.5 border-slate-800/80 bg-slate-900/40 text-slate-200 placeholder:text-slate-655 focus-visible:border-primary',
                    errors.password && 'border-destructive focus-visible:ring-destructive/30'
                  )}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75 hover:text-white transition-colors"
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
              <label htmlFor="confirmPassword" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(
                    'pl-10.5 pr-10.5 h-10.5 border-slate-800/80 bg-slate-900/40 text-slate-200 placeholder:text-slate-655 focus-visible:border-primary',
                    errors.confirmPassword && 'border-destructive focus-visible:ring-destructive/30'
                  )}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75 hover:text-white transition-colors"
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

            {/* SignUp Trigger */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 text-white font-bold tracking-wide rounded-[12px] flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-primary/20 hover:scale-[1.01] transition-all mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Registering Account...
                </>
              ) : (
                <>
                  {t('signUp')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Login link alternate */}
          <div className="mt-6 pt-5 border-t border-slate-800/40 text-center text-sm font-medium">
            <span className="text-muted-foreground/60">{t('alreadyHaveAccount').split('?')[0]}? </span>
            <Link
              href="/auth/login"
              className="text-primary dark:text-accent font-bold hover:underline transition-colors ml-1"
            >
              {t('signIn')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
