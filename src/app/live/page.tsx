import { getLiveKitchenVideos } from '@/lib/sanity-queries';
import LiveStatusToggle from './LiveStatusToggle';
import LiveKitchenVideos from './LiveKitchenVideos';

export default async function LiveKitchenPage() {
  const videos = await getLiveKitchenVideos();

  return (
    <div className="px-4 md:px-10 lg:px-40 py-12 animate-fade-in">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-1 space-y-8 lg:sticky lg:top-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 w-fit">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest">Live Kitchen Broadcast</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Transparency in <span className="text-primary">Every Bowl</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
            Watch our chefs prepare your oil-free meals in real-time. We believe you should see exactly how your food is handled.
          </p>

          <LiveStatusToggle />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Kitchen Temp', val: '72°F', icon: 'thermostat' },
              { label: 'Active Chefs', val: '4', icon: 'group' },
              { label: 'Sanitation Check', val: '10:00 AM', icon: 'verified_user' },
              { label: 'Water Purity', val: '99.9%', icon: 'water_drop' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm text-center">
                <span className="material-symbols-outlined text-primary mb-2">{stat.icon}</span>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black">{stat.val}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-primary/10 p-6 rounded-3xl border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">forum</span>
              <h3 className="font-bold">Live Kitchen Chat</h3>
            </div>
            <div className="space-y-4 max-h-[120px] overflow-y-auto text-sm pr-2">
              <p className="text-gray-500"><span className="font-black text-bg-dark dark:text-white mr-2">Sarah J:</span> "Is that the new spicy broth being prepped?"</p>
              <p className="text-gray-500"><span className="font-black text-primary mr-2">BoilboX:</span> "Yes Sarah! Fresh batch starting now."</p>
              <p className="text-gray-500"><span className="font-black text-bg-dark dark:text-white mr-2">Mike T:</span> "Love seeing the hygiene protocols in action!"</p>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-black mb-3">Hygiene standards</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {[
                'Hourly sanitation checks logged by supervisors.',
                'Filtered water systems validated daily.',
                'Temperature logs for every prep batch.',
                'Operator training refreshed monthly.',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 w-full space-y-8">
          {/* Videos from Sanity CMS */}
          <LiveKitchenVideos videos={videos} />

          {/* YouTube live stream embed */}
          <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 bg-white dark:bg-surface-dark">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig"
                title="BoilboX Live Kitchen Stream"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
              Live feed updates throughout service hours. If the stream is offline, check back soon.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



