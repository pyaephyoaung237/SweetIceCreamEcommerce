'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

const explore = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Product' },
  { href: '/branches', label: 'Our Location' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="w-full mt-16 bg-gradient-to-b from-pink-50 to-pink-100/70 border-t border-pink-100">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-gray-900 font-display">
            <span className="text-2xl"></span> {site.name}
          </Link>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs">{site.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {site.socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-pink-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-pink-600 hover:bg-pink-600 hover:text-white transition"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-bold text-gray-900 font-display">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {explore.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-pink-600 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-gray-900 font-display">Contact us</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>{site.address}</li>
            <li><a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-pink-600">{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-pink-600 break-all">{site.email}</a></li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3 className="font-bold text-gray-900 font-display">Opening hours</h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-600">
            {site.hours.map(h => (
              <li key={h.days}>
                <div className="font-semibold text-gray-800">{h.days}</div>
                <div>{h.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-pink-200/70">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Made with 🍨 and lots of cream</p>
        </div>
      </div>
    </footer>
  );
}