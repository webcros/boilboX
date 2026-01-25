'use client';

import { useEffect, useState } from 'react';

interface ImpactStat {
  label: string;
  value: number;
  suffix?: string;
}

const stats: ImpactStat[] = [
  { label: 'Meals donated', value: 50000, suffix: '+' },
  { label: 'Local operators', value: 180, suffix: '+' },
  { label: 'Food waste saved (lbs)', value: 12000, suffix: '' },
];

export default function ImpactStats() {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounts(stats.map((stat) => Math.round(stat.value * progress)));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, index) => (
        <div key={stat.label} className="text-center">
          <p className="text-4xl md:text-5xl font-black text-primary mb-2">
            {counts[index].toLocaleString()}{stat.suffix}
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-white/70">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
