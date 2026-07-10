'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { CircuitBackground } from '@/components/sections/circuit-background';

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

  // Helper function to quick-fill credentials for testing
  const handleQuickFill = (role: 'admin' | 'pm' | 'client' | 'user') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const credentials = {
      admin: { email: 'admin@astraiv.com', password: 'Password123' },
      pm: { email: 'pm@astraiv.com', password: 'Password123' },
      client: { email: 'client@astraiv.com', password: 'Password123' },
      user: { email: 'user@astraiv.com', password: 'Password123' },
    };

    const cred = credentials[role];
    setValue('email', cred.email, { shouldValidate: true });
    setValue('password', cred.password, { shouldValidate: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-950 overflow-hidden">
      {/* Dynamic tech canvas lines and ambient gradients */}
      <CircuitBackground />
      
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(15,23,42,0.9)] pointer-events-none" />

      {/* Main card viewport */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-dark rounded-[20px] shadow-[0_20px_50px_rgba(9,11,18,0.6)] border border-slate-800/80 p-8 backdrop-blur-3xl">
          {/* Header branding */}
          <div className="flex flex-col items-center mb-8 text-center">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 shadow-md flex items-center justify-center">
                <div className="bg-slate-950 w-full h-full rounded-full flex items-center justify-center font-bold text-xs text-white">AI</div>
              </div>
              <div className="flex flex-col items-start leading-[1.05]">
                <span className="font-heading font-extrabold text-lg tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">ASTRAIV</span>
                <span className="text-[7px] uppercase tracking-[0.28em] font-black text-white/90">TECHNOLOGIES</span>
              </div>
            </Link>
            <h2 className="font-heading font-extrabold text-2xl tracking-tight text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground/80 font-medium">
              Access your engineering cockpit
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Status updates notifications */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-[12px] p-3.5"
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
                  className="flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-[12px] p-3.5"
                >
                  <Sparkles className="h-4.5 w-4.5 shrink-0 mt-0.5 animate-pulse" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email input field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
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
                    'pl-10.5 h-11 border-slate-800/80 bg-slate-900/40 text-slate-200 placeholder:text-slate-600 focus-visible:border-primary',
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
                <label htmlFor="password" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  {t('password')}
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-primary dark:text-accent hover:underline transition-colors"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/75">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(
                    'pl-10.5 pr-10.5 h-11 border-slate-800/80 bg-slate-900/40 text-slate-200 placeholder:text-slate-600 focus-visible:border-primary',
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
                <p className="text-xs font-semibold text-destructive mt-1 flex items-center gap-1.5 animate-pulse">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me toggle check */}
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded-sm border-slate-800/80 bg-slate-900/40 text-primary focus:ring-primary focus:ring-offset-slate-950 accent-primary"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="text-xs font-bold text-slate-400 select-none cursor-pointer">
                Keep me signed in on this device
              </label>
            </div>

            {/* Signin CTA trigger */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 text-white font-bold tracking-wide rounded-[12px] flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-primary/20 hover:scale-[1.01] transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  {t('signIn')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Footer swap */}
          <div className="mt-8 pt-6 border-t border-slate-800/40 text-center text-sm font-medium">
            <span className="text-muted-foreground/60">{t('dontHaveAccount').split('?')[0]}? </span>
            <Link
              href="/auth/signup"
              className="text-primary dark:text-accent font-bold hover:underline transition-colors ml-1"
            >
              {t('signUp')}
            </Link>
          </div>

          {/* Dev Quick Fill Dashboard shortcuts */}
          <div className="mt-8 pt-6 border-t border-slate-800/40">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Sandbox Demo Quick Fill
              </span>
              <span className="text-[9px] bg-slate-800/60 text-slate-400 font-bold px-2 py-0.5 rounded-full border border-slate-700/40">
                Dev Mode
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleQuickFill('admin')}
                className="h-8 border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-900/60 justify-center"
              >
                Admin Panel
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleQuickFill('pm')}
                className="h-8 border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-900/60 justify-center"
              >
                Project Manager
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleQuickFill('client')}
                className="h-8 border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-900/60 justify-center"
              >
                Client Portal
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleQuickFill('user')}
                className="h-8 border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-900/60 justify-center"
              >
                Standard User
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
