import { notFound } from 'next/navigation';
import Link from 'next/link';
import PortableTextContent from '@/components/PortableTextContent';
import { getPostBySlug } from '@/lib/sanity-queries';

interface BlogDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found | BoilboX' };
  }

  return {
    title: post.seoTitle || `${post.title} | BoilboX`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.mainImage ? [post.mainImage] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">BoilboX Journal</p>
          <h1 className="text-4xl md:text-5xl font-black">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-gray-500 dark:text-gray-300">{post.excerpt}</p>}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.16em] text-gray-400">
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            {post.readingTime && <span>{post.readingTime} min read</span>}
            {post.author?.name && <span>By {post.author.name}</span>}
          </div>
        </header>

        <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-xl">
          <img src={post.mainImage} alt={post.mainImageAlt || post.title} className="w-full h-full object-cover" />
        </div>

        {post.mainImageCaption && (
          <p className="text-xs text-gray-400 text-center">{post.mainImageCaption}</p>
        )}

        <article className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
          <PortableTextContent value={post.body} />
        </article>

        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Back to Journal
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
