"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function TopSearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-xs sm:max-w-md hidden sm:block"
    >
      <Search className="w-4 h-4 text-panel-11 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Müşteri, ürün veya teklif ara..."
        className="w-full pl-9 pr-4 py-2 bg-panel-3 border-transparent rounded-full text-sm text-panel-12 placeholder-panel-11 focus:bg-panel-1 focus:border-brand-9 focus:ring-2 focus:ring-brand-4 outline-none transition-all"
      />
    </form>
  );
}
