"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, FileText, Mail } from "lucide-react";

type NotificationBellProps = {
  unreadMessagesCount: number;
  pendingQuotesCount: number;
};

export default function NotificationBell({
  unreadMessagesCount,
  pendingQuotesCount,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalNotifications = unreadMessagesCount + pendingQuotesCount;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors relative cursor-pointer ${
          isOpen
            ? "bg-panel-3 text-panel-12"
            : "hover:text-panel-12 hover:bg-panel-3 text-panel-11"
        }`}
      >
        <Bell className="w-5 h-5" />
        {totalNotifications > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-panel-1 text-[8px] font-bold text-white flex items-center justify-center">
            {totalNotifications > 9 ? "9+" : totalNotifications}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-panel-1 border border-panel-6 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-panel-6 bg-panel-2">
            <h3 className="font-bold text-panel-12 text-sm">Bildirimler</h3>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {totalNotifications === 0 ? (
              <div className="p-4 text-center text-panel-11 text-sm">
                Yeni bildiriminiz yok.
              </div>
            ) : (
              <div className="divide-y divide-panel-6">
                {pendingQuotesCount > 0 && (
                  <Link
                    href="/dashboard/quotes"
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-4 hover:bg-panel-3 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-3 text-brand-11 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-panel-12">
                        {pendingQuotesCount} Bekleyen Teklif
                      </p>
                      <p className="text-xs text-panel-11 mt-0.5">
                        İncelenmeyi bekleyen yeni teklifleriniz var.
                      </p>
                    </div>
                  </Link>
                )}

                {unreadMessagesCount > 0 && (
                  <Link
                    href="/dashboard/messages"
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-4 hover:bg-panel-3 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-panel-12">
                        {unreadMessagesCount} Okunmamış Mesaj
                      </p>
                      <p className="text-xs text-panel-11 mt-0.5">
                        İletişim formundan gelen yeni mesajlarınız var.
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
