import React from 'react';
import { PadsProvider } from './context/PadsContext';
import Layout from './components/Layout';
import PadSidebar from './components/PadSidebar';
import PadEditor from './components/PadEditor';
import ResultsDashboard from './components/ResultsDashboard';
import HeapVisualizer from './components/HeapVisualizer';

const App: React.FC = () => {
  return (
    <PadsProvider>
      <Layout>
        <div className="flex h-full">
          <PadSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-[--telegram-header] h-14 flex items-center px-6 shadow-md z-10">
              <h1 className="text-lg font-bold">گزارش طراحی پد هیپ</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-6 bg-[--telegram-bg]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <PadEditor />
                  <ResultsDashboard />
                </div>
                <div className="h-[600px] lg:h-auto bg-[#182533] rounded-2xl overflow-hidden border border-[--telegram-border] relative">
                   <HeapVisualizer />
                </div>
              </div>
            </main>
          </div>
        </div>
      </Layout>
    </PadsProvider>
  );
};

export default App;
