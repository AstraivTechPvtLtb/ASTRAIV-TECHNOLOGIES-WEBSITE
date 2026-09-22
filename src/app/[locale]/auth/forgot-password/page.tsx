'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/views/ui/button';
import { Input } from '@/views/ui/input';
import { cn } from '@/lib/utils';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-primary/20 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          {/* Top Brand & Back to Login */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Login</span>
            </Link>

            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Identity Portal
            </span>
          </div>

          <div className="text-left mb-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 shadow-md shadow-primary/10">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2 font-medium">
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
              className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed flex flex-col gap-3 mb-6"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Recovery Link Sent</span>
              </div>
              <p>{successMsg}</p>
              <Link
                href="/auth/login"
                className="mt-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 rounded-xl text-center transition-colors"
              >
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Registered Email Address
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
                    disabled={isSubmitting}
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-primary/20 transition-all select-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Recovery Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Need help footer */}
          <div className="mt-8 pt-6 border-t border-slate-800/40 text-center text-xs text-muted-foreground">
            <span>Having trouble accessing your workspace? </span>
            <Link href="/contact" className="text-primary hover:underline font-bold transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
