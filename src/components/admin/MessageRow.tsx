"use client";

import { useState } from "react";
import { Mail, MailOpen, CheckCircle } from "lucide-react";
import { markMessageRead } from "@/app/actions/contact";
import { useRouter } from "next/navigation";

export default function MessageRow({ message }: { message: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMarkRead = async () => {
    setLoading(true);
    try {
      await markMessageRead(message.id);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-5 transition-colors ${message.isRead ? "bg-panel-1" : "bg-brand-3/10"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 items-start">
          <div
            className={`mt-1 rounded-full p-2 ${message.isRead ? "bg-panel-3 text-panel-11" : "bg-brand-3 text-brand-11"}`}
          >
            {message.isRead ? (
              <MailOpen className="w-4 h-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-semibold ${message.isRead ? "text-panel-11" : "text-panel-12"}`}
              >
                {message.name}
              </h3>
              <span className="text-xs text-panel-11 bg-panel-3 px-2 py-0.5 rounded-full">
                {message.subject}
              </span>
              <span className="text-[10px] text-panel-11">
                {new Date(message.createdAt).toLocaleString("tr-TR")}
              </span>
            </div>
            <div className="text-xs font-medium text-brand-11 mb-2">
              <a href={`mailto:${message.email}`} className="hover:underline cursor-pointer">
                {message.email}
              </a>
            </div>
            <p
              className={`text-sm whitespace-pre-wrap ${message.isRead ? "text-panel-11" : "text-panel-12"}`}
            >
              {message.message}
            </p>
          </div>
        </div>

        {!message.isRead && (
          <button
            onClick={handleMarkRead}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-panel-2 hover:bg-panel-3 border border-panel-6 rounded text-xs font-semibold text-panel-12 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            Okundu İşaretle
          </button>
        )}
      </div>
    </div>
  );
}
