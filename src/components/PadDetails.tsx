import React, { useState, useMemo } from 'react';
import { usePads } from '../context/PadsContext';
import { calculatePadStats } from '../utils/calculations';
import SettingsPanel from './SettingsPanel';
import ResultsTabs from './ResultsTabs';
import { FileDown, Calculator } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PadDetails: React.FC = () => {
  const { pads, selectedId, terrain } = usePads();
  const selectedPad = usePads().pads.find(p => p.id === selectedId);

  const stats = useMemo(() => {
    if (!selectedPad) return null;
    return calculatePadStats(selectedPad, pads, terrain);
  }, [selectedPad, pads, terrain]);

  const exportPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#17212b' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`HeapMaster_Report_${selectedPad?.name || 'Pad'}.pdf`);
  };

  if (!selectedPad || !stats) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-telegram-text-muted">
        <Calculator size={64} className="mb-4 opacity-20" />
        <p>یک پد را برای مشاهده جزئیات انتخاب کنید</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-telegram-bg">
      {/* Pad Header */}
      <div className="h-16 bg-telegram-bg/50 backdrop-blur-md border-b border-black/10 flex items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-bold">{selectedPad.name}</h2>
          <p className="text-xs text-telegram-text-muted">موقعیت: X:{selectedPad.x}, Y:{selectedPad.z} | طبقه: {selectedPad.lift}</p>
        </div>
        <button
          onClick={exportPDF}
          className="bg-telegram-accent hover:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all"
        >
          <FileDown size={18} />
          <span>گزارش PDF</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
        <div id="report-content" className="flex flex-col gap-6">
          <ResultsTabs stats={stats} pad={selectedPad} />
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calculator className="text-telegram-accent" size={20} />
            تنظیمات و پارامترها
          </h3>
          <SettingsPanel pad={selectedPad} />
        </div>
      </div>
    </div>
  );
};

export default PadDetails;
