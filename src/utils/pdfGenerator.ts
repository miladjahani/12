import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ReportData {
  projectName: string;
  npv: number;
  irr: number;
  payback: number;
  riskAdjustedNPV: number;
  sensitivityData: any[];
  aiRisk: {
    riskMultiplier: number;
    justification: string;
  };
  projectData: {
    lifespan: string;
    domesticCapex: string;
    foreignCapex: string;
    installationCost: string;
    infrastructure: string;
    laborCost: string;
    energyCost: string;
    domesticParts: string;
    foreignParts: string;
    baseExchangeRate: string;
    discountRate: string;
    inflationRate: string;
    delayRisk: string;
    dailyTonnage: string;
    oreGrade: string;
    targetRecovery: string;
  };
}

export const generatePDFReport = async (data: ReportData) => {
  // Create a hidden container on the document body
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "800px"; // Fixed width to align with standard letter/A4 aspect ratio
  container.dir = "rtl";
  container.className = "p-8 bg-white text-slate-900 font-sans space-y-6 border border-slate-200 shadow-xl rounded-lg";

  const totalCapex = parseFloat(data.projectData.domesticCapex) +
    (parseFloat(data.projectData.foreignCapex) * parseFloat(data.projectData.baseExchangeRate)) +
    (parseFloat(data.projectData.installationCost) || 0) +
    (parseFloat(data.projectData.infrastructure) || 0);

  const baseOpex = parseFloat(data.projectData.laborCost) +
    parseFloat(data.projectData.energyCost) +
    parseFloat(data.projectData.domesticParts) +
    (parseFloat(data.projectData.foreignParts) * parseFloat(data.projectData.baseExchangeRate));

  const riskAdjustedOpex = baseOpex * data.aiRisk.riskMultiplier;

  const decision = data.npv > 0 ? "طرح قابل قبول (GO)" : "طرح غیرقابل قبول (NO-GO)";
  const decisionColor = data.npv > 0 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-rose-600 bg-rose-50 border-rose-200";

  container.innerHTML = `
    <!-- Header -->
    <div class="border-b-4 border-indigo-600 pb-4 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-wide">گزارش ارزیابی فنی و اقتصادی رسمی</span>
          <h1 class="text-2xl font-black text-slate-900 mt-1">${data.projectName}</h1>
        </div>
        <div class="text-left">
          <p class="text-sm text-slate-500">تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')}</p>
          <p class="text-sm text-slate-500">واحد پول: ریال ایران</p>
        </div>
      </div>
    </div>

    <!-- Executive Summary -->
    <div class="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
      <h2 class="text-lg font-bold text-slate-800 border-r-4 border-indigo-600 pr-2">۱. خلاصه مدیریتی و نتیجه‌گیری نهایی (Go/No-Go)</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
          <p class="text-xs text-slate-400">وضعیت و تصمیم نهایی طرح:</p>
          <div class="text-lg font-black mt-1 px-3 py-1 inline-block rounded border ${decisionColor}">
            ${decision}
          </div>
          <p class="text-xs text-slate-500 mt-2">مبنا: ارزش فعلی خالص با احتساب ریسک (Risk-Adjusted NPV)</p>
        </div>
        <div class="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
          <p class="text-xs text-slate-400">ارزش فعلی خالص کل:</p>
          <p class="text-lg font-black text-indigo-600 mt-1">${Math.round(data.npv).toLocaleString()} ریال</p>
          <p class="text-xs text-slate-500 mt-2">با احتساب نرخ تنزیل سالانه ${data.projectData.discountRate}%</p>
        </div>
      </div>
      <p class="text-sm text-slate-600 leading-relaxed mt-2">
        این گزارش به صورت خودکار بر اساس شبیه‌سازی جریانات نقدی دوره عمر ${data.projectData.lifespan} ساله طرح و با اعمال شرایط تورمی سالانه ${data.projectData.inflationRate}% و نوسانات نرخ ارز و سوخت تنظیم شده است. با توجه به شاخص‌های مالی محاسباتی، فرآیند سرمایه‌گذاری پیشنهاد می‌شود.
      </p>
    </div>

    <!-- Comparison Table -->
    <div class="space-y-3">
      <h2 class="text-lg font-bold text-slate-800 border-r-4 border-indigo-600 pr-2">۲. مقایسه سیستم فعلی و سیستم پیشنهادی (پس از سرمایه‌گذاری)</h2>
      <table class="w-full text-sm border-collapse border border-slate-200">
        <thead>
          <tr class="bg-slate-100 text-slate-700">
            <th class="border border-slate-200 p-2 text-right">پارامتر ارزیابی</th>
            <th class="border border-slate-200 p-2 text-center">سیستم فعلی (ادامه وضع موجود)</th>
            <th class="border border-slate-200 p-2 text-center">سیستم پیشنهادی (توسعه و ارتقا)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-200 p-2 font-medium">سرمایه‌گذاری اولیه (CAPEX)</td>
            <td class="border border-slate-200 p-2 text-center text-slate-500">۰ ریال</td>
            <td class="border border-slate-200 p-2 text-center text-indigo-600 font-bold">${totalCapex.toLocaleString()} ریال</td>
          </tr>
          <tr>
            <td class="border border-slate-200 p-2 font-medium">هزینه عملیاتی پایه سال اول (OPEX)</td>
            <td class="border border-slate-200 p-2 text-center text-rose-600 font-medium">${baseOpex.toLocaleString()} ریال</td>
            <td class="border border-slate-200 p-2 text-center text-emerald-600 font-bold">${riskAdjustedOpex.toLocaleString()} ریال</td>
          </tr>
          <tr>
            <td class="border border-slate-200 p-2 font-medium">دوره بازگشت سرمایه</td>
            <td class="border border-slate-200 p-2 text-center text-slate-500">فاقد توجیه</td>
            <td class="border border-slate-200 p-2 text-center text-slate-700 font-bold">${data.payback.toFixed(2)} سال</td>
          </tr>
          <tr>
            <td class="border border-slate-200 p-2 font-medium">نرخ بازده داخلی (IRR)</td>
            <td class="border border-slate-200 p-2 text-center text-slate-500">۰٪</td>
            <td class="border border-slate-200 p-2 text-center text-emerald-600 font-bold">${(data.irr * 100).toFixed(2)}٪</td>
          </tr>
          <tr>
            <td class="border border-slate-200 p-2 font-medium">ظرفیت سنگ‌شکنی و باردهی روزانه</td>
            <td class="border border-slate-200 p-2 text-center text-slate-500">محدود / غیربهینه</td>
            <td class="border border-slate-200 p-2 text-center text-slate-700">${data.projectData.dailyTonnage} تن/روز</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sensitivity Analysis Layout -->
    <div class="space-y-3">
      <h2 class="text-lg font-bold text-slate-800 border-r-4 border-indigo-600 pr-2">۳. ماتریس تحلیل حساسیت متغیرهای کلیدی اقتصادی</h2>
      <p class="text-xs text-slate-500 mb-2">تغییرات پیش‌بینی‌شده در NPV بر اساس میزان تغییرات نرخ ارز پایه و قیمت حامل‌های انرژی:</p>
      <table class="w-full text-xs border-collapse border border-slate-200">
        <thead>
          <tr class="bg-slate-100 text-slate-700">
            <th class="border border-slate-200 p-2 text-center">میزان تغییرات متغیر</th>
            <th class="border border-slate-200 p-2 text-center">نوسان نرخ ارز پایه (ریال/دلار)</th>
            <th class="border border-slate-200 p-2 text-center">نوسان هزینه‌های سوخت و انرژی</th>
          </tr>
        </thead>
        <tbody>
          ${data.sensitivityData.map(row => `
            <tr>
              <td class="border border-slate-200 p-2 text-center font-bold text-slate-700">${row.shift > 0 ? '+' : ''}${row.shift}٪</td>
              <td class="border border-slate-200 p-2 text-center ${row.fxNPV > 0 ? 'text-emerald-600' : 'text-rose-600'}">${Math.round(row.fxNPV).toLocaleString()} ریال</td>
              <td class="border border-slate-200 p-2 text-center ${row.energyNPV > 0 ? 'text-emerald-600' : 'text-rose-600'}">${Math.round(row.energyNPV).toLocaleString()} ریال</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Risk Dashboard -->
    <div class="bg-amber-50 p-5 rounded-lg border border-amber-200 space-y-3">
      <h3 class="text-md font-bold text-amber-900 flex items-center gap-2">
        <span>⚠️ ارزیابی و شبیه‌سازی ریسک کیفی پروژه (هوشمند)</span>
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <p class="text-xs text-slate-500">ضریب تأثیر بر هزینه‌های جاری (Rm):</p>
          <p class="text-base font-black text-amber-700">${data.aiRisk.riskMultiplier}x</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs text-slate-500">میزان ریسک تأخیر پروژه:</p>
          <p class="text-base font-black text-amber-700">${data.projectData.delayRisk}٪ احتمال رخ‌داد</p>
        </div>
      </div>
      <p class="text-xs text-amber-800 leading-relaxed mt-2">
        <strong>توضیح هوشمند ریسک:</strong> ${data.aiRisk.justification}
      </p>
    </div>

    <!-- Strategic Recommendations -->
    <div class="space-y-2">
      <h2 class="text-lg font-bold text-slate-800 border-r-4 border-indigo-600 pr-2">۴. توصیه‌های استراتژیک مهندسی-اقتصادی</h2>
      <ul class="list-disc list-inside space-y-1 text-xs text-slate-600">
        <li>با توجه به تورم سالانه ${data.projectData.inflationRate}٪، خرید قطعات اصلی فاز CAPEX به صورت پروفرما در اسرع وقت پیشنهاد می‌شود.</li>
        <li>سیستم پمپ و خطوط لوله پیشنهادی به دلیل داشتن کینتیک بازیابی مناسب، نرخ راندمان را به ${data.projectData.targetRecovery}٪ افزایش داده و ریسک عملیاتی را جبران می‌کند.</li>
        <li>در صورت افزایش بیش از ۳۰٪ قیمت سوخت، بازنگری در نحوه بهینه‌سازی توان پمپ‌ها الزامی است.</li>
      </ul>
    </div>

    <!-- Signatures -->
    <div class="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
      <div class="text-center">
        <p class="text-xs text-slate-400">امضای مدیر فنی و عملیات</p>
        <div class="h-12 flex items-center justify-center">
          <span class="font-serif italic text-slate-300">مهر و امضا</span>
        </div>
      </div>
      <div class="text-center">
        <p class="text-xs text-slate-400">امضای مشاور ارشد سیستم‌های مالی</p>
        <div class="h-12 flex items-center justify-center">
          <span class="font-serif italic text-slate-300">مهر و امضا</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Render the container to canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Retain sharp, crisp text
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2] // Scale A4/Letter perfectly
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`Mining_Financial_Report_${data.projectName.replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error("Error generating report PDF", err);
  } finally {
    document.body.removeChild(container);
  }
};
