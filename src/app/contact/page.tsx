import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: "Contact Us | BoilboX",
  description: "Get in touch with BoilboX. Reach out for questions, partnerships, or support regarding our healthy, oil-free meals.",
  url: "https://boilox.com/contact",
  type: "website"
});

export default function ContactPage() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Reach out for customer support, partnerships, or general questions about BoilboX.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <form
            action="mailto:hello@boilox.com"
            method="post"
            encType="text/plain"
            className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 space-y-6"
          >
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
              className="h-12 px-6 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold"
            >
              Send Message
            </button>
          </form>

          <div className="space-y-6">
            <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-black">Reach us directly</h2>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-300">
                <p><span className="font-bold text-gray-900 dark:text-white">Email:</span> hello@boilox.com</p>
                <p><span className="font-bold text-gray-900 dark:text-white">Phone:</span> +1 (415) 555-0198</p>
                <p><span className="font-bold text-gray-900 dark:text-white">Address:</span> 245 Market Street, San Francisco, CA</p>
              </div>
              <div className="flex gap-3 text-sm">
                <a href="https://instagram.com" className="text-primary font-bold">Instagram</a>
                <a href="https://linkedin.com" className="text-primary font-bold">LinkedIn</a>
                <a href="https://x.com" className="text-primary font-bold">X</a>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-bg-dark/50 border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200"
                alt="Map preview"
                className="w-full h-56 object-cover"
              />
              <div className="p-6 text-sm text-gray-500 dark:text-gray-300">
                Find us near Market Street. For specific kiosk directions, use the Locations page.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



