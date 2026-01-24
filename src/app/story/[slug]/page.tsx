import { notFound } from 'next/navigation';
import Link from 'next/link';
import PortableTextContent from '@/components/PortableTextContent';
import { getStoryBySlug } from '@/lib/sanity-queries';

interface StoryDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: StoryDetailPageProps) {
  const story = await getStoryBySlug(params.slug);
  if (!story) {
    return { title: 'Story Not Found | BoilboX' };
  }

  return {
    title: story.seoTitle || `${story.title} | BoilboX`,
    description: story.seoDescription || story.summary,
    openGraph: {
      title: story.seoTitle || story.title,
      description: story.seoDescription || story.summary,
      images: story.heroImage ? [story.heroImage] : [],
    },
  };
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const story = await getStoryBySlug(params.slug);

  if (!story) {
    notFound();
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-20 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-black">{story.title}</h1>
          {story.subtitle && <p className="text-lg text-gray-500 dark:text-gray-300">{story.subtitle}</p>}
        </header>

        <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-xl">
          <img src={story.heroImage} alt={story.heroImageAlt || story.title} className="w-full h-full object-cover" />
        </div>

        {story.summary && (
          <section className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-300">{story.summary}</p>
          </section>
        )}

        {story.chapters.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-black">Chapters</h2>
            <div className="space-y-8">
              {story.chapters.map((chapter, index) => (
                <div key={`${chapter.title}-${index}`} className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-gray-100 dark:border-white/10">
                  <h3 className="text-xl font-black mb-4">{chapter.title}</h3>
                  {chapter.image && (
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-64 object-cover rounded-2xl mb-6"
                    />
                  )}
                  {chapter.content && <PortableTextContent value={chapter.content} />}
                </div>
              ))}
            </div>
          </section>
        )}

        {story.keyMoments.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-black">Key Moments</h2>
            <div className="space-y-6 border-l border-dashed border-gray-200 dark:border-white/10 pl-6">
              {story.keyMoments.map((moment, index) => (
                <div key={`${moment.title}-${index}`} className="relative">
                  <span className="absolute -left-[14px] top-2 w-3 h-3 rounded-full bg-primary"></span>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
                    {moment.year}
                  </p>
                  <h3 className="font-bold mb-1">{moment.title}</h3>
                  {moment.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">{moment.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex justify-center">
          <Link
            href="/story"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Back to Stories
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
