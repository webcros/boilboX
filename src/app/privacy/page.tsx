export const metadata = {
  title: 'Privacy Policy | BoilboX',
  description: 'BoilboX privacy policy and data handling practices.',
};

export default function PrivacyPage() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-black">Privacy Policy</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          We collect only the information required to fulfill orders and respond to inquiries. Data is stored securely and never sold to third parties.
        </p>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <li>Customer contact information is used for order updates and support.</li>
          <li>Analytics are anonymized to improve service quality.</li>
          <li>You can request data deletion by emailing hello@boilox.com.</li>
        </ul>
      </div>
    </div>
  );
}
