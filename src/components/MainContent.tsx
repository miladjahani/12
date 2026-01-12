import { usePads } from '../context/PadsContext';
import { calculatePadResults } from '../utils/calculations';
import { Terrain } from '../types';

const MainContent = () => {
  const { pads, selectedPadId } = usePads();

  // Mock terrain data for now
  const terrain: Terrain = { sx: -2, sy: 1 };

  const selectedPad = pads.find(p => p.id === selectedPadId);
  const results = selectedPad ? calculatePadResults(selectedPad, terrain, pads) : null;

  const formatNumber = (num: number, digits = 0) => {
    return new Intl.NumberFormat('fa-IR', {
      maximumFractionDigits: digits
    }).format(num);
  }

  if (!selectedPad || !results) {
    return (
      <main className="flex-1 bg-[#0e1621] p-6 flex items-center justify-center">
        <p className="text-gray-400">یک پد را برای مشاهده نتایج انتخاب کنید.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#0e1621]/80 backdrop-blur-sm p-6 overflow-y-auto">
      <h1 data-testid="main-content-header" className="text-white text-xl font-bold mb-6">گزارش پد: {selectedPad.name}</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#17212b] p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">مس قابل استحصال</p>
          <p className="text-cyan-400 text-2xl font-bold">{formatNumber(results.recoverableCu, 2)} <span className="text-sm">تن</span></p>
        </div>
        <div className="bg-[#17212b] p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">حجم خاک‌ریزی</p>
          <p className="text-white text-2xl font-bold">{formatNumber(results.volume)} <span className="text-sm">متر مکعب</span></p>
        </div>
        <div className="bg-[#17212b] p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">مصرف اسید</p>
          <p className="text-red-400 text-2xl font-bold">{formatNumber(results.acidConsumption)} <span className="text-sm">تن</span></p>
        </div>
        <div className="bg-[#17212b] p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm">دبی کل آبیاری</p>
          <p className="text-blue-400 text-2xl font-bold">{formatNumber(results.totalFlowM3h, 2)} <span className="text-sm">متر مکعب/ساعت</span></p>
        </div>
      </div>

      {/* Results table */}
      <div className="bg-[#17212b] rounded-lg p-4">
        {/* Table content will go here */}
        <p className="text-gray-300">جزئیات بیشتر به زودی...</p>
      </div>
    </main>
  );
};

export default MainContent;
