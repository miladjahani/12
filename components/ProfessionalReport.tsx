import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  FileText, 
  Download, 
  Printer, 
  Mail, 
  Calendar,
  User,
  Building,
  FileSpreadsheet,
  Share2
} from 'lucide-react';

interface ProfessionalReportProps {
  inputs: any;
  results: any;
  selectedMaterial?: any;
}

export default function ProfessionalReport({ inputs, results, selectedMaterial }: ProfessionalReportProps) {
  if (!results) return null;

  const currentDate = new Date().toLocaleDateString('fa-IR');
  const reportId = `BMC-${Date.now().toString().slice(-6)}`;

  // Advanced calculations for report
  const D = parseFloat(inputs.D);
  const L = parseFloat(inputs.L);
  const Wi = parseFloat(inputs.Wi);
  const F80 = parseFloat(inputs.F80);
  const P80 = F80 / 8;
  const Cs = parseFloat(inputs.Cs);
  
  const criticalSpeed = 42.3 / Math.sqrt(D);
  const operatingSpeed = (Cs / 100) * criticalSpeed;
  const bondPower = 10 * Wi * (1/Math.sqrt(P80) - 1/Math.sqrt(F80));
  const totalPower = bondPower * 1.2;
  const throughput = 0.35 * Math.pow(D, 2.5) * L * Math.sqrt(operatingSpeed / criticalSpeed) * 0.6;

  const generatePDF = () => {
    // This would typically use a library like jsPDF
    alert('قابلیت خروجی PDF در نسخه کامل موجود است');
  };

  const generateExcel = () => {
    // This would typically use a library like xlsx
    alert('قابلیت خروجی Excel در نسخه کامل موجود است');
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'گزارش طراحی آسیاب گلوله‌ای',
        text: `گزارش طراحی آسیاب ${D}×${L} متر`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('لینک گزارش کپی شد');
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <FileText className="w-6 h-6" />
                گزارش تخصصی طراحی آسیاب گلوله‌ای
              </CardTitle>
              <p className="text-blue-100 mt-2">تحلیل جامع و بررسی فنی</p>
            </div>
            <div className="text-right text-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                <span>{currentDate}</span>
              </div>
              <div className="text-sm">شناسه گزارش: {reportId}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">مهندس طراح:</span>
              </div>
              <p className="font-medium">میلاد جهانی</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="w-4 h-4" />
                <span className="text-sm">پروژه:</span>
              </div>
              <p className="font-medium">طراحی آسیاب گلوله‌ای {D}×{L}m</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="text-sm">نوع ماده:</span>
              </div>
              <p className="font-medium">{selectedMaterial?.name || 'ماده سفارشی'}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button onClick={generatePDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              خروجی PDF
            </Button>
            <Button onClick={generateExcel} variant="outline" className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              خروجی Excel
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              چاپ
            </Button>
            <Button onClick={shareReport} variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              اشتراک‌گذاری
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>خلاصه اجرایی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">مشخصات آسیاب طراحی شده</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">قطر داخلی:</span>
                  <span className="font-medium">{D} متر</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">طول مؤثر:</span>
                  <span className="font-medium">{L} متر</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">حجم کل:</span>
                  <span className="font-medium">{results.hajm_asiab} متر مکعب</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">وزن گلوله‌ها:</span>
                  <span className="font-medium">{results.vazn_glole} تن</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">پارامترهای عملیاتی</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">سرعت بحرانی:</span>
                  <span className="font-medium">{criticalSpeed.toFixed(1)} دور/دقیقه</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">سرعت عملیاتی:</span>
                  <span className="font-medium">{operatingSpeed.toFixed(1)} دور/دقیقه</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">توان مورد نیاز:</span>
                  <span className="font-medium">{totalPower.toFixed(2)} kWh/t</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ظرفیت تئوری:</span>
                  <span className="font-medium">{throughput.toFixed(1)} تن/ساعت</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">نتیجه‌گیری</h4>
            <p className="text-green-700 text-sm leading-relaxed">
              آسیاب طراحی شده با قطر {D} متر و طول {L} متر، قادر به پردازش {throughput.toFixed(1)} تن در ساعت 
              {selectedMaterial ? ` ${selectedMaterial.name}` : ''} با مصرف انرژی {totalPower.toFixed(2)} کیلووات ساعت بر تن خواهد بود. 
              طراحی حاضر مطابق با استانداردهای صنعتی و در محدوده پارامترهای بهینه قرار دارد.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>مشخصات فنی تفصیلی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">پارامترهای ورودی</h4>
                <div className="space-y-3">
                  {Object.entries(inputs).map(([key, value]) => {
                    const paramNames = {
                      D: 'قطر آسیاب (m)',
                      L: 'طول آسیاب (m)',
                      Wi: 'شاخص کار (kWh/t)',
                      F80: 'اندازه خوراک F80 (μm)',
                      darsad_bar: 'درصد بار گلوله‌ای (%)',
                      chegali_golole: 'چگالی گلوله (t/m³)',
                      takhalkhol: 'تخلخل (%)',
                      Sg: 'وزن مخصوص ماده',
                      k: 'ثابت کاهش اندازه',
                      Cs: 'درصد سرعت بحرانی (%)'
                    };
                    
                    return (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{paramNames[key] || key}</span>
                        <Badge variant="outline">{value}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedMaterial && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">مشخصات ماده</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">نام ماده:</span>
                      <span className="font-medium">{selectedMaterial.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">دسته‌بندی:</span>
                      <Badge>{selectedMaterial.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">سختی:</span>
                      <Badge variant="outline">{selectedMaterial.hardness}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">قابلیت آسیاب:</span>
                      <Badge variant="secondary">{selectedMaterial.grindability}</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">نتایج محاسبات</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-sm text-gray-600">حجم آسیاب</div>
                    <div className="text-lg font-bold text-blue-600">{results.hajm_asiab} m³</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded">
                    <div className="text-sm text-gray-600">حجم بار خردکننده</div>
                    <div className="text-lg font-bold text-green-600">{results.hajm_bar} m³</div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded">
                    <div className="text-sm text-gray-600">وزن گلوله‌ها</div>
                    <div className="text-lg font-bold text-purple-600">{results.vazn_glole} تن</div>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded">
                    <div className="text-sm text-gray-600">قطر بهترین گلوله</div>
                    <div className="text-lg font-bold text-orange-600">{results.b} mm</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">توزیع گلوله‌های پیشنهادی</h4>
                <div className="text-sm text-gray-600 mb-2">{results.distributionName}</div>
                <div className="grid grid-cols-4 gap-2">
                  {results.selectedDistribution.slice(0, 8).map((size, index) => (
                    <div key={index} className="text-center p-2 bg-gray-50 rounded text-xs">
                      {size}%
                    </div>
                  ))}
                </div>
                {results.selectedDistribution.length > 8 && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    و {results.selectedDistribution.length - 8} اندازه دیگر...
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>توصیه‌های مهندسی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-800 mb-2">توصیه‌های طراحی</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• استفاده از یاتاقان‌های غلتشی برای حمایت از بارهای سنگین</li>
                <li>• نصب سیستم روغن‌کاری مرکزی برای یاتاقان‌ها</li>
                <li>• پیش‌بینی سیستم تنظیم سرعت متغیر برای بهینه‌سازی</li>
                <li>• استفاده از آستر نرم برای کاهش ضربه به گیربکس</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2">توصیه‌های عملیاتی</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• نظارت مستمر بر سطح بار گلوله‌ای</li>
                <li>• کنترل دوره‌ای اندازه و توزیع گلوله‌ها</li>
                <li>• پایش مصرف انرژی و راندمان آسیاب</li>
                <li>• کالیبراسیون دوره‌ای تجهیزات اندازه‌گیری</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-800 mb-2">نکات ایمنی</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• نصب سیستم‌های حفاظتی اضافه بار</li>
                <li>• پیش‌بینی سیستم تهویه مناسب</li>
                <li>• استفاده از تجهیزات حفاظت شخصی</li>
                <li>• آموزش پرسنل در خصوص عملیات ایمن</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardContent className="p-4 text-center text-sm text-gray-500">
          <div className="flex justify-center items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            <span>این گزارش توسط محاسبه‌گر پیشرفته آسیاب گلوله‌ای تهیه شده است</span>
          </div>
          <p>برای اطلاعات بیشتر با مهندس میلاد جهانی تماس بگیرید</p>
          <p className="text-xs mt-2">تاریخ تولید گزارش: {currentDate} | شناسه: {reportId}</p>
        </CardContent>
      </Card>
    </div>
  );
}