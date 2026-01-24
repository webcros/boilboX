import Link from 'next/link';
import { getPosts } from '@/lib/sanity-queries';

export const metadata = {
  title: 'Blog | BoilboX',
  description: 'Stories, nutrition insights, and updates from BoilboX.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="px-4 md:px-10 lg:px-40 py-20 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4">BoilboX Journal</h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Nutrition insights, product updates, and stories from the BoilboX team.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl">
            <p className="text-gray-500 text-lg mb-2">No blog posts yet</p>
            <p className="text-gray-400 text-sm">Publish a post in Sanity to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {posts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.mainImage}
                      alt={post.mainImageAlt || post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-gray-400">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    {post.readingTime && <span>{post.readingTime} min read</span>}
                  </div>
                  <h2 className="text-2xl font-black leading-tight">{post.title}</h2>
                  {post.excerpt && <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3">{post.excerpt}</p>}
                  <div className="flex items-center gap-3">
                    {post.author?.image && (
                      <img src={post.author.image} alt={post.author.name} className="w-10 h-10 rounded-full" />
                    )}
                    <div>
                      <p className="text-sm font-bold">{post.author?.name}</p>
                      {post.categories?.length > 0 && (
                        <p className="text-xs text-gray-400">{post.categories[0].title}</p>
                      )}
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-primary font-bold text-sm inline-flex items-center gap-2">
                    Read article <span className="material-symbols-outlined text-base">arrow_forward</span>
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
