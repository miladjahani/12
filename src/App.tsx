import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Scene3D from './components/Scene3D';

function App() {
  const [screenshot, setScreenshot] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen bg-[#0e1621] text-white font-sans">
      <Scene3D onScreenshot={setScreenshot} />
      <div className="relative z-10 flex flex-col h-full">
        <Header screenshot={screenshot} />
        <div className="flex flex-1 overflow-hidden">
          <MainContent />
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
