"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarNav from "./SidebarNav";
import SignOutButton from "./SignOutButton";
import ThemeToggle from "./ThemeToggle";

interface MobileSidebarProps {
  userName?: string | null;
  userEmail?: string | null;
}

export default function MobileSidebar({
  userName,
  userEmail,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 mr-2 text-panel-11 hover:text-panel-12 hover:bg-panel-3 rounded-lg cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-panel-1 border-r border-panel-6 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-panel-6">
          <div className="flex items-center">
            <div className="w-7 h-7 bg-brand-9 text-white font-bold rounded flex items-center justify-center mr-2 text-xs">
              MS
            </div>
            <span className="font-bold text-panel-12 tracking-tight text-sm">
              MSY Panel
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-panel-11 hover:text-panel-12 hover:bg-panel-3 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="overflow-y-auto flex-1 py-3"
          onClick={() => setIsOpen(false)}
        >
          <SidebarNav />
        </div>

        <div className="p-4 border-t border-panel-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-9 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden pr-2">
                <p className="text-sm font-medium text-panel-12 truncate">
                  {userName || "Kullanıcı"}
                </p>
                <p className="text-xs text-panel-11 truncate">
                  {userEmail || "admin@msy"}
                </p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </>
  );
}
