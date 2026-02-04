import React from 'react';
import { Box, Settings as SettingsIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-telegram-sidebar border-b border-black/20 flex items-center justify-between px-6 z-30 shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-telegram-accent p-2 rounded-xl">
          <Box className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Heap Master <span className="text-telegram-accent">Pro</span></h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-telegram-text-muted hover:text-white transition-colors">
          <SettingsIcon size={20} />
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs">
          HM
        </div>
      </div>
    </header>
  );
};

export default Header;
