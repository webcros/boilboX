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
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6">Contact Us</h1>
        <p className="text-xl text-gray-500 mb-12">Coming soon...</p>
      </div>
    </div>
  );
}



