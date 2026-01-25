'use client';

import { useMemo, useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const isSubmitting = status === 'submitting';

  const helperText = useMemo(() => {
    switch (status) {
      case 'success':
        return 'Thanks! We received your message and will respond shortly.';
      case 'error':
        return 'We could not submit your message. Please try again.';
      default:
        return 'We respond within 24 hours during business days.';
    }
  }, [status]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setStatus('success');
      event.currentTarget.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">Full name</label>
          <input
            className="h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 outline-none focus:ring-2 focus:ring-primary/40"
            name="name"
            placeholder="Your name"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">Email address</label>
          <input
            className="h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 outline-none focus:ring-2 focus:ring-primary/40"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">Phone</label>
          <input
            className="h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 outline-none focus:ring-2 focus:ring-primary/40"
            name="phone"
            placeholder="(555) 000-0000"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">Subject</label>
          <input
            className="h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 outline-none focus:ring-2 focus:ring-primary/40"
            name="subject"
            placeholder="How can we help?"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold">Message</label>
        <textarea
          className="h-32 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          name="message"
          placeholder="Share details so we can route you to the right team."
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 px-6 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold disabled:opacity-60"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
      <p className="text-[11px] text-gray-500 dark:text-gray-300">{helperText}</p>
    </form>
  );
}
