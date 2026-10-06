import Link from "next/link";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Package,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/admin/SidebarNav";
import SignOutButton from "@/components/admin/SignOutButton";
import MobileSidebar from "@/components/admin/MobileSidebar";
import TopSearchBar from "@/components/admin/TopSearchBar";
import NotificationBell from "@/components/admin/NotificationBell";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/dashboard/login");
  }

  const unreadCount = await prisma.contactMessage.count({
    where: { isRead: false },
  });

  const pendingQuotesCount = await prisma.quote.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="min-h-screen bg-panel-2 text-panel-12 flex font-sans transition-colors duration-200 print:bg-white print:text-black print:min-h-0 print:block">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-56 bg-panel-1 border-r border-panel-6 flex-col fixed inset-y-0 left-0 z-20 transition-colors duration-200 print:hidden">
        <div className="h-14 flex items-center px-4 border-b border-panel-6">
          <div className="w-7 h-7 bg-brand-9 text-white font-bold rounded flex items-center justify-center mr-2 text-xs">
            MS
          </div>
          <span className="font-bold text-panel-12 tracking-tight text-sm">
            MSY Panel
          </span>
        </div>

        <div className="overflow-y-auto flex-1 py-3">
          <SidebarNav />
        </div>

        <div className="p-4 border-t border-panel-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-9 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden pr-2">
                <p className="text-sm font-medium text-panel-12 truncate">
                  {session?.user?.name || "Kullanıcı"}
                </p>
                <p className="text-xs text-panel-11 truncate">
                  {session?.user?.email || "admin@msy"}
                </p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 ml-0 md:ml-56 print:ml-0 flex flex-col min-h-screen print:min-h-0 print:block">
        {/* Top Navbar */}
        <header className="h-14 bg-panel-1 border-b border-panel-6 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 transition-colors duration-200 print:hidden">
          <div className="flex items-center flex-1 max-w-xl min-w-0">
            <MobileSidebar
              userName={session?.user?.name}
              userEmail={session?.user?.email}
            />
            <TopSearchBar />
          </div>
          <div className="flex items-center gap-2 text-panel-11 shrink-0">
            <Link
              href="/dashboard/settings"
              className="p-2 hover:text-panel-12 hover:bg-panel-3 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <NotificationBell
              unreadMessagesCount={unreadCount}
              pendingQuotesCount={pendingQuotesCount}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-x-hidden print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
