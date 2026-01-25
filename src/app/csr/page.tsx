export const metadata = {
  title: 'CSR | BoilboX',
  description: 'BoilboX corporate social responsibility commitments.',
};

export default function CSRPage() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <h1 className="text-5xl md:text-7xl font-black">CSR Commitments</h1>
        <p className="text-lg text-gray-500 dark:text-gray-300">
          BoilboX partners with local nonprofits to expand access to clean, oil-free meals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            'Meal donations for food-insecure communities.',
            'Training and jobs for local operators.',
            'Waste reduction through centralized prep.',
          ].map((item) => (
            <div key={item} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6 text-sm text-gray-600 dark:text-gray-300">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
