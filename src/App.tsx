import { useState, useMemo, useCallback } from "react";
import { SidebarLayout } from "./components/SidebarLayout";
import { ProjectForm } from "./components/ProjectForm";
import { MetricCard, DashboardGrid } from "./components/DashboardMetrics";
import { AIRiskAdvisory } from "./components/AIRiskAdvisory";
import { SensitivityTable } from "./components/SensitivityTable";
import {
  DollarSign,
  Percent,
  Clock,
  Activity,
  ShieldCheck,
  FileDown,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  calculateNPV,
  calculateIRR,
  calculatePaybackPeriod,
  calculateSensitivityMatrix
} from "./utils/financialMath";
import { generatePDFReport } from "./utils/pdfGenerator";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projectData, setProjectData] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [riskMultiplier, setRiskMultiplier] = useState(1.0);
  const [riskJustification, setRiskJustification] = useState("");

  const calculateFinancials = useCallback((data: any, rm: number) => {
    if (!data) return null;

    const lifespan = parseInt(data.lifespan) || 5;
    const domesticCapex = parseFloat(data.domesticCapex) || 0;
    const foreignCapex = parseFloat(data.foreignCapex) || 0;
    const baseFX = parseFloat(data.baseExchangeRate) || 600000;
    const inflation = (parseFloat(data.inflationRate) || 0) / 100;
    const discount = (parseFloat(data.discountRate) || 0) / 100;
    
    // Metallurgical and Operational calculations
    const dailyTonnage = parseFloat(data.dailyTonnage) || 5000;
    const oreGrade = parseFloat(data.oreGrade) || 0.45;
    const targetRecovery = parseFloat(data.targetRecovery) || 65;
    
    // Calculate total copper content processed per year
    const totalTonnageYear = dailyTonnage * 365;
    const processedCopperMetal = totalTonnageYear * (oreGrade / 100) * (targetRecovery / 100);
    
    const totalCapex = domesticCapex + (foreignCapex * baseFX);
    
    const laborCost = parseFloat(data.laborCost) || 0;
    const energyCost = parseFloat(data.energyCost) || 0;
    const domesticParts = parseFloat(data.domesticParts) || 0;
    const foreignParts = parseFloat(data.foreignParts) || 0;
    
    // Assumed selling price of Copper: $9,000/ton
    const copperPriceUSD = 9000;
    const copperPriceRial = copperPriceUSD * baseFX;
    const yearlyRevenue = processedCopperMetal * copperPriceRial;
    
    const baseYearlyOpex = laborCost + energyCost + domesticParts + (foreignParts * baseFX);
    const riskAdjustedOpex = baseYearlyOpex * rm;

    const cashFlows = [-totalCapex];
    const discountRates = [0];

    for (let i = 1; i <= lifespan; i++) {
      const inflationFactor = Math.pow(1 + inflation, i);
      const netCashFlow = (yearlyRevenue - riskAdjustedOpex) * inflationFactor;
      cashFlows.push(netCashFlow);
      discountRates.push(discount);
    }

    const npv = calculateNPV(cashFlows, discountRates);
    const irr = calculateIRR(cashFlows);
    const payback = calculatePaybackPeriod(cashFlows);
    
    const getNPVWithParams = (fx: number, energyShift: number) => {
      const tempCapex = domesticCapex + (foreignCapex * fx);
      const tempRevenue = processedCopperMetal * (copperPriceUSD * fx);
      const tempOpex = (laborCost + (energyCost * energyShift) + domesticParts + (foreignParts * fx)) * rm;

      const tempCashFlows = [-tempCapex];
      for (let i = 1; i <= lifespan; i++) {
        const inflationFactor = Math.pow(1 + inflation, i);
        tempCashFlows.push((tempRevenue - tempOpex) * inflationFactor);
      }
      return calculateNPV(tempCashFlows, discountRates);
    };

    const sensitivity = calculateSensitivityMatrix(npv, baseFX, 1, getNPVWithParams);

    return {
      npv,
      irr: irr || 0,
      payback: payback || 0,
      totalCapex,
      sensitivity,
      processedCopperMetal,
      yearlyRevenue,
      riskAdjustedOpex
    };
  }, []);

  const handleProjectSubmit = (data: any) => {
    setProjectData(data);
    const results = calculateFinancials(data, riskMultiplier);
    setAnalysisResults(results);
    setActiveTab("dashboard");
  };

  const handleRiskApplied = (multiplier: number, justification: string) => {
    setRiskMultiplier(multiplier);
    setRiskJustification(justification);
    if (projectData) {
      const results = calculateFinancials(projectData, multiplier);
      setAnalysisResults(results);
    }
  };

  const handleExportPDF = () => {
    if (!analysisResults || !projectData) return;

    generatePDFReport({
      projectName: projectData.projectName,
      npv: analysisResults.npv,
      irr: analysisResults.irr,
      payback: analysisResults.payback,
      riskAdjustedNPV: analysisResults.npv,
      sensitivityData: analysisResults.sensitivity,
      aiRisk: {
        riskMultiplier,
        justification: riskJustification || "تحلیل هوشمند ریسک بر اساس داده‌های ورودی انجام شده است."
      },
      projectData
    });
  };

  return (
    <SidebarLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-8 animate-in fade-in duration-700">

        {activeTab === 'dashboard' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">داشبورد وضعیت پروژه</h1>
                <p className="text-slate-500 mt-2">خلاصه شاخص‌های مالی و ارزیابی ریسک سرمایه‌گذاری</p>
              </div>
              {analysisResults && (
                <Button onClick={handleExportPDF} className="bg-slate-900 text-white hover:bg-slate-800 gap-2">
                  <FileDown className="w-4 h-4" />
                  دریافت گزارش رسمی PDF
                </Button>
              )}
            </div>

            {!analysisResults ? (
              <Alert className="bg-indigo-50 border-indigo-200">
                <Info className="h-4 w-4 text-indigo-600" />
                <AlertTitle className="text-indigo-800 font-bold">اطلاعاتی یافت نشد</AlertTitle>
                <AlertDescription className="text-indigo-700">
                  برای مشاهده تحلیل‌ها، ابتدا باید از طریق منوی "ثبت پروژه جدید"، اطلاعات فنی و اقتصادی را وارد نمایید.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {riskMultiplier !== 1.0 && (
                  <Alert className="bg-amber-50 border-amber-200 animate-bounce">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 font-bold">ریسک کیفی اعمال شد</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      محاسبات با ضریب ریسک {riskMultiplier}x تعدیل شده‌اند.
                      <br/>
                      <span className="text-xs">{riskJustification}</span>
                    </AlertDescription>
                  </Alert>
                )}
                <DashboardGrid>
                  <MetricCard
                    title="ارزش فعلی خالص (NPV)"
                    value={Math.round(analysisResults.npv).toLocaleString()}
                    unit="ریال"
                    icon={DollarSign}
                    trend={analysisResults.npv > 0 ? 'up' : 'down'}
                    description="ارزش فعلی جریانات نقدی با احتساب نرخ تنزیل"
                    color="indigo"
                  />
                  <MetricCard
                    title="نرخ بازده داخلی (IRR)"
                    value={(analysisResults.irr * 100).toFixed(2)}
                    unit="درصد"
                    icon={Percent}
                    trend={analysisResults.irr > 0.3 ? 'up' : 'neutral'}
                    description="نرخی که در آن NPV پروژه صفر می‌شود"
                    color="emerald"
                  />
                  <MetricCard
                    title="دوره بازگشت سرمایه"
                    value={analysisResults.payback.toFixed(2)}
                    unit="سال"
                    icon={Clock}
                    description="زمان لازم برای جبران سرمایه‌گذاری اولیه"
                    color="amber"
                  />
                  <MetricCard
                    title="سرمایه کل مورد نیاز"
                    value={Math.round(analysisResults.totalCapex).toLocaleString()}
                    unit="ریال"
                    icon={Activity}
                    description="مجموع هزینه‌های ریالی و ارزی در نرخ پایه"
                    color="slate"
                  />
                </DashboardGrid>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <SensitivityTable data={analysisResults.sensitivity} />
                    <Card>
                      <CardHeader>
                        <CardTitle>توصیه‌های فنی و استراتژیک</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                            <div className="p-1 bg-emerald-100 text-emerald-600 rounded-full mt-1">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {analysisResults.irr > 0.35
                                ? "با توجه به IRR بالا، اجرای پروژه حتی در شرایط تورمی فعلی پیشنهاد می‌شود."
                                : "نرخ بازده پروژه به مرز هزینه فرصت سرمایه نزدیک است؛ بهینه‌سازی OPEX توصیه می‌گردد."}
                            </p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="p-1 bg-blue-100 text-blue-600 rounded-full mt-1">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              تناژ سالانه مس استخراجی تولید شده برابر با <strong className="text-blue-600">{Math.round(analysisResults.processedCopperMetal).toLocaleString()} تن</strong> پیش‌بینی می‌شود.
                            </p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="p-1 bg-amber-100 text-amber-600 rounded-full mt-1">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              استفاده از مکانیزم‌های تثبیت نرخ ارز برای تأمین قطعات ارزی پروژه الزامی است.
                            </p>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="lg:col-span-1">
                    <AIRiskAdvisory onRiskApplied={handleRiskApplied} />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'project-input' && (
          <ProjectForm onSubmit={handleProjectSubmit} />
        )}

        {activeTab === 'risk' && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">مرکز تحلیل ریسک‌های کیفی</h1>
            <AIRiskAdvisory onRiskApplied={handleRiskApplied} />
          </div>
        )}

        {activeTab === 'analysis' && analysisResults && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">تحلیل حساسیت عمیق</h1>
            <SensitivityTable data={analysisResults.sensitivity} />
          </div>
        )}

        {activeTab === 'reports' && (
           <div className="text-center py-20">
              <FileDown className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-700">بخش گزارش‌های آرشیو شده</h2>
              <p className="text-slate-500 mt-2">این بخش در نسخه‌های بعدی فعال خواهد شد.</p>
           </div>
        )}
      </div>
    </SidebarLayout>
  );
}

export default App;
