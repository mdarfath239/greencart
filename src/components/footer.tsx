import Image from "next/image";
import Link from "next/link";

import { footerHelpLinks, footerQuickLinks, footerSocialLinks } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-white px-6 pb-16 pt-14 md:px-16 lg:px-24 xl:px-32">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Image src="/images/logo.svg" alt="GreenCart logo" width={152} height={40} className="h-10 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-gray-500/80">
            We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple and affordable.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {footerQuickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">Need help?</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {footerHelpLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">Follow Us</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {footerSocialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer" className="transition hover:text-primary">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        Copyright 2026 © GreatStack.dev All Right Reserved.
      </p>
    </footer>
  );
}
