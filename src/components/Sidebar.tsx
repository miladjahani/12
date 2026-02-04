import React from 'react';
import { usePads } from '../context/PadsContext';
import { Plus, Trash2, Layers } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar: React.FC = () => {
  const { pads, selectedId, selectPad, addPad, deletePad } = usePads();

  return (
    <div className="w-80 bg-telegram-sidebar border-l border-black/20 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-black/10">
        <div className="flex gap-2">
          <button
            onClick={() => addPad('right')}
            className="flex-1 bg-telegram-bubble hover:bg-blue-600/50 text-xs py-2 rounded-lg flex flex-col items-center gap-1 transition-all"
          >
            <Plus size={14} />
            <span>کنار (راست)</span>
          </button>
          <button
            onClick={() => addPad('front')}
            className="flex-1 bg-telegram-bubble hover:bg-blue-600/50 text-xs py-2 rounded-lg flex flex-col items-center gap-1 transition-all"
          >
            <Plus size={14} />
            <span>کنار (جلو)</span>
          </button>
          <button
            onClick={() => addPad('top')}
            className="flex-1 bg-telegram-accent hover:bg-blue-400 text-xs py-2 rounded-lg flex flex-col items-center gap-1 transition-all"
          >
            <Layers size={14} />
            <span>طبقه بالا</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {pads.map((pad) => (
          <div
            key={pad.id}
            onClick={() => selectPad(pad.id)}
            className={clsx(
              "px-4 py-3 cursor-pointer transition-colors flex items-center justify-between group",
              selectedId === pad.id ? "bg-telegram-accent text-white" : "hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={clsx(
                "h-12 w-12 rounded-full flex items-center justify-center font-bold flex-shrink-0",
                selectedId === pad.id ? "bg-white/20" : "bg-telegram-bubble text-telegram-accent"
              )}>
                {pad.lift}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold truncate">{pad.name}</div>
                <div className={clsx(
                  "text-xs truncate",
                  selectedId === pad.id ? "text-white/70" : "text-telegram-text-muted"
                )}>
                  {pad.L} × {pad.W} × {pad.H} متر
                </div>
              </div>
            </div>

            {pads.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePad(pad.id);
                }}
                className={clsx(
                  "p-2 rounded-lg hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all",
                  selectedId === pad.id && "text-white hover:bg-white/20"
                )}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
