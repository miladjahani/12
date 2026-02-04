import React, { useState } from 'react';
import { PadsProvider } from './context/PadsContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PadDetails from './components/PadDetails';
import Scene3D from './components/Scene3D';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from 'lucide-react';

function App() {
  const [show3D, setShow3D] = useState(false);

  return (
    <PadsProvider>
      <div className="flex flex-col h-screen bg-telegram-bg overflow-hidden text-white font-['Vazirmatn']" dir="rtl">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <PadDetails />
        </div>

        {/* Floating Button for 3D */}
        <button
          onClick={() => setShow3D(true)}
          className="fixed bottom-8 left-8 bg-telegram-accent hover:bg-blue-400 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center gap-2 z-40"
        >
          <Box size={24} />
          <span className="font-bold">نمای سه‌بعدی</span>
        </button>

        <AnimatePresence>
          {show3D && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 bg-black flex flex-col"
            >
              <div className="bg-telegram-sidebar p-4 flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Box className="text-telegram-accent" />
                  نمای سه‌بعدی سایت
                </h2>
                <button
                  onClick={() => setShow3D(false)}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-4 py-2 rounded-lg transition-colors"
                >
                  بستن
                </button>
              </div>
              <div className="flex-1 relative">
                <Scene3D />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PadsProvider>
  );
}

export default App;
