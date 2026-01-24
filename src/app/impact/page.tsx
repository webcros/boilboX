import Link from 'next/link';
import { getImpactReports } from '@/lib/sanity-queries';

export default async function ImpactPage() {
  const reports = await getImpactReports();

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Social Impact</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our latest impact reports and the metrics that guide our mission.
          </p>
        </header>

        {reports.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl">
            <p className="text-gray-500 text-lg mb-2">No impact reports published yet</p>
            <p className="text-gray-400 text-sm">Publish an impact report in Sanity to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {reports.map((report) => (
              <article
                key={report.id}
                className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all"
              >
                <Link href={`/impact/${report.slug}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={report.coverImage}
                      alt={report.coverImageAlt || report.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Report {report.reportYear}</span>
                    {report.isFeatured && (
                      <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-primary">Featured</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black leading-tight">{report.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3">{report.summary}</p>
                  <div className="flex flex-wrap gap-3">
                    {report.metrics.slice(0, 3).map((metric) => (
                      <div key={metric.title} className="px-3 py-2 rounded-2xl bg-primary/10 text-primary text-xs font-bold">
                        {metric.title}: {metric.value}
                      </div>
                    ))}
                  </div>
                  <Link href={`/impact/${report.slug}`} className="text-primary font-bold text-sm inline-flex items-center gap-2">
                    View report <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



