import React, { useState } from 'react';
import { Pad } from '../types';
import { formatNumber } from '../utils/calculations';
import { clsx } from 'clsx';
import { Gem, Box, Droplets, Info } from 'lucide-react';

const ResultsTabs: React.FC<{ stats: any, pad: Pad }> = ({ stats, pad }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'خلاصه', icon: Info },
    { id: 'geometry', label: 'هندسه', icon: Box },
    { id: 'technical', label: 'فنی', icon: Gem },
    { id: 'irrigation', label: 'آبیاری', icon: Droplets },
  ];

  const KpiCard = ({ label, value, unit, icon: Icon, color }: any) => (
    <div className="bg-telegram-bubble/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-inner group hover:bg-telegram-bubble/60 transition-all">
      <div className="flex items-center gap-2 text-telegram-text-muted text-xs">
        <Icon size={14} className={color} />
        {label}
      </div>
      <div className="text-xl font-bold flex items-baseline gap-1.5 mt-1">
        {value}
        <span className="text-[10px] text-telegram-text-muted font-normal">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Switcher */}
      <div className="flex gap-1 bg-telegram-sidebar/50 p-1 rounded-xl self-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all",
                activeTab === tab.id ? "bg-telegram-accent text-white shadow-lg" : "text-telegram-text-muted hover:bg-white/5"
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-telegram-sidebar/20 p-6 rounded-3xl border border-white/5 shadow-xl">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="مس قابل استحصال" value={formatNumber(stats.cu, 1)} unit="تن" icon={Gem} color="text-yellow-400" />
            <KpiCard label="حجم خاک‌ریزی" value={formatNumber(stats.vol)} unit="متر مکعب" icon={Box} color="text-blue-400" />
            <KpiCard label="تناژ کل مواد" value={formatNumber(stats.mass)} unit="تن" icon={Gem} color="text-orange-400" />
            <KpiCard label="دبی کل آبیاری" value={formatNumber(stats.flow_m3_hr, 2)} unit="m³/hr" icon={Droplets} color="text-cyan-400" />
          </div>
        )}

        {activeTab === 'geometry' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-telegram-accent border-r-2 border-telegram-accent pr-3">ارتفاع گوشه‌ها (نسبت به زمین)</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>جلو-چپ (FL)</span><span className="font-bold">{formatNumber(stats.hBL, 2)} متر</span></div>
                <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>جلو-راست (FR)</span><span className="font-bold">{formatNumber(stats.hBR, 2)} متر</span></div>
                <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>پشت-چپ (BL)</span><span className="font-bold">{formatNumber(stats.hTL, 2)} متر</span></div>
                <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>پشت-راست (BR)</span><span className="font-bold">{formatNumber(stats.hTR, 2)} متر</span></div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-telegram-accent border-r-2 border-telegram-accent pr-3">ابعاد و سطوح</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>ابعاد تاج</span><span className="font-bold">{formatNumber(stats.topL, 2)} × {formatNumber(stats.topW, 2)} متر</span></div>
                <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>مساحت بستر</span><span className="font-bold">{formatNumber(stats.baseArea)} m²</span></div>
                <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>مساحت تاج</span><span className="font-bold">{formatNumber(stats.topArea)} m²</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>تناژ مواد معدنی</span><span className="font-bold">{formatNumber(stats.mass)} تن</span></div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>حجم Prismoidal</span><span className="font-bold">{formatNumber(stats.vol)} m³</span></div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>دانسیته خاک</span><span className="font-bold">{pad.dens} t/m³</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>عیار متوسط Cu</span><span className="font-bold">{pad.grade}%</span></div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>بازیابی کل</span><span className="font-bold">{pad.rec}%</span></div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>مصرف اسید تخمینی</span><span className="font-bold text-red-400">{formatNumber(stats.acid)} تن</span></div>
            </div>
          </div>
        )}

        {activeTab === 'irrigation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>دبی کل آبیاری</span><span className="font-bold text-cyan-400">{formatNumber(stats.flow_m3_hr, 2)} m³/hr</span></div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>تعداد کل امیترها</span><span className="font-bold">{formatNumber(stats.emitCount)} عدد</span></div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>طول کل لوله‌کشی</span><span className="font-bold">{formatNumber(stats.pipeLen)} متر</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>فاصله لترال‌ها</span><span className="font-bold">{pad.lat} cm</span></div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>فاصله امیترها</span><span className="font-bold">{pad.emit} cm</span></div>
              <div className="flex justify-between p-3 bg-white/5 rounded-xl text-sm"><span>دبی هر امیتر</span><span className="font-bold">{pad.irrRate} ml/min</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTabs;
