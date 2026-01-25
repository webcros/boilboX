'use client';

import { useState } from 'react';

export default function LiveStatusToggle() {
  const [isLive, setIsLive] = useState(true);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setIsLive(true)}
        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-colors ${
          isLive ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-white/10'
        }`}
      >
        Live
      </button>
      <button
        type="button"
        onClick={() => setIsLive(false)}
        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-colors ${
          !isLive ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-white/10'
        }`}
      >
        Offline
      </button>
      <span className={`text-xs font-bold ${isLive ? 'text-primary' : 'text-gray-400 dark:text-gray-300'}`}>
        {isLive ? 'Broadcasting now' : 'Currently offline'}
      </span>
    </div>
  );
}
