import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Calculator,
  Gauge,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AdvancedCalculationsProps {
  inputs: any;
  results: any;
}

export default function AdvancedCalculations({ inputs, results }: AdvancedCalculationsProps) {
  if (!results) return null;

  // Advanced engineering calculations
  const D = parseFloat(inputs.D);
  const L = parseFloat(inputs.L);
  const Wi = parseFloat(inputs.Wi);
  const F80 = parseFloat(inputs.F80);
  const P80 = F80 / 8; // Typical product size
  const Cs = parseFloat(inputs.Cs);
  const darsad_bar = parseFloat(inputs.darsad_bar);
  const chegali_golole = parseFloat(inputs.chegali_golole);

  // Power calculations (Bond's equation)
  const bondPower = 10 * Wi * (1/Math.sqrt(P80) - 1/Math.sqrt(F80)); // kWh/t
  const totalPower = bondPower * 1.2; // Including inefficiencies
  const motorPower = totalPower * 1.15; // Motor sizing factor

  // Critical speed calculation
  const criticalSpeed = 42.3 / Math.sqrt(D); // rpm
  const operatingSpeed = (Cs / 100) * criticalSpeed; // rpm

  // Throughput calculation (Rowland & Kjos method)
  const baseCapacity = 0.35 * Math.pow(D, 2.5) * L * Math.sqrt(operatingSpeed / criticalSpeed);
  const throughput = baseCapacity * (1 - darsad_bar/100) * 0.6; // t/h

  // Economic calculations
  const powerCost = 0.12; // $/kWh
  const operatingHours = 8000; // hours/year
  const annualPowerCost = totalPower * throughput * operatingHours * powerCost;
  const ballConsumption = 0.5; // kg/t processed
  const ballCost = 0.8; // $/kg
  const annualBallCost = ballConsumption * throughput * operatingHours * ballCost;

  // Efficiency analysis
  const millingEfficiency = Math.min(95, 75 + (operatingSpeed / criticalSpeed - 0.65) * 100);
  const powerEfficiency = Math.min(90, bondPower / totalPower * 100);

  // Safety and operational parameters
  const bearingPressure = (parseFloat(results.vazn_glole) * 1000) / (Math.PI * D * 0.15); // kg/m²
  const maxBearingPressure = 800; // kg/m²
  const safetyFactor = maxBearingPressure / bearingPressure;

  // Performance trends (simulated for demonstration)
  const performanceData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    throughput: throughput * (0.95 + Math.random() * 0.1),
    power: totalPower * (0.98 + Math.random() * 0.04),
    efficiency: millingEfficiency * (0.96 + Math.random() * 0.08)
  }));

  const getStatusColor = (value: number, threshold: number, reverse = false) => {
    const isGood = reverse ? value < threshold : value > threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (value: number, threshold: number, reverse = false) => {
    const isGood = reverse ? value < threshold : value > threshold;
    return isGood ? <CheckCircle className="w-4 h-4 text-green-600" /> : 
                   <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Power Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            تحلیل توان و انرژی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">توان مورد نیاز (Bond)</span>
                  <span className="font-semibold">{bondPower.toFixed(2)} kWh/t</span>
                </div>
                <Progress value={(bondPower / 30) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">توان کل</span>
                  <span className="font-semibold">{totalPower.toFixed(2)} kWh/t</span>
                </div>
                <Progress value={(totalPower / 35) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">توان موتور</span>
                  <span className="font-semibold">{motorPower.toFixed(2)} kW</span>
                </div>
                <Progress value={(motorPower / 1000) * 100} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Gauge className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">سرعت بحرانی</div>
                <div className="text-lg font-bold text-blue-600">{criticalSpeed.toFixed(1)} rpm</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">سرعت عملیاتی</div>
                <div className="text-lg font-bold text-green-600">{operatingSpeed.toFixed(1)} rpm</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">راندمان آسیاب</span>
                  {getStatusIcon(millingEfficiency, 80)}
                </div>
                <div className={`text-2xl font-bold ${getStatusColor(millingEfficiency, 80)}`}>
                  {millingEfficiency.toFixed(1)}%
                </div>
                <Progress value={millingEfficiency} className="mt-2 h-2" />
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">راندمان انرژی</span>
                  {getStatusIcon(powerEfficiency, 75)}
                </div>
                <div className={`text-2xl font-bold ${getStatusColor(powerEfficiency, 75)}`}>
                  {powerEfficiency.toFixed(1)}%
                </div>
                <Progress value={powerEfficiency} className="mt-2 h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            تحلیل تولید و ظرفیت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-sm text-gray-600">ظرفیت تئوری</div>
                  <div className="text-xl font-bold text-indigo-600">{throughput.toFixed(1)} t/h</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">تولید سالانه</div>
                  <div className="text-xl font-bold text-purple-600">
                    {(throughput * operatingHours / 1000).toFixed(0)}K t/y
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">اندازه خوراک (F80)</span>
                  <Badge variant="outline">{F80} μm</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">اندازه محصول (P80)</span>
                  <Badge variant="outline">{P80.toFixed(0)} μm</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">نسبت کاهش</span>
                  <Badge className="bg-green-100 text-green-800">{(F80/P80).toFixed(1)}:1</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">روند عملکرد 24 ساعته</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${typeof value === 'number' ? value.toFixed(1) : value}${name === 'throughput' ? ' t/h' : name === 'power' ? ' kWh/t' : '%'}`, 
                      name === 'throughput' ? 'ظرفیت' : name === 'power' ? 'توان' : 'راندمان'
                    ]}
                  />
                  <Area type="monotone" dataKey="efficiency" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Economic Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            تحلیل اقتصادی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600 mb-1">هزینه انرژی سالانه</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${annualPowerCost.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ({(annualPowerCost / (throughput * operatingHours)).toFixed(3)} $/t)
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600 mb-1">هزینه گلوله سالانه</div>
                <div className="text-2xl font-bold text-orange-600">
                  ${annualBallCost.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ({ballConsumption} kg/t مصرف)
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">هزینه عملیاتی کل</div>
                <div className="text-xl font-bold text-green-600">
                  ${(annualPowerCost + annualBallCost).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">سالانه</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">هزینه واحد تولید</div>
                <div className="text-xl font-bold text-blue-600">
                  ${((annualPowerCost + annualBallCost) / (throughput * operatingHours)).toFixed(2)}/t
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">توزیع هزینه‌ها</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">انرژی</span>
                  <span className="text-sm font-medium">
                    {(annualPowerCost / (annualPowerCost + annualBallCost) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={annualPowerCost / (annualPowerCost + annualBallCost) * 100} 
                  className="h-2" 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">گلوله‌ها</span>
                  <span className="text-sm font-medium">
                    {(annualBallCost / (annualPowerCost + annualBallCost) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={annualBallCost / (annualPowerCost + annualBallCost) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            تحلیل ایمنی و عملیاتی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">فشار یاتاقان</span>
                {getStatusIcon(bearingPressure, maxBearingPressure, true)}
              </div>
              <div className={`text-lg font-bold ${getStatusColor(bearingPressure, maxBearingPressure, true)}`}>
                {bearingPressure.toFixed(0)} kg/m²
              </div>
              <div className="text-xs text-gray-500 mt-1">
                حداکثر: {maxBearingPressure} kg/m²
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">ضریب ایمنی</span>
                {getStatusIcon(safetyFactor, 1.5)}
              </div>
              <div className={`text-lg font-bold ${getStatusColor(safetyFactor, 1.5)}`}>
                {safetyFactor.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                حداقل توصیه شده: 1.5
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">درصد سرعت بحرانی</span>
                {getStatusIcon(Cs, 65)}
              </div>
              <div className={`text-lg font-bold ${Cs >= 65 && Cs <= 78 ? 'text-green-600' : 'text-red-600'}`}>
                {Cs}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                محدوده بهینه: 65-78%
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">بار گلوله‌ای</span>
                {getStatusIcon(darsad_bar, 35)}
              </div>
              <div className={`text-lg font-bold ${darsad_bar >= 35 && darsad_bar <= 45 ? 'text-green-600' : 'text-red-600'}`}>
                {darsad_bar}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                محدوده بهینه: 35-45%
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">توصیه‌های عملیاتی</h4>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  {safetyFactor < 1.5 && <li>• ضریب ایمنی کم است. بازنگری طراحی توصیه می‌شود.</li>}
                  {millingEfficiency < 80 && <li>• راندمان آسیاب قابل بهبود است. سرعت و بار گلوله را بررسی کنید.</li>}
                  {Cs < 65 || Cs > 78 && <li>• سرعت عملیاتی خارج از محدوده بهینه است.</li>}
                  {powerEfficiency < 75 && <li>• راندمان انرژی کم است. بهینه‌سازی عملیات توصیه می‌شود.</li>}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}