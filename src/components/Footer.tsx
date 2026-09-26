import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/data";

export default function Footer({ phone = '+90 500 123 45 67', email = 'info@msyelektronik.com', workingHours = 'Pzt - Cmt: 09:00 - 18:00', companyName = 'MSY Elektronik', instagramUrl = '', facebookUrl = '' }: { phone?: string; email?: string; workingHours?: string; companyName?: string; instagramUrl?: string; facebookUrl?: string; }) {
  const formattedPhoneForHref = phone.replace(/[^0-9+]/g, '');
  return (
    <footer className="border-t border-white/10 bg-black/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt={companyName}
                width={48}
                height={48}
                className="rounded-lg object-contain"
              />
              <div>
                <div className="font-bold text-white">{companyName}</div>
                <div className="text-xs text-blue-400 font-medium tracking-wider">
                  UYDU | GÜVENLİK | OTOMASYON
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              2009&apos;dan bu yana güvenlik ve otomasyon sistemlerinde
              güvenilir çözümler sunuyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Social */}
          {(instagramUrl || facebookUrl) && (
            <div>
              <h4 className="text-white font-semibold mb-4">Sosyal Medya</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {instagramUrl && (
                  <li>
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                      Instagram
                    </a>
                  </li>
                )}
                {facebookUrl && (
                  <li>
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                      Facebook
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href={`tel:${formattedPhoneForHref}`}
                  className="hover:text-blue-400 transition-colors"
                >
                  {phone}
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${email}`}
                  className="hover:text-blue-400 transition-colors"
                >
                  {email}
                </Link>
              </li>
              <li className="text-gray-500">{workingHours}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} {companyName}. Tüm hakları saklıdır.
            </p>
            <p className="text-gray-600 text-[11px]">
              Geliştirici:{" "}
              <a
                href="https://efecun.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline transition-colors font-semibold"
              >
                Efe
              </a>
            </p>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <span>Uydu</span>
            <span className="text-blue-600 mx-1">|</span>
            <span>Güvenlik</span>
            <span className="text-blue-600 mx-1">|</span>
            <span>Otomasyon</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
