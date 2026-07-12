'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, { message: 'Please select a service.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitSuccess(null);
    try {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Submitted successfully:', data);
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error(error);
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-1.5">Request a Quote</h3>
      <p className="text-sm text-muted-foreground mb-6 font-medium">Let&apos;s discuss how we can build, scale, or automate your technology needs.</p>

      {submitSuccess === true && (
        <div className="p-4 mb-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">
          Thank you! Your message has been sent successfully. We will get back to you within 24 hours.
        </div>
      )}

      {submitSuccess === false && (
        <div className="p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          Something went wrong. Please try again or email us directly at info@astraiv.com.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Full Name</label>
            <Input 
              placeholder="John Doe" 
              {...register('name')} 
              className={cn(
                "h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30",
                errors.name ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive' : ''
              )} 
            />
            {errors.name && <p className="text-xs text-destructive mt-1.5 font-semibold">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Email Address</label>
            <Input 
              type="email" 
              placeholder="john@example.com" 
              {...register('email')} 
              className={cn(
                "h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30",
                errors.email ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive' : ''
              )} 
            />
            {errors.email && <p className="text-xs text-destructive mt-1.5 font-semibold">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Phone (Optional)</label>
            <Input 
              placeholder="+1 (555) 000-0000" 
              {...register('phone')} 
              className="h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Company (Optional)</label>
            <Input 
              placeholder="Acme Corp" 
              {...register('company')} 
              className="h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Requested Service</label>
          <Select onValueChange={(val) => setValue('service', val as string)}>
            <SelectTrigger 
              className={cn(
                "w-full h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30 text-left justify-between",
                errors.service ? 'border-destructive focus:ring-destructive border-destructive' : ''
              )}
            >
              <SelectValue placeholder="Select a Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web-development">Website Development</SelectItem>
              <SelectItem value="web-applications">Web Applications</SelectItem>
              <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
              <SelectItem value="brand-identity">Brand Identity</SelectItem>
              <SelectItem value="ai-solutions">AI Solutions</SelectItem>
              <SelectItem value="cloud-solutions">Cloud Solutions</SelectItem>
              <SelectItem value="business-automation">Business Automation</SelectItem>
            </SelectContent>
          </Select>
          {errors.service && <p className="text-xs text-destructive mt-1.5 font-semibold">{errors.service.message}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">Project Details / Message</label>
          <textarea
            rows={4}
            placeholder="Tell us about your project requirements..."
            {...register('message')}
            className={cn(
              "flex w-full rounded-lg border bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 border-border/50 dark:border-border/30 px-3.5 py-2.5 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none text-foreground",
              errors.message ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive' : ''
            )}
          />
          {errors.message && <p className="text-xs text-destructive mt-1.5 font-semibold">{errors.message.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full h-12 font-bold tracking-wide mt-2">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Request...
            </>
          ) : (
            'Send Request'
          )}
        </Button>
      </form>
    </div>
  );
}
