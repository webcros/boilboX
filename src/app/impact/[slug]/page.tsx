import { notFound } from 'next/navigation';
import Link from 'next/link';
import PortableTextContent from '@/components/PortableTextContent';
import { getImpactReportBySlug } from '@/lib/sanity-queries';

interface ImpactDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ImpactDetailPageProps) {
  const report = await getImpactReportBySlug(params.slug);
  if (!report) {
    return { title: 'Impact Report Not Found | BoilboX' };
  }

  return {
    title: `${report.title} | BoilboX`,
    description: report.summary,
    openGraph: {
      title: report.title,
      description: report.summary,
      images: report.coverImage ? [report.coverImage] : [],
    },
  };
}

export default async function ImpactDetailPage({ params }: ImpactDetailPageProps) {
  const report = await getImpactReportBySlug(params.slug);

  if (!report) {
    notFound();
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-20 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Impact Report {report.reportYear}</p>
          <h1 className="text-4xl md:text-6xl font-black">{report.title}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-300">{report.summary}</p>
        </header>

        <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-xl">
          <img src={report.coverImage} alt={report.coverImageAlt || report.title} className="w-full h-full object-cover" />
        </div>

        {report.metrics.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.metrics.map((metric) => (
              <div key={metric.title} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">{metric.title}</p>
                <p className="text-3xl font-black text-primary mb-2">{metric.value}</p>
                {metric.description && <p className="text-sm text-gray-500 dark:text-gray-300">{metric.description}</p>}
              </div>
            ))}
          </section>
        )}

        {report.sections.length > 0 && (
          <section className="space-y-8">
            {report.sections.map((section, index) => (
              <div key={`${section.title}-${index}`} className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-gray-100 dark:border-white/10">
                <h2 className="text-2xl font-black mb-4">{section.title}</h2>
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-64 object-cover rounded-2xl mb-6"
                  />
                )}
                {section.content && <PortableTextContent value={section.content} />}
              </div>
            ))}
          </section>
        )}

        {report.downloadUrl && (
          <div className="text-center">
            <a
              href={report.downloadUrl}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-bg-dark font-bold"
            >
              Download Full Report
              <span className="material-symbols-outlined text-base">download</span>
            </a>
          </div>
        )}

        <div className="flex justify-center">
          <Link
            href="/impact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Back to Impact Reports
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
