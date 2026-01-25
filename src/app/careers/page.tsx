import Link from 'next/link';
import { careerRoles } from './careers-data';

export const metadata = {
  title: 'Careers | BoilboX',
  description: 'Join the BoilboX team and help scale clean, transparent food.',
};

export default function CareersPage() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Careers at BoilboX</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Help us bring clean, oil-free meals to more communities. Explore open roles below.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {careerRoles.map((role) => (
            <article key={role.slug} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black mb-2">{role.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{role.team} • {role.location} • {role.type}</p>
                </div>
                <Link
                  href={`/careers/${role.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-bold"
                >
                  View Role
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">{role.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
