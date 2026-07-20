import React from 'react';
import {
  LayoutDashboard,
  FilePlus,
  BarChart2,
  ShieldAlert,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 w-full transition-colors rounded-lg",
      active
        ? "bg-slate-100 text-slate-900 font-bold dark:bg-slate-800 dark:text-slate-100"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-300"
    )}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

interface SidebarLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SidebarLayout = ({ children, activeTab, setActiveTab }: SidebarLayoutProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد مدیریتی', icon: LayoutDashboard },
    { id: 'project-input', label: 'ثبت پروژه جدید', icon: FilePlus },
    { id: 'analysis', label: 'تحلیل حساسیت', icon: BarChart2 },
    { id: 'risk', label: 'مشاوره هوشمند ریسک', icon: ShieldAlert },
    { id: 'reports', label: 'گزارش‌های رسمی', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-vazir">
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-slate-200 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0 dark:bg-slate-900 dark:border-slate-800",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Settings className="w-6 h-6 animate-spin-slow" />
              </div>
              <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">تحلیل مالی معدن</h1>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                />
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
            <SidebarItem
              icon={HelpCircle}
              label="راهنمای سیستم"
              onClick={() => {}}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 lg:hidden dark:bg-slate-900 dark:border-slate-800">
          <button onClick={() => setIsOpen(true)} className="p-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">تحلیل مالی معدن</h1>
          <div className="w-6" /> {/* Placeholder for balance */}
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
