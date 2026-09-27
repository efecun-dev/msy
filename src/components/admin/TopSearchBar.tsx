"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Package, FileText, Mail } from "lucide-react";
import { globalSearch } from "@/app/actions/search";
import Link from "next/link";

export default function TopSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{products: any[], quotes: any[], messages: any[]}>({products: [], quotes: [], messages: []});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({products: [], quotes: [], messages: []});
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await globalSearch(query);
        setResults(res);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // You can implement a dedicated search page later if needed
      // router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
    }
  };

  const hasResults = results.products.length > 0 || results.quotes.length > 0 || results.messages.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs sm:max-w-md hidden sm:block">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="w-4 h-4 text-panel-11 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length >= 2) setIsOpen(true);
            }}
            placeholder="Müşteri, ürün veya mesaj ara..."
            className="w-full pl-9 pr-10 py-2 bg-panel-3 border-transparent rounded-full text-sm text-panel-12 placeholder-panel-11 focus:bg-panel-1 focus:border-brand-9 focus:ring-2 focus:ring-brand-4 outline-none transition-all"
          />
          {loading && (
            <Loader2 className="w-4 h-4 text-brand-9 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full max-h-[80vh] overflow-y-auto bg-panel-1 border border-panel-6 rounded-xl shadow-xl z-50">
          {!loading && !hasResults && query.trim().length >= 2 && (
            <div className="p-4 text-sm text-center text-panel-11">
              Sonuç bulunamadı
            </div>
          )}

          {results.products.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-panel-11 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Ürünler
              </div>
              <div className="flex flex-col gap-1">
                {results.products.map(p => (
                  <Link 
                    key={`p-${p.id}`} 
                    href="/dashboard/products"
                    onClick={() => { setIsOpen(false); setQuery(""); }}
                    className="flex items-center justify-between p-2 hover:bg-panel-2 rounded-lg transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-panel-12 group-hover:text-brand-9 transition-colors">{p.name}</div>
                      <div className="text-xs text-panel-11">{p.category}</div>
                    </div>
                    <div className="text-xs font-semibold">₺{Number(p.price).toLocaleString("tr-TR")}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.quotes.length > 0 && (
            <>
              {results.products.length > 0 && <div className="h-px bg-panel-6 mx-2" />}
              <div className="p-2">
                <div className="text-xs font-semibold text-panel-11 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Teklifler
                </div>
                <div className="flex flex-col gap-1">
                  {results.quotes.map(q => (
                    <Link 
                      key={`q-${q.id}`} 
                      href={`/dashboard/quotes/${q.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 hover:bg-panel-2 rounded-lg transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-medium text-panel-12 group-hover:text-brand-9 transition-colors">{q.customerName}</div>
                        <div className="text-xs text-panel-11">{q.quoteNumber}</div>
                      </div>
                      <div className="text-xs font-semibold">₺{Number(q.totalAmount).toLocaleString("tr-TR")}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {results.messages.length > 0 && (
            <>
              {(results.products.length > 0 || results.quotes.length > 0) && <div className="h-px bg-panel-6 mx-2" />}
              <div className="p-2">
                <div className="text-xs font-semibold text-panel-11 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> İletişim Mesajları
                </div>
                <div className="flex flex-col gap-1">
                  {results.messages.map(m => (
                    <Link 
                      key={`m-${m.id}`} 
                      href="/dashboard/inbox"
                      onClick={() => { setIsOpen(false); setQuery(""); }}
                      className="flex flex-col p-2 hover:bg-panel-2 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-panel-12 group-hover:text-brand-9 transition-colors truncate pr-2">{m.name}</div>
                        {!m.isRead && <div className="w-2 h-2 rounded-full bg-brand-9 shrink-0" />}
                      </div>
                      <div className="text-xs text-panel-11 truncate">{m.subject || "Konusuz"}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
