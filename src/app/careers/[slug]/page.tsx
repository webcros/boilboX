import { notFound } from 'next/navigation';
import Link from 'next/link';
import { careerRoles } from '../careers-data';

interface CareerDetailPageProps {
  params: { slug: string };
}

export default function CareerDetailPage({ params }: CareerDetailPageProps) {
  const role = careerRoles.find((item) => item.slug === params.slug);

  if (!role) {
    notFound();
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{role.team}</p>
          <h1 className="text-4xl md:text-5xl font-black">{role.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">{role.location} • {role.type}</p>
        </header>

        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">{role.summary}</p>
          <div>
            <h2 className="text-lg font-black mb-3">Responsibilities</h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {role.responsibilities.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-black mb-3">Requirements</h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {role.requirements.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-surface-dark text-white rounded-3xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black mb-2">Ready to apply?</h2>
            <p className="text-sm text-white/80">Send your resume and a quick note to careers@boilox.com.</p>
          </div>
          <a
            href="mailto:careers@boilox.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-bold"
          >
            Apply via Email
            <span className="material-symbols-outlined text-base">mail</span>
          </a>
        </div>

        <div className="flex justify-center">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Back to Careers
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
