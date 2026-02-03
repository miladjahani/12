import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen overflow-hidden text-white font-['Vazirmatn'] selection:bg-[--telegram-active] selection:text-white" dir="rtl">
      {children}
    </div>
  );
};

export default Layout;
