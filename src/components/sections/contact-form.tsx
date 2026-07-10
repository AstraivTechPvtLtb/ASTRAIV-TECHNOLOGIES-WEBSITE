'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

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
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-md">
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Request a Quote</h3>
      <p className="text-sm text-muted-foreground mb-6">Let&apos;s discuss how we can build, scale, or automate your technology needs.</p>

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">Full Name</label>
            <Input placeholder="John Doe" {...register('name')} className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''} />
            {errors.name && <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">Email Address</label>
            <Input type="email" placeholder="john@example.com" {...register('email')} className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''} />
            {errors.email && <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">Phone (Optional)</label>
            <Input placeholder="+1 (555) 000-0000" {...register('phone')} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">Company (Optional)</label>
            <Input placeholder="Acme Corp" {...register('company')} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">Requested Service</label>
          <Select onValueChange={(val) => setValue('service', val as string)}>
            <SelectTrigger className={errors.service ? 'border-destructive focus:ring-destructive' : ''}>
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
          {errors.service && <p className="text-xs text-destructive mt-1 font-medium">{errors.service.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wider">Project Details / Message</label>
          <textarea
            rows={4}
            placeholder="Tell us about your project requirements..."
            {...register('message')}
            className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
              errors.message ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
          />
          {errors.message && <p className="text-xs text-destructive mt-1 font-medium">{errors.message.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full font-semibold mt-2">
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
