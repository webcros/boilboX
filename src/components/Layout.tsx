"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: "Menu", path: "/menu" },
    { name: "Track", path: "/track-order" },
    { name: "Orders", path: "/orders" },
    { name: "Model", path: "/model" },
    { name: "Story", path: "/story" },
    { name: "Impact", path: "/impact" },
    { name: "Partner", path: "/partner" },
    { name: "Locations", path: "/locations" },
  ];

  const isActiveLink = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/88 backdrop-blur-xl dark:border-white/10 dark:bg-bg-dark/88">
      <div className="mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 sm:h-20 sm:gap-4 md:px-6 xl:grid-cols-[auto_1fr_auto] xl:px-10">
        <Link href="/" className="group flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <div className="transition-transform group-hover:scale-105">
            <Image
              src="/updated_logo.png"
              alt="BoiledBoX logo"
              width={48}
              height={48}
              className="h-9 w-9 object-contain dark:hidden sm:h-10 sm:w-10"
              priority
            />
            <Image
              src="/BoiledboX%20Final%20Logo.png"
              alt="BoiledBoX logo"
              width={48}
              height={48}
              className="hidden h-9 w-9 object-contain dark:block sm:h-10 sm:w-10"
              priority
            />
          </div>
          <div className="min-w-0 leading-none">
            <p className="brand-wordmark truncate text-lg font-black tracking-tight text-gray-900 dark:text-gray-50 sm:text-xl">
              BoiledBoX
            </p>
            <p className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-gray-400 xl:block">
              Eat Clean. Live Light.
            </p>
          </div>
        </Link>

        <nav className="hidden min-w-0 justify-center lg:flex">
          <div className="navbar-light-shell inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 p-1.5 shadow-sm shadow-emerald-100/80 dark:border-emerald-900/80 dark:bg-emerald-950/70 dark:shadow-black/20">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.path);

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  aria-current={isActive ? "page" : undefined}
                  data-active={isActive ? "true" : "false"}
                  className={`navbar-light-pill rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-sm shadow-primary/20 dark:bg-emerald-700 dark:text-white dark:shadow-emerald-950/40"
                      : "bg-emerald-50 text-emerald-950 hover:bg-emerald-200 hover:text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-100 dark:hover:bg-emerald-900 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <div className="flex items-center rounded-full border border-gray-200/80 bg-white/80 p-0.5 shadow-sm shadow-gray-200/40 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 sm:p-1">
            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/8 sm:h-10 sm:w-10"
              aria-label="View cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-bg-dark">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="hidden h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/8 md:flex"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <span className="material-symbols-outlined">dark_mode</span>
              ) : (
                <span className="material-symbols-outlined text-yellow-500">
                  light_mode
                </span>
              )}
            </button>
          </div>

          {!isLoading &&
            (user ? (
              <Link
                href="/profile"
                className="profile-light-option hidden h-11 items-center justify-center rounded-full border border-gray-200/80 px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5 md:inline-flex"
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/signin"
                className="profile-light-option hidden h-11 items-center justify-center rounded-full border border-gray-200/80 px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5 md:inline-flex"
              >
                Sign In
              </Link>
            ))}

          <Link
            href="/locations"
            className="hidden h-11 items-center justify-center whitespace-nowrap rounded-full bg-primary px-5 text-sm font-bold text-bg-dark shadow-lg shadow-primary/20 transition-colors hover:bg-primary-hover md:inline-flex"
          >
            Find a Kiosk
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="rounded-full border border-gray-200/80 p-2 text-current transition-colors hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 lg:hidden"
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="animate-fade-in border-t border-gray-200/80 bg-white/98 shadow-lg shadow-gray-200/20 backdrop-blur-xl dark:border-white/10 dark:bg-bg-dark/94 lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-4 pb-4">
            <div className="max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-[1.75rem] border border-gray-200 bg-white shadow-md shadow-gray-200/40 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-transparent">
                <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                  Theme
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-full p-2 text-slate-700 transition-colors hover:bg-white dark:text-gray-300 dark:hover:bg-white/8"
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                  {theme === "light" ? (
                    <span className="material-symbols-outlined text-slate-700 dark:text-gray-300">
                      dark_mode
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-yellow-500">
                      light_mode
                    </span>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 p-4 min-[480px]:grid-cols-2">
                {navLinks.map((link) => {
                  const isActive = isActiveLink(link.path);

                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      data-active={isActive ? "true" : "false"}
                      className={`mobile-nav-light-pill flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? "border-primary/40 bg-emerald-100 text-primary shadow-sm shadow-primary/10 dark:border-emerald-700/80 dark:bg-emerald-700/85 dark:text-white dark:shadow-emerald-950/30"
                          : "border-emerald-200 bg-emerald-50 text-emerald-950 shadow-sm shadow-emerald-100/80 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/80 dark:bg-emerald-950/75 dark:text-emerald-100 dark:shadow-none dark:hover:bg-emerald-900/85 dark:hover:text-white"
                      }`}
                    >
                      <span>{link.name}</span>
                      <span className="material-symbols-outlined !text-[18px]">
                        arrow_forward
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-2 border-t border-gray-200/70 p-4 min-[480px]:grid-cols-2 md:grid-cols-3 dark:border-white/10">
                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-sm shadow-emerald-100/80 transition-colors hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/80 dark:bg-emerald-950/75 dark:text-emerald-100 dark:shadow-none dark:hover:bg-emerald-900/85 dark:hover:text-white"
                >
                  Cart {itemCount > 0 ? `(${itemCount})` : ""}
                </Link>
                {!isLoading && (
                  <Link
                    href={user ? "/profile" : "/signin"}
                    onClick={() => setIsMenuOpen(false)}
                    className="profile-light-option rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-sm shadow-emerald-100/80 transition-colors hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/80 dark:bg-emerald-950/75 dark:text-emerald-100 dark:shadow-none dark:hover:bg-emerald-900/85 dark:hover:text-white"
                  >
                    {user ? "Profile" : "Sign In"}
                  </Link>
                )}
                <Link
                  href="/locations"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl bg-primary px-4 py-3 text-center text-sm font-bold text-bg-dark transition-colors hover:bg-primary-hover"
                >
                  Find a Kiosk
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const companyLinks = [
    { label: "About Us", href: "/story" },
    { label: "Careers", href: "/careers" },
    { label: "Impact", href: "/impact" },
    { label: "Press", href: "/media" },
    { label: "CSR", href: "/csr" },
  ];

  const supportLinks = [
    { label: "Contact", href: "/contact" },
    { label: "Track Order", href: "/track-order" },
    { label: "Order History", href: "/orders" },
    { label: "Nutrition Lookup", href: "/nutrition" },
    { label: "Blog", href: "/blog" },
  ];

  const policyLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/updated_logo.png"
                alt="BoiledBoX logo"
                width={40}
                height={40}
                className="h-9 w-9 object-contain dark:hidden"
              />
              <Image
                src="/BoiledboX%20Final%20Logo.png"
                alt="BoiledBoX logo"
                width={40}
                height={40}
                className="h-9 w-9 object-contain hidden dark:block"
              />
              <span className="font-bold text-lg text-white leading-none">
                BoiledBoX
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              Redefining fast food with 100% boiled, oil-free meals for a
              healthier tomorrow.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-primary"
              >
                <span className="material-symbols-outlined">public</span>
              </a>
              <a
                href="mailto:hello@boilox.com"
                className="text-gray-400 hover:text-primary"
              >
                <span className="material-symbols-outlined">
                  alternate_email
                </span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">
              Locations
            </h4>
            <div className="rounded-xl overflow-hidden mb-3 aspect-video bg-gray-100 dark:bg-bg-dark">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400"
                alt="Map View"
                className="w-full h-full object-cover"
              />
            </div>
            <Link
              href="/locations"
              className="text-primary text-sm font-bold hover:underline"
            >
              Find nearest Kiosk
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2024 BoilboX Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {policyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary"
              >
                {link.label}
              </Link>
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
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
