import { LOCATIONS } from '@/lib/constants';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: "Find a Location | BoilboX",
  description: "Find the nearest BoilboX kiosk. Order healthy, oil-free meals from our locations near you.",
  url: "https://boilox.com/locations",
  type: "website"
});

export default function LocationsPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden animate-fade-in">
      {/* Sidebar */}
      <div className="w-full lg:w-[480px] xl:w-[540px] flex flex-col h-full bg-white dark:bg-bg-dark border-r border-gray-100 dark:border-white/10 shadow-xl z-10">
        <div className="p-8 pb-4">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Find a BoilboX</h1>
          <p className="text-gray-500 text-sm mb-8">Fresh, oil-free meals served by our amazing community partners.</p>
          
          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Enter zip code, city, or state" 
              className="w-full h-14 pl-12 pr-12 rounded-2xl bg-gray-50 dark:bg-surface-dark border-none focus:ring-2 focus:ring-primary transition-all text-sm font-bold"
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform">my_location</span>
          </div>
          
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {['Open Now', 'Wheelchair Accessible', 'EBT Accepted'].map(filter => (
              <button key={filter} className="shrink-0 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-primary transition-colors">
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto hide-scrollbar px-8 pb-8 space-y-6 mt-4">
          {LOCATIONS.map((loc) => (
            <div key={loc.id} className="p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-surface-dark hover:shadow-2xl transition-all cursor-pointer group hover:border-primary/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black mb-1 leading-tight">{loc.name}</h3>
                  <p className="text-gray-400 text-xs font-medium">{loc.address}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">directions</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${loc.status === 'Open Now' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {loc.status}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{loc.status === 'Open Now' ? `Closes ${loc.closingTime}` : loc.status}</span>
                <span className="text-[10px] font-black text-gray-300 ml-auto">{loc.distance}</span>
              </div>
              
              {loc.operator && (
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-black/20 p-4 rounded-2xl">
                  <div className="relative shrink-0">
                    <img src={loc.operator.avatar} className="w-10 h-10 rounded-full border-2 border-white dark:border-white/10" />
                    <span className="absolute -bottom-1 -right-1 bg-primary text-[8px] font-black px-1 rounded-sm text-bg-dark">OP</span>
                  </div>
                  <div>
                    <p className="text-xs font-black mb-1">{loc.operator.name}</p>
                    <p className="text-[11px] text-gray-500 italic leading-snug">"{loc.operator.quote}"</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 mt-6">
                <button className="flex-1 bg-bg-dark dark:bg-white text-white dark:text-bg-dark h-10 rounded-xl font-black text-xs hover:opacity-90 transition-opacity">Order Here</button>
                <button className="flex-1 border border-gray-200 dark:border-white/10 h-10 rounded-xl font-black text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Map Content */}
      <div className="hidden lg:block flex-1 relative bg-gray-100 dark:bg-bg-dark/50">
        <div className="absolute inset-0 bg-cover bg-center grayscale opacity-50 contrast-125" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200")' }}></div>
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
        
        {/* Custom Pins */}
        <div className="absolute top-[40%] left-[45%] flex flex-col items-center animate-bounce-slow">
           <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-2xl">
              <span className="material-symbols-outlined text-bg-dark">soup_kitchen</span>
           </div>
           <div className="mt-2 bg-bg-dark text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl">Downtown</div>
        </div>

        <div className="absolute top-[60%] left-[35%] flex flex-col items-center">
           <div className="w-12 h-12 rounded-full bg-white dark:bg-bg-dark flex items-center justify-center border-4 border-primary shadow-2xl">
              <span className="material-symbols-outlined text-primary">restaurant</span>
           </div>
           <div className="mt-2 bg-white dark:bg-surface-dark text-bg-dark dark:text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl border border-gray-100 dark:border-white/10">Mission District</div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-8 right-8 flex flex-col gap-2">
          <button className="w-12 h-12 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center shadow-2xl hover:bg-gray-50 dark:hover:bg-bg-dark transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
          <button className="w-12 h-12 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center shadow-2xl hover:bg-gray-50 dark:hover:bg-bg-dark transition-colors">
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}



