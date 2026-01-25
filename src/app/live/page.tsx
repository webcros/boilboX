import LiveStatusToggle from './LiveStatusToggle';

export default function LiveKitchenPage() {
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
          <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl group border-2 border-gray-100 dark:border-white/10">
            <img src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=800" alt="Live kitchen" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-24 h-24 rounded-full bg-primary hover:bg-primary-hover text-bg-dark flex items-center justify-center scale-100 hover:scale-110 transition-transform shadow-2xl">
                <span className="material-symbols-outlined !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-xl text-white">
              <span className="material-symbols-outlined text-red-500 text-lg animate-pulse">videocam</span>
              <span className="text-xs font-black tracking-widest uppercase">Cam 01 • Main Station</span>
            </div>
            <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/60 backdrop-blur rounded-lg text-white font-mono text-[10px]">
              REC • 11:42:05 AM
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-100 dark:bg-surface-dark aspect-video rounded-3xl overflow-hidden relative cursor-pointer group">
              <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-4xl">play_circle</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/40 px-2 py-1 rounded text-[10px] text-white uppercase font-bold">Cam 02 • Prep</div>
            </div>
            <div className="bg-gray-100 dark:bg-surface-dark aspect-video rounded-3xl overflow-hidden relative cursor-pointer group">
              <img src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-4xl">play_circle</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/40 px-2 py-1 rounded text-[10px] text-white uppercase font-bold">Cam 03 • Packing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



