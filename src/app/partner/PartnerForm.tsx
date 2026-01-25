'use client';

import { useMemo, useState } from 'react';

const categories = ['Corporate', 'CSR', 'Gyms', 'Hospitals', 'Universities', 'NGOs'] as const;

export default function PartnerForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);

  const isSubmitting = status === 'submitting';

  const helperText = useMemo(() => {
    switch (status) {
      case 'success':
        return 'Thanks! Our partnerships team will reach out shortly.';
      case 'error':
        return 'We could not submit the form. Please try again.';
      default:
        return 'This is a simple interest form, not a contract.';
    }
  }, [status]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, category: selectedCategory }),
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors ${
              selectedCategory === category
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 dark:border-white/10 text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white">
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Name</label>
          <input
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40 text-white placeholder:text-white/40"
            placeholder="Your full name"
            name="name"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Email</label>
          <input
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40 text-white placeholder:text-white/40"
            placeholder="you@example.com"
            name="email"
            type="email"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Organization</label>
          <input
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40 text-white placeholder:text-white/40"
            placeholder="Company, campus or property name"
            name="organization"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Location / City</label>
          <input
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40 text-white placeholder:text-white/40"
            placeholder="Where is the space located?"
            name="location"
          />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">What kind of partnership are you exploring?</label>
          <textarea
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 h-28 outline-none focus:ring-2 focus:ring-primary/40 resize-none text-white placeholder:text-white/40"
            placeholder="Share a bit about your space, audience and timelines."
            name="notes"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 px-6 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Application'}
      </button>

      <p className="text-[11px] text-white/60">
        {helperText}
        {message ? ` (${message})` : ''}
      </p>
    </form>
  );
}
