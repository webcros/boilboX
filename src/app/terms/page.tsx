export const metadata = {
  title: 'Terms of Service | BoilboX',
  description: 'BoilboX terms and conditions for using our services.',
};

export default function TermsPage() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-black">Terms of Service</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          By using BoilboX services, you agree to follow kiosk usage guidelines, respect sanitation protocols, and provide accurate order information.
        </p>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <li>Orders are subject to availability and kiosk operating hours.</li>
          <li>Nutrition details are estimates and may vary by batch.</li>
          <li>BoilboX may update these terms with notice.</li>
        </ul>
      </div>
    </div>
  );
}
