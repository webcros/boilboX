import { generatePageMetadata } from '@/lib/seo';
import ContactForm from './ContactForm';

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
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
            <ContactForm />
          </div>

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
              <iframe
                className="w-full h-56"
                title="BoilboX HQ"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0868162067283!2d-122.39872068468195!3d37.79361797975666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064b9d9d1f3%3A0x6a1f3dd0a6f5d5d7!2s245%20Market%20St%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1706000000000"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
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



