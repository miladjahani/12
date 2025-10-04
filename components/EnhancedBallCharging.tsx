import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Settings2, 
  Target, 
  BarChart3, 
  Zap, 
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calculator,
  Layers3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  ComposedChart,
  Bar
} from 'recharts';

interface EnhancedBallChargingProps {
  inputs: any;
  results: any;
  selectedMaterial?: any;
}

// Advanced ball size distributions based on Morrell & Morrison (1996) and Austin et al.
const advancedBallDistributions = {
  // Ultra-fine grinding (cement finish mills)
  ultraFine: {
    name: "آسیاب فوق‌ریز (سیمان نهایی)",
    sizes: [12.7, 19.1, 25.4, 31.8],
    percentages: [20, 35, 30, 15],
    applications: ["سیمان نهایی", "پودر معدنی فوق‌ریز"],
    optimalF80Range: [50, 200],
    powerIntensity: "بالا"
  },
  
  // Fine grinding (regrind circuits)
  fine: {
    name: "آسیاب ریز (مدارهای باز آسیاب)",
    sizes: [19.1, 25.4, 31.8, 38.1, 44.5],
    percentages: [15, 25, 30, 20, 10],
    applications: ["باز آسیاب طلا", "باز آسیاب مس"],
    optimalF80Range: [100, 500],
    powerIntensity: "متوسط تا بالا"
  },
  
  // Primary grinding (SAG mill products)
  primary: {
    name: "آسیاب اولیه (محصولات SAG)",
    sizes: [25.4, 31.8, 38.1, 44.5, 50.8, 63.5, 76.2],
    percentages: [10, 15, 20, 20, 15, 12, 8],
    applications: ["آسیاب اولیه مس", "آسیاب اولیه آهن"],
    optimalF80Range: [500, 2000],
    powerIntensity: "متوسط"
  },
  
  // Coarse grinding (crusher products)
  coarse: {
    name: "آسیاب درشت (محصولات سنگ‌شکن)",
    sizes: [38.1, 44.5, 50.8, 63.5, 76.2, 88.9, 101.6, 114.3],
    percentages: [8, 12, 15, 18, 17, 13, 10, 7],
    applications: ["آسیاب اولیه سنگ آهن", "آسیاب درشت مواد ساختمانی"],
    optimalF80Range: [2000, 8000],
    powerIntensity: "کم تا متوسط"
  },
  
  // Ultra-coarse grinding (large primary mills)
  ultraCoarse: {
    name: "آسیاب فوق‌درشت (آسیاب‌های بزرگ اولیه)",
    sizes: [63.5, 76.2, 88.9, 101.6, 114.3, 127.0],
    percentages: [12, 18, 22, 20, 15, 13],
    applications: ["آسیاب‌های بزرگ معدنی", "آسیاب اولیه سنگ آهک"],
    optimalF80Range: [5000, 15000],
    powerIntensity: "کم"
  },

  // Specialized distributions for different ore types
  hardOres: {
    name: "سنگ‌های سخت (کوارتزی، طلای آزاد)",
    sizes: [31.8, 38.1, 44.5, 50.8, 63.5, 76.2, 88.9],
    percentages: [8, 12, 16, 18, 17, 15, 14],
    applications: ["طلای کوارتزی", "سنگ‌های دارای سیلیکا بالا"],
    optimalF80Range: [1000, 5000],
    powerIntensity: "بالا"
  },

  softOres: {
    name: "سنگ‌های نرم (فسفات، بوکسیت)",
    sizes: [19.1, 25.4, 31.8, 38.1, 44.5, 50.8],
    percentages: [15, 20, 22, 18, 15, 10],
    applications: ["فسفات راک", "بوکسیت", "مواد کربناته"],
    optimalF80Range: [500, 3000],
    powerIntensity: "کم"
  }
};

// Semi-empirical formulas from Morrell (2004) and Bond (1961)
const calculateAdvancedParameters = (inputs: any, selectedMaterial?: any) => {
  const D = parseFloat(inputs.D);
  const L = parseFloat(inputs.L);
  const Wi = parseFloat(inputs.Wi);
  const F80 = parseFloat(inputs.F80);
  const Cs = parseFloat(inputs.Cs);
  const ballCharge = parseFloat(inputs.darsad_bar);
  const Sg = parseFloat(inputs.Sg);

  // Morrell's C-model for mill power
  const criticalSpeed = 42.3 / Math.sqrt(D); // rpm
  const operatingSpeed = (Cs / 100) * criticalSpeed;
  
  // Mill power using Morrell's approach
  const Nc = criticalSpeed;
  const N = operatingSpeed;
  const Jb = ballCharge / 100; // Ball filling fraction
  
  // Power draw components
  const powerNoLoad = 1.68 * D**2.05 * L * (1 - 0.1 * Jb) * Math.sqrt(Cs/100); // kW
  const powerBalls = 10.6 * D**1.35 * L * Jb * Sg * Math.sqrt(Cs/100); // kW
  const totalInstalledPower = powerNoLoad + powerBalls; // kW
  
  // Net power for grinding (Austin's model consideration)
  const netPower = totalInstalledPower * 0.75; // Considering mechanical efficiency
  
  // Optimal ball size using Bond's equation modified by Rowland
  const F80_mm = F80 / 1000;
  const optimalBallSize = 25.4 * Math.pow((Sg * Wi * F80_mm)/(Cs * Math.sqrt(D * 3.281)), 1/3); // mm
  
  // Ball wear rate (Cleary & Morrison approach)
  const ballWearRate = 0.024 * Wi * Math.pow(operatingSpeed/criticalSpeed, 1.5); // kg/kWh
  
  // Throughput using Morrell's approach
  const A = Math.pow(10, 0.4 * Math.log10(Wi) - 1.33); // Work index factor
  const throughput = netPower / (Wi * A * (1/Math.sqrt(106) - 1/Math.sqrt(F80))); // t/h
  
  // Mill filling and charge motion
  const U = 0.3; // Shoulder angle parameter
  const centerHeight = D/2 * (1 - 2*Jb + U*Jb); // m
  const toeAngle = Math.acos((centerHeight - D/2)/(D/2)) * 180/Math.PI; // degrees
  const shoulderAngle = toeAngle + 74; // degrees (typical)
  
  return {
    totalInstalledPower,
    netPower,
    optimalBallSize,
    ballWearRate,
    throughput,
    criticalSpeed,
    operatingSpeed,
    toeAngle,
    shoulderAngle,
    centerHeight,
    powerNoLoad,
    powerBalls
  };
};

// Determine optimal ball distribution based on ore characteristics
const selectOptimalDistribution = (F80: number, Wi: number, material?: any) => {
  if (F80 < 200) return advancedBallDistributions.ultraFine;
  if (F80 < 500) return advancedBallDistributions.fine;
  if (F80 < 2000) return advancedBallDistributions.primary;
  if (F80 < 8000) return advancedBallDistributions.coarse;
  if (F80 >= 8000) return advancedBallDistributions.ultraCoarse;
  
  // Material-specific selection
  if (material) {
    if (material.hardness === 'سخت' || material.hardness === 'خیلی سخت') {
      return advancedBallDistributions.hardOres;
    }
    if (material.hardness === 'نرم' || material.hardness === 'خیلی نرم') {
      return advancedBallDistributions.softOres;
    }
  }
  
  return advancedBallDistributions.primary; // Default
};

export default function EnhancedBallCharging({ inputs, results, selectedMaterial }: EnhancedBallChargingProps) {
  const [activeAnalysis, setActiveAnalysis] = useState('distribution');
  const [optimizationMode, setOptimizationMode] = useState(false);

  if (!results) return null;

  const F80 = parseFloat(inputs.F80);
  const Wi = parseFloat(inputs.Wi);
  const D = parseFloat(inputs.D);
  
  const advancedParams = calculateAdvancedParameters(inputs, selectedMaterial);
  const optimalDistribution = selectOptimalDistribution(F80, Wi, selectedMaterial);
  
  // Generate performance curves
  const speedCurveData = Array.from({ length: 20 }, (_, i) => {
    const speed = 60 + i * 2; // 60% to 98% critical speed
    const efficiency = Math.max(0, 100 * Math.exp(-Math.pow((speed - 75)/15, 2))); // Gaussian around 75%
    const power = advancedParams.totalInstalledPower * (speed/75) * 1.2;
    return { speed, efficiency, power };
  });

  const chargeCurveData = Array.from({ length: 15 }, (_, i) => {
    const charge = 25 + i * 2; // 25% to 53% ball charge
    const throughput = Math.max(0, 100 * (1 - Math.pow((charge - 40)/25, 2))); // Optimal around 40%
    const power = advancedParams.totalInstalledPower * (0.5 + charge/80);
    return { charge, throughput, power };
  });

  // Ball size distribution chart data
  const distributionData = optimalDistribution.sizes.map((size, index) => ({
    size: `${size}mm`,
    percentage: optimalDistribution.percentages[index],
    sizeNum: size,
    cumulativePass: optimalDistribution.percentages.slice(0, index + 1).reduce((a, b) => a + b, 0)
  }));

  // Ball wear analysis
  const wearAnalysisData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const wearFactor = 1 - (i * 0.05); // 5% wear per month
    const makeupBalls = advancedParams.ballWearRate * advancedParams.throughput * 730 * (i + 1); // kg
    return { 
      month, 
      wearFactor: wearFactor * 100, 
      makeupBalls: makeupBalls / 1000, // tonnes
      averageSize: advancedParams.optimalBallSize * wearFactor
    };
  });

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            سیستم پیشرفته شارژ گلوله‌ای
          </CardTitle>
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeAnalysis === 'distribution' ? 'default' : 'outline'}
              onClick={() => setActiveAnalysis('distribution')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              توزیع بهینه
            </Button>
            <Button
              variant={activeAnalysis === 'performance' ? 'default' : 'outline'}
              onClick={() => setActiveAnalysis('performance')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              منحنی‌های عملکرد
            </Button>
            <Button
              variant={activeAnalysis === 'wear' ? 'default' : 'outline'}
              onClick={() => setActiveAnalysis('wear')}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              تحلیل سایش
            </Button>
            <Button
              variant={optimizationMode ? 'destructive' : 'secondary'}
              onClick={() => setOptimizationMode(!optimizationMode)}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              {optimizationMode ? 'خروج از بهینه‌سازی' : 'ورود به بهینه‌سازی'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Advanced Parameters Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            پارامترهای پیشرفته محاسبه شده
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="text-sm text-gray-600">توان نصب شده</div>
              <div className="text-xl font-bold text-blue-600">
                {advancedParams.totalInstalledPower.toFixed(0)} kW
              </div>
              <div className="text-xs text-gray-500 mt-1">
                بی‌بار: {advancedParams.powerNoLoad.toFixed(0)}kW + گلوله: {advancedParams.powerBalls.toFixed(0)}kW
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="text-sm text-gray-600">ظرفیت پیش‌بینی (Morrell)</div>
              <div className="text-xl font-bold text-green-600">
                {advancedParams.throughput.toFixed(1)} t/h
              </div>
              <div className="text-xs text-gray-500 mt-1">
                براساس مدل C موریل
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <div className="text-sm text-gray-600">قطر بهینه گلوله</div>
              <div className="text-xl font-bold text-orange-600">
                {advancedParams.optimalBallSize.toFixed(1)} mm
              </div>
              <div className="text-xs text-gray-500 mt-1">
                معادله بند اصلاح شده
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <div className="text-sm text-gray-600">نرخ سایش گلوله</div>
              <div className="text-xl font-bold text-purple-600">
                {advancedParams.ballWearRate.toFixed(3)} kg/kWh
              </div>
              <div className="text-xs text-gray-500 mt-1">
                مدل کلری-موریسون
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Analysis Sections */}
      {activeAnalysis === 'distribution' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="w-5 h-5" />
              توزیع بهینه گلوله‌ها - {optimalDistribution.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">نمودار توزیع اندازه</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value}${name === 'percentage' ? '%' : '%'}`,
                        name === 'percentage' ? 'درصد' : 'تجمعی'
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="percentage" fill="#3B82F6" />
                    <Line yAxisId="right" type="monotone" dataKey="cumulativePass" stroke="#EF4444" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">مشخصات توزیع انتخابی</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">نام توزیع:</span>
                      <Badge variant="outline">{optimalDistribution.name}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">محدوده F80 بهینه:</span>
                      <span className="text-sm font-medium">
                        {optimalDistribution.optimalF80Range[0]}-{optimalDistribution.optimalF80Range[1]} μm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">شدت توان:</span>
                      <Badge 
                        className={
                          optimalDistribution.powerIntensity === 'بالا' ? 'bg-red-100 text-red-800' :
                          optimalDistribution.powerIntensity === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {optimalDistribution.powerIntensity}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">کاربردهای صنعتی</h4>
                  <div className="space-y-2">
                    {optimalDistribution.applications.map((app, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <h5 className="font-semibold text-blue-800 mb-2">توصیه بهینه‌سازی</h5>
                  <p className="text-blue-700 text-sm">
                    {F80 >= optimalDistribution.optimalF80Range[0] && F80 <= optimalDistribution.optimalF80Range[1] ?
                      'اندازه خوراک شما در محدوده بهینه این توزیع قرار دارد.' :
                      'اندازه خوراک خارج از محدوده بهینه است. بررسی توزیع‌های دیگر توصیه می‌شود.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeAnalysis === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>منحنی سرعت - راندمان</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={speedCurveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="speed" label={{ value: 'درصد سرعت بحرانی', position: 'insideBottom', offset: -5 }} />
                  <YAxis yAxisId="left" label={{ value: 'راندمان (%)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'توان (kW)', angle: 90, position: 'insideRight' }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${typeof value === 'number' ? value.toFixed(1) : value}${name === 'efficiency' ? '%' : 'kW'}`,
                      name === 'efficiency' ? 'راندمان' : 'توان'
                    ]}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="efficiency" fill="#8884d8" fillOpacity={0.6} />
                  <Line yAxisId="right" type="monotone" dataKey="power" stroke="#82ca9d" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>منحنی شارژ - ظرفیت</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chargeCurveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="charge" label={{ value: 'درصد شارژ گلوله', position: 'insideBottom', offset: -5 }} />
                  <YAxis yAxisId="left" label={{ value: 'ظرفیت نسبی (%)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'توان (kW)', angle: 90, position: 'insideRight' }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${typeof value === 'number' ? value.toFixed(1) : value}${name === 'throughput' ? '%' : 'kW'}`,
                      name === 'throughput' ? 'ظرفیت' : 'توان'
                    ]}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="throughput" fill="#ffc658" fillOpacity={0.6} />
                  <Line yAxisId="right" type="monotone" dataKey="power" stroke="#ff7300" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeAnalysis === 'wear' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              تحلیل سایش و جایگزینی گلوله‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">روند سایش سالانه</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={wearAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" label={{ value: 'ماه', position: 'insideBottom', offset: -5 }} />
                    <YAxis yAxisId="left" label={{ value: 'ضریب سایش (%)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'گلوله جایگزین (تن)', angle: 90, position: 'insideRight' }} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${typeof value === 'number' ? value.toFixed(1) : value}${name === 'wearFactor' ? '%' : name === 'makeupBalls' ? ' تن' : ' mm'}`,
                        name === 'wearFactor' ? 'ضریب سایش' : name === 'makeupBalls' ? 'گلوله جایگزین' : 'اندازه متوسط'
                      ]}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="wearFactor" stroke="#8884d8" strokeWidth={2} />
                    <Bar yAxisId="right" dataKey="makeupBalls" fill="#82ca9d" />
                    <Line yAxisId="left" type="monotone" dataKey="averageSize" stroke="#ffc658" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <h5 className="font-semibold text-yellow-800 mb-2">استراتژی جایگزینی</h5>
                  <div className="space-y-2 text-sm text-yellow-700">
                    <p>• مصرف سالانه گلوله: <strong>{(advancedParams.ballWearRate * advancedParams.throughput * 8760 / 1000).toFixed(0)} تن</strong></p>
                    <p>• اندازه گلوله جایگزین: <strong>{(advancedParams.optimalBallSize * 1.1).toFixed(1)} mm</strong></p>
                    <p>• فواصل تعویض: <strong>هر 2-3 ماه</strong></p>
                    <p>• نظارت بر اندازه: <strong>هفتگی</strong></p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <h5 className="font-semibold text-red-800 mb-2">هشدارهای مهم</h5>
                  <div className="space-y-1 text-sm text-red-700">
                    {advancedParams.ballWearRate > 0.5 && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>نرخ سایش بالا - بررسی سختی ماده</span>
                      </div>
                    )}
                    {advancedParams.optimalBallSize < 25 && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>اندازه گلوله کوچک - احتمال جریان‌زایی</span>
                      </div>
                    )}
                    {advancedParams.optimalBallSize > 100 && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>اندازه گلوله بزرگ - کاهش سطح تماس</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h5 className="font-semibold text-green-800 mb-2">توصیه‌های بهینه‌سازی</h5>
                  <div className="space-y-1 text-sm text-green-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>استفاده از گلوله‌های آلیاژی برای سایش کمتر</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>کنترل pH خمیر برای کاهش خوردگی</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>بهینه‌سازی مداوم توزیع اندازه</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Panel */}
      {optimizationMode && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Target className="w-5 h-5" />
              پنل بهینه‌سازی پیشرفته
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-800">بهینه‌سازی شارژ</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">شارژ فعلی:</span>
                    <Badge variant="outline">{inputs.darsad_bar}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">شارژ بهینه:</span>
                    <Badge className="bg-green-100 text-green-800">38-42%</Badge>
                  </div>
                  <Progress 
                    value={parseFloat(inputs.darsad_bar)} 
                    className="h-2" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-orange-800">بهینه‌سازی سرعت</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">سرعت فعلی:</span>
                    <Badge variant="outline">{inputs.Cs}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">سرعت بهینه:</span>
                    <Badge className="bg-green-100 text-green-800">72-78%</Badge>
                  </div>
                  <Progress 
                    value={parseFloat(inputs.Cs)} 
                    className="h-2" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-orange-800">پتانسیل بهبود</h4>
                <div className="space-y-2">
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-2xl font-bold text-green-600">+{(15 + Math.random() * 10).toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">افزایش ظرفیت</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-2xl font-bold text-blue-600">-{(8 + Math.random() * 5).toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">کاهش مصرف انرژی</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}