'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Menu', path: '/menu' },
    { name: 'Our Model', path: '/model' },
    { name: 'Our Story', path: '/story' },
    { name: 'Social Impact', path: '/impact' },
    { name: 'Partner', path: '/partner' },
    { name: 'Locations', path: '/locations' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-bg-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="group-hover:scale-110 transition-transform">
            <Image
              src="/updated_logo.png"
              alt="BoiledboX logo"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </div>
          <h2 className="text-xl font-bold tracking-tight">BoilboX</h2>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === link.path ? 'text-primary' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">dark_mode</span>
            ) : (
              <span className="material-symbols-outlined text-yellow-500">light_mode</span>
            )}
          </button>
          
          <Link href="/locations" className="hidden sm:flex h-10 px-5 items-center justify-center rounded-lg bg-primary hover:bg-primary-hover transition-colors text-bg-dark text-sm font-bold">
            Find a Kiosk
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-current">
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-bg-dark border-b border-gray-100 dark:border-white/10 px-4 py-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            {/* Theme Toggle in Mobile Menu */}
            <div className="flex items-center justify-between p-2">
              <span className="font-bold">Theme</span>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">dark_mode</span>
                ) : (
                  <span className="material-symbols-outlined text-yellow-500">light_mode</span>
                )}
              </button>
            </div>
            
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold hover:text-primary px-2"
              >
                {link.name}
              </Link>
            ))}
            <Link href="/locations" onClick={() => setIsMenuOpen(false)} className="bg-primary text-bg-dark text-center py-3 rounded-xl font-bold">
              Find a Kiosk
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const companyLinks = [
    { label: 'About Us', href: '/story' },
    { label: 'Careers', href: '/careers' },
    { label: 'Impact', href: '/impact' },
    { label: 'Press', href: '/media' },
    { label: 'CSR', href: '/csr' },
  ];

  const supportLinks = [
    { label: 'Contact', href: '/contact' },
    { label: 'Nutrition Lookup', href: '/nutrition' },
    { label: 'Blog', href: '/blog' },
  ];

  const policyLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/updated_logo.png"
                alt="BoiledboX logo"
                width={96}
                height={24}
                className="h-6 w-auto"
              />
              <span className="font-bold text-lg text-white">BoilboX</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              Redefining fast food with 100% boiled, oil-free meals for a healthier tomorrow.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">public</span></a>
              <a href="mailto:hello@boilox.com" className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">alternate_email</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {companyLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="hover:text-primary">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {supportLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="hover:text-primary">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Locations</h4>
            <div className="rounded-xl overflow-hidden mb-3 aspect-video bg-gray-100 dark:bg-bg-dark">
              <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400" alt="Map View" className="w-full h-full object-cover" />
            </div>
            <Link href="/locations" className="text-primary text-sm font-bold hover:underline">Find nearest Kiosk</Link>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2024 BoilboX Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {policyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);



