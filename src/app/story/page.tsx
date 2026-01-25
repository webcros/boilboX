import Link from 'next/link';
import { getStories } from '@/lib/sanity-queries';

export default async function StoryPage() {
  const stories = await getStories();

  const founders = [
    {
      name: 'Aarav Mehta',
      role: 'Co-founder & CEO',
      bio: 'Built BoilboX to make transparent, oil-free meals accessible in everyday spaces.',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Leena Kapoor',
      role: 'Co-founder & Culinary Lead',
      bio: 'Leads recipe development and nutrition verification across the Mother Kitchen.',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Diego Alvarez',
      role: 'Co-founder & Operations',
      bio: 'Builds the kiosk playbook that keeps quality consistent across locations.',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4">Our Story</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            Discover the milestones, chapters, and moments that shaped BoilboX.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {founders.map((founder) => (
            <div key={founder.name} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
              <img src={founder.image} alt={founder.name} className="w-16 h-16 rounded-2xl object-cover mb-4" />
              <h2 className="text-xl font-black mb-1">{founder.name}</h2>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-3">{founder.role}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{founder.bio}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              title: 'Mission',
              desc: 'Deliver clean, boiled meals with radical transparency so people can trust what they eat.',
            },
            {
              title: 'Vision',
              desc: 'Make oil-free, nutrient-rich food the default option in every community space.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-black mb-3">{item.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-surface-dark text-white rounded-3xl p-10 mb-16">
          <h2 className="text-2xl font-black mb-4">Values that guide us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Transparency', desc: 'Live kitchen feeds and verified nutrition for every bowl.' },
              { title: 'Consistency', desc: 'Mother Kitchen prep ensures every kiosk serves the same quality.' },
              { title: 'Community', desc: 'Local operators and partners help us scale impact responsibly.' },
            ].map((value) => (
              <div key={value.title}>
                <h3 className="text-lg font-black mb-2 text-primary">{value.title}</h3>
                <p className="text-sm text-white/80">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: 'Founding Team',
              desc: 'A multidisciplinary team built BoilboX to make transparent, boiled meals accessible in everyday spaces.',
            },
            {
              title: 'Mission, Vision, Values',
              desc: 'Our mission is clean eating at scale. We value transparency, food safety, and local economic impact.',
            },
            {
              title: 'Why Boiled Food',
              desc: 'Boiling preserves nutrients, avoids excess oil, and delivers consistent, traceable nutrition.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-black mb-3">{item.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-surface-dark text-white rounded-3xl p-10 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Transparency', desc: 'Live kitchen feeds and verified nutrition for every bowl.' },
              { title: 'Consistency', desc: 'Mother Kitchen prep ensures every kiosk serves the same quality.' },
              { title: 'Community', desc: 'Local operators and partners help us scale impact responsibly.' },
            ].map((value) => (
              <div key={value.title}>
                <h3 className="text-lg font-black mb-2 text-primary">{value.title}</h3>
                <p className="text-sm text-white/80">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {stories.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl">
            <p className="text-gray-500 text-lg mb-2">No stories published yet</p>
            <p className="text-gray-400 text-sm">Publish a story in Sanity to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {stories.map((story) => (
              <article
                key={story.id}
                className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all"
              >
                <Link href={`/story/${story.slug}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={story.heroImage}
                      alt={story.heroImageAlt || story.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{new Date(story.publishedAt).getFullYear()}</span>
                    {story.isFeatured && (
                      <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-primary">Featured</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black leading-tight">{story.title}</h2>
                  {story.subtitle && <p className="text-sm text-gray-500 dark:text-gray-300">{story.subtitle}</p>}
                  {story.summary && <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3">{story.summary}</p>}
                  <Link href={`/story/${story.slug}`} className="text-primary font-bold text-sm inline-flex items-center gap-2">
                    Read the story <span className="material-symbols-outlined text-base">arrow_forward</span>
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



