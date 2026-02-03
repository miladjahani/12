import React, { useMemo } from 'react';
import { usePads } from '../context/PadsContext';
import { calculatePadResults } from '../utils/heapCalculations';
import { TrendingUp, Box, Droplets, Target, FileText } from 'lucide-react';

const ResultsDashboard: React.FC = () => {
  const { pads, selectedPadId, terrain } = usePads();
  const pad = pads.find(p => p.id === selectedPadId);

  const results = useMemo(() => {
    if (!pad) return null;
    return calculatePadResults(pad, terrain, pads);
  }, [pad, terrain, pads]);

  if (!results) return null;

  const f = (n: number) => n.toLocaleString('fa-IR', { maximumFractionDigits: 0 });
  const f2 = (n: number) => n.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const KPICard = ({ label, value, unit, icon: Icon, color }: any) => (
    <div className="bg-[#1c2936] p-4 rounded-xl border border-[--telegram-border] flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-[10px] text-[--telegram-muted]">{label}</div>
        <div className="text-lg font-bold">
          {value} <span className="text-xs font-normal opacity-60">{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard label="مس قابل استحصال" value={f2(results.cu)} unit="تن" icon={Target} color="bg-green-600" />
        <KPICard label="حجم خاک‌ریزی" value={f(results.vol)} unit="m³" icon={Box} color="bg-blue-600" />
        <KPICard label="مصرف اسید" value={f(results.acid)} unit="تن" icon={FileText} color="bg-red-600" />
        <KPICard label="دبی کل آبیاری" value={f2(results.flowRate)} unit="m³/hr" icon={Droplets} color="bg-cyan-600" />
      </div>

      <div className="bg-[#1c2936] rounded-xl border border-[--telegram-border] overflow-hidden">
        <div className="bg-[#2b5278]/20 p-3 border-b border-[--telegram-border] font-bold text-sm flex items-center gap-2">
          <TrendingUp size={16} /> جزئیات فنی و مهندسی
        </div>
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm border-b border-[--telegram-border]/30 py-2">
            <span className="text-[--telegram-muted]">تناژ کل مواد</span>
            <span>{f(results.mass)} تن</span>
          </div>
          <div className="flex justify-between text-sm border-b border-[--telegram-border]/30 py-2">
            <span className="text-[--telegram-muted]">مساحت بستر / تاج</span>
            <span>{f(results.baseArea)} / {f(results.topArea)} m²</span>
          </div>
          <div className="flex justify-between text-sm border-b border-[--telegram-border]/30 py-2">
            <span className="text-[--telegram-muted]">ابعاد تاج پد</span>
            <span>{f2(results.topL)} × {f2(results.topW)} متر</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-[--telegram-muted]">تعداد امیترها</span>
            <span>{f(results.emitCount)} عدد</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
