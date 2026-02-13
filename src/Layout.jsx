import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { useCurrentUser } from "./components/crm/useCurrentUser";
import {
  LayoutDashboard, Users, Building2, CheckSquare, Zap, BarChart3,
  Settings, ChevronLeft, ChevronRight, Menu, X, UserCircle,
  LogOut, Target, MessageSquare, Webhook
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const NAV_ITEMS = [
  { name: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { name: "Leads", page: "Leads", icon: Target },
  { name: "Funnel", page: "Funnel", icon: BarChart3 },
  { name: "Properties", page: "Properties", icon: Building2 },
  { name: "Tasks", page: "Tasks", icon: CheckSquare },
  { name: "Performance", page: "Performance", icon: Users },
  { name: "Reports", page: "Reports", icon: BarChart3 },
  { name: "Settings", page: "Settings", icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useCurrentUser();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <style>{`
        :root {
          --primary: #0f172a;
          --accent: #6366f1;
          --accent-light: #818cf8;
        }
        .nav-item { transition: all 0.2s ease; }
        .nav-item:hover { background: rgba(99,102,241,0.08); }
        .nav-item.active { background: rgba(99,102,241,0.12); color: #6366f1; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
      `}</style>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col bg-white border-r border-slate-200
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[240px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900 text-sm tracking-tight">RealEstate CRM</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-slate-100 text-slate-400"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
          <div className="mb-2 px-3 py-1">
            {!collapsed && <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Main</p>}
          </div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileOpen(false)}
                className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  ${isActive ? "active text-indigo-600" : "text-slate-600 hover:text-slate-900"}
                `}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}

          <div className="my-2 px-3 py-1">
            {!collapsed && <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Automation</p>}
          </div>
          <Link
            to={createPageUrl("Notifications")}
            onClick={() => setMobileOpen(false)}
            className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPageName === "Notifications" ? "active text-indigo-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap className={`w-[18px] h-[18px] flex-shrink-0 ${currentPageName === "Notifications" ? "text-indigo-600" : "text-slate-400"}`} />
            {!collapsed && <span>Notifications</span>}
          </Link>
          <Link
            to={createPageUrl("WhatsAppCenter")}
            onClick={() => setMobileOpen(false)}
            className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPageName === "WhatsAppCenter" ? "active text-indigo-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className={`w-[18px] h-[18px] flex-shrink-0 ${currentPageName === "WhatsAppCenter" ? "text-indigo-600" : "text-slate-400"}`} />
            {!collapsed && <span>WhatsApp</span>}
          </Link>
          <Link
            to={createPageUrl("WebhookCapture")}
            onClick={() => setMobileOpen(false)}
            className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPageName === "WebhookCapture" ? "active text-indigo-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Webhook className={`w-[18px] h-[18px] flex-shrink-0 ${currentPageName === "WebhookCapture" ? "text-indigo-600" : "text-slate-400"}`} />
            {!collapsed && <span>Webhooks</span>}
          </Link>
        </nav>

        {/* User */}
        <div className="border-t border-slate-100 p-3">
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-4 h-4 text-indigo-600" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900 truncate">{user?.full_name || "User"}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user?.user_role || user?.role || "admin"}</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={() => base44.auth.logout()} className="text-slate-300 hover:text-slate-500">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center h-14 px-4 bg-white border-b border-slate-200">
          <button onClick={() => setMobileOpen(true)} className="text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 font-semibold text-slate-900 text-sm">{currentPageName}</span>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </main>
    </div>
  );
}