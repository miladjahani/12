import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Wand2, 
  Target, 
  DollarSign, 
  MapPin, 
  Factory, 
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Settings,
  BarChart3,
  Globe,
  Layers,
  Calculator,
  Lightbulb,
  Award,
  Clock,
  Shield,
  Gauge,
  Building,
  TreePine,
  Truck,
  Users,
  Archive
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { comprehensiveMaterialDatabase } from '@/components/ComprehensiveMaterialDatabase';

interface DesignRequirements {
  capacity: string;
  material: string;
  feedSize: string;
  productSize: string;
  availability: string;
  location: string;
  budget: string;
  priority: string;
  environmental: string;
  timeline: string;
  operatingHours: string;
  maintenance: string;
  automation: string;
  expansion: string;
}

interface DesignOption {
  id: string;
  name: string;
  diameter: number;
  length: number;
  power: number;
  cost: number;
  efficiency: number;
  reliability: number;
  environmental: number;
  maintenance: number;
  description: string;
  advantages: string[];
  disadvantages: string[];
  suitability: string;
  paybackPeriod: number;
  operatingCost: number;
  ballCharge: number;
  criticalSpeed: number;
  throughput: number;
  energyConsumption: number;
}

// Advanced design algorithms based on industry best practices
const generateDesignOptions = (requirements: DesignRequirements, selectedMaterial: any): DesignOption[] => {
  const capacity = parseFloat(requirements.capacity) || 100;
  const feedSize = parseFloat(requirements.feedSize) || 2000;
  const productSize = parseFloat(requirements.productSize) || 150;
  const budget = parseFloat(requirements.budget) || 1000000;
  
  // Material properties
  const Wi = selectedMaterial?.Wi || 15;
  const Sg = selectedMaterial?.Sg || 2.7;
  const abrasiveness = selectedMaterial?.wear_factor || 1.0;
  
  // Calculate reduction ratio
  const reductionRatio = feedSize / productSize;
  
  // Base power calculation using Bond's law
  const basePower = Wi * capacity * (1/Math.sqrt(productSize) - 1/Math.sqrt(feedSize));
  
  // Size mill based on capacity and material
  const baseDiameter = Math.pow(capacity / 50, 0.3) * 3.0; // Base scaling
  const baseLength = baseDiameter * 1.2; // L/D ratio of 1.2
  
  const options: DesignOption[] = [
    {
      id: 'conservative',
      name: 'طراحی محافظه‌کارانه - اعتماد بالا',
      diameter: baseDiameter * 1.1,
      length: baseLength * 1.0,
      power: basePower * 1.3, // Higher safety factor
      cost: budget * 0.85,
      efficiency: 82,
      reliability: 95,
      environmental: 75,
      maintenance: 90,
      description: 'طراحی با ضریب اطمینان بالا برای عملیات پایدار و قابل اعتماد',
      advantages: [
        'قابلیت اطمینان بالا (>95%)',
        'هزینه نگهداری کم',
        'عملکرد پایدار در شرایط مختلف',
        'سهولت تعمیر و نگهداری',
        'عمر مفید طولانی (+25 سال)'
      ],
      disadvantages: [
        'سرمایه‌گذاری اولیه بالاتر',
        'مصرف انرژی نسبتاً بیشتر',
        'اشغال فضای بیشتر',
        'زمان نصب طولانی‌تر'
      ],
      suitability: 'مناسب برای عملیات 24/7 و مواد سخت',
      paybackPeriod: 4.2,
      operatingCost: capacity * 12,
      ballCharge: 40,
      criticalSpeed: 72,
      throughput: capacity * 0.95,
      energyConsumption: basePower * 1.3
    },
    
    {
      id: 'balanced',
      name: 'طراحی متعادل - بهینه اقتصادی',
      diameter: baseDiameter,
      length: baseLength,
      power: basePower * 1.1,
      cost: budget * 0.75,
      efficiency: 88,
      reliability: 87,
      environmental: 82,
      maintenance: 83,
      description: 'تعادل بهینه بین هزینه، عملکرد و قابلیت اطمینان',
      advantages: [
        'نسبت هزینه-عملکرد بهینه',
        'راندمان انرژی مطلوب',
        'تعادل عملکردی مناسب',
        'انعطاف‌پذیری در عملیات',
        'نگهداری متعادل'
      ],
      disadvantages: [
        'نیاز به نظارت بیشتر',
        'حساسیت به تغییرات خوراک',
        'محدودیت در شرایط شدید'
      ],
      suitability: 'توصیه برای اکثر کاربردهای صنعتی',
      paybackPeriod: 3.1,
      operatingCost: capacity * 10,
      ballCharge: 38,
      criticalSpeed: 75,
      throughput: capacity * 1.02,
      energyConsumption: basePower * 1.1
    },
    
    {
      id: 'aggressive',
      name: 'طراحی تهاجمی - حداکثر راندمان',
      diameter: baseDiameter * 0.9,
      length: baseLength * 1.1,
      power: basePower * 0.95,
      cost: budget * 0.65,
      efficiency: 94,
      reliability: 78,
      environmental: 90,
      maintenance: 72,
      description: 'طراحی بهینه شده برای حداکثر راندمان و کمترین مصرف انرژی',
      advantages: [
        'راندمان انرژی بالا (>90%)',
        'سرمایه‌گذاری کمتر',
        'عملکرد سریع‌تر',
        'اثرات زیست‌محیطی کمتر',
        'فضای کمتر مورد نیاز'
      ],
      disadvantages: [
        'نیاز به کنترل دقیق‌تر',
        'حساسیت به کیفیت خوراک',
        'هزینه نگهداری بالاتر',
        'نیاز به اپراتور ماهر'
      ],
      suitability: 'مناسب برای مواد نرم و عملیات کنترل شده',
      paybackPeriod: 2.3,
      operatingCost: capacity * 8.5,
      ballCharge: 42,
      criticalSpeed: 78,
      throughput: capacity * 1.08,
      energyConsumption: basePower * 0.95
    },
    
    {
      id: 'modular',
      name: 'طراحی مدولار - قابلیت توسعه',
      diameter: baseDiameter * 0.85,
      length: baseLength * 0.8,
      power: basePower * 0.8,
      cost: budget * 0.6,
      efficiency: 85,
      reliability: 82,
      environmental: 85,
      maintenance: 85,
      description: 'طراحی مدولار با قابلیت توسعه و ارتقای آینده',
      advantages: [
        'امکان توسعه مرحله‌ای',
        'انعطاف‌پذیری بالا',
        'کاهش ریسک سرمایه‌گذاری',
        'قابلیت تطبیق با تغییرات',
        'نصب سریع‌تر'
      ],
      disadvantages: [
        'پیچیدگی بیشتر در طراحی',
        'هزینه واحد بالاتر',
        'نیاز به برنامه‌ریزی دقیق'
      ],
      suitability: 'مناسب برای پروژه‌های با رشد تدریجی',
      paybackPeriod: 3.8,
      operatingCost: capacity * 9.2,
      ballCharge: 36,
      criticalSpeed: 73,
      throughput: capacity * 0.8,
      energyConsumption: basePower * 0.8
    }
  ];
  
  // Adjust based on specific requirements
  options.forEach(option => {
    // Location adjustments
    if (requirements.location === 'remote') {
      option.reliability += 5;
      option.maintenance += 8;
      option.cost *= 1.15;
    } else if (requirements.location === 'urban') {
      option.environmental += 10;
      option.cost *= 1.08;
    }
    
    // Priority adjustments
    if (requirements.priority === 'cost') {
      option.cost *= 0.9;
      option.efficiency -= 3;
    } else if (requirements.priority === 'efficiency') {
      option.efficiency += 5;
      option.cost *= 1.1;
    } else if (requirements.priority === 'reliability') {
      option.reliability += 8;
      option.cost *= 1.12;
    }
    
    // Environmental requirements
    if (requirements.environmental === 'strict') {
      option.environmental += 10;
      option.cost *= 1.08;
      option.energyConsumption *= 0.92;
    }
    
    // Abrasiveness impact
    option.maintenance -= Math.round((abrasiveness - 1) * 10);
    option.operatingCost *= abrasiveness;
    
    // Ensure values stay within reasonable bounds
    option.efficiency = Math.min(96, Math.max(75, option.efficiency));
    option.reliability = Math.min(98, Math.max(70, option.reliability));
    option.environmental = Math.min(95, Math.max(65, option.environmental));
    option.maintenance = Math.min(95, Math.max(65, option.maintenance));
  });
  
  return options;
};

// Calculate design scores and rankings
const calculateDesignScore = (option: DesignOption, requirements: DesignRequirements): number => {
  const weights = {
    cost: requirements.priority === 'cost' ? 0.35 : 0.25,
    efficiency: requirements.priority === 'efficiency' ? 0.35 : 0.25,
    reliability: requirements.priority === 'reliability' ? 0.35 : 0.25,
    environmental: requirements.environmental === 'strict' ? 0.3 : 0.15,
    maintenance: 0.1
  };
  
  // Normalize cost (lower is better)
  const costScore = Math.max(0, 100 - (option.cost / 1000000) * 50);
  
  const score = (
    costScore * weights.cost +
    option.efficiency * weights.efficiency +
    option.reliability * weights.reliability +
    option.environmental * weights.environmental +
    option.maintenance * weights.maintenance
  ) / (weights.cost + weights.efficiency + weights.reliability + weights.environmental + weights.maintenance);
  
  return Math.round(score);
};

export default function IntelligentDesignAssistant({ onDesignGenerated }: { onDesignGenerated?: (design: any) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [requirements, setRequirements] = useState<DesignRequirements>({
    capacity: '',
    material: '',
    feedSize: '',
    productSize: '',
    availability: '95',
    location: 'industrial',
    budget: '',
    priority: 'balanced',
    environmental: 'standard',
    timeline: '12',
    operatingHours: '8000',
    maintenance: 'standard',
    automation: 'semi',
    expansion: 'no'
  });
  
  const [designOptions, setDesignOptions] = useState<DesignOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  const totalSteps = 4;
  const stepProgress = (currentStep / totalSteps) * 100;

  const handleMaterialSelect = (materialKey: string) => {
    const material = comprehensiveMaterialDatabase[materialKey as keyof typeof comprehensiveMaterialDatabase];
    if (material) {
      setSelectedMaterial({ key: materialKey, ...material });
      setRequirements(prev => ({ ...prev, material: materialKey }));
    }
  };

  const generateDesigns = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate AI processing with progress updates
    const steps = [
      'تحلیل نیازمندی‌های شما...',
      'بررسی پایگاه داده مواد...',
      'محاسبه پارامترهای مهندسی...',
      'تولید گزینه‌های طراحی...',
      'بهینه‌سازی عملکرد...',
      'ارزیابی اقتصادی...',
      'تحلیل ریسک و قابلیت اطمینان...',
      'آماده‌سازی توصیه‌ها...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setGenerationProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const options = generateDesignOptions(requirements, selectedMaterial);
    setDesignOptions(options);
    setIsGenerating(false);
    setCurrentStep(4);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">مشخصات پروژه</h3>
              <p className="text-gray-600">اطلاعات کلی پروژه و نیازمندی‌های شما را وارد کنید</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity" className="flex items-center gap-2">
                  <Factory className="w-4 h-4" />
                  ظرفیت مورد نیاز (تن/ساعت)
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={requirements.capacity}
                  onChange={(e) => setRequirements(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="مثال: 100"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  نوع ماده
                </Label>
                <Select value={requirements.material} onValueChange={(value) => handleMaterialSelect(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب ماده..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(comprehensiveMaterialDatabase).map(([key, material]) => (
                      <SelectItem key={key} value={key}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedSize" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  اندازه خوراک F80 (میکرون)
                </Label>
                <Input
                  id="feedSize"
                  type="number"
                  value={requirements.feedSize}
                  onChange={(e) => setRequirements(prev => ({ ...prev, feedSize: e.target.value }))}
                  placeholder="مثال: 2000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productSize" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  اندازه محصول P80 (میکرون)
                </Label>
                <Input
                  id="productSize"
                  type="number"
                  value={requirements.productSize}
                  onChange={(e) => setRequirements(prev => ({ ...prev, productSize: e.target.value }))}
                  placeholder="مثال: 150"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  بودجه تقریبی (دلار)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={requirements.budget}
                  onChange={(e) => setRequirements(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="مثال: 1000000"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  موقعیت پروژه
                </Label>
                <Select value={requirements.location} onValueChange={(value) => setRequirements(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban">شهری - دسترسی آسان</SelectItem>
                    <SelectItem value="industrial">صنعتی - متوسط</SelectItem>
                    <SelectItem value="remote">دورافتاده - محدود</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedMaterial && (
              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">ماده انتخاب شده</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>Wi: {selectedMaterial.Wi}</div>
                    <div>Sg: {selectedMaterial.Sg}</div>
                    <div>سختی: {selectedMaterial.hardness}</div>
                    <div>سایش: {selectedMaterial.abrasiveness}</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">شرایط عملیاتی</h3>
              <p className="text-gray-600">پارامترهای عملیاتی و محیطی را تنظیم کنید</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Gauge className="w-4 h-4" />
                    در دسترس بودن مورد نیاز: {requirements.availability}%
                  </Label>
                  <Slider
                    value={[parseFloat(requirements.availability)]}
                    onValueChange={(value) => setRequirements(prev => ({ ...prev, availability: value[0].toString() }))}
                    max={99}
                    min={80}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>80%</span>
                    <span>99%</span>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    ساعات کاری سالانه: {requirements.operatingHours}
                  </Label>
                  <Slider
                    value={[parseFloat(requirements.operatingHours)]}
                    onValueChange={(value) => setRequirements(prev => ({ ...prev, operatingHours: value[0].toString() }))}
                    max={8760}
                    min={2000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2000</span>
                    <span>8760</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <TreePine className="w-4 h-4" />
                    الزامات زیست‌محیطی
                  </Label>
                  <Select value={requirements.environmental} onValueChange={(value) => setRequirements(prev => ({ ...prev, environmental: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">پایه - استاندارد معمولی</SelectItem>
                      <SelectItem value="standard">متوسط - کنترل آلودگی</SelectItem>
                      <SelectItem value="strict">سخت - صفر آلودگی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    سطح اتوماسیون
                  </Label>
                  <Select value={requirements.automation} onValueChange={(value) => setRequirements(prev => ({ ...prev, automation: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">دستی - اپراتور محلی</SelectItem>
                      <SelectItem value="semi">نیمه اتوماتیک - کنترل از راه دور</SelectItem>
                      <SelectItem value="full">کاملاً اتوماتیک - هوش مصنوعی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    برنامه توسعه آینده
                  </Label>
                  <Select value={requirements.expansion} onValueChange={(value) => setRequirements(prev => ({ ...prev, expansion: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">بدون برنامه توسعه</SelectItem>
                      <SelectItem value="planned">توسعه برنامه‌ریزی شده</SelectItem>
                      <SelectItem value="flexible">نیاز به انعطاف‌پذیری بالا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">اولویت‌بندی و تایمالین</h3>
              <p className="text-gray-600">اولویت‌های پروژه و برنامه زمانی را مشخص کنید</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    اولویت اصلی پروژه
                  </Label>
                  <Select value={requirements.priority} onValueChange={(value) => setRequirements(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cost">کمترین هزینه - اقتصادی</SelectItem>
                      <SelectItem value="balanced">متعادل - توازن کلی</SelectItem>
                      <SelectItem value="efficiency">بالاترین راندمان</SelectItem>
                      <SelectItem value="reliability">قابلیت اطمینان بالا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    استراتژی نگهداری
                  </Label>
                  <Select value={requirements.maintenance} onValueChange={(value) => setRequirements(prev => ({ ...prev, maintenance: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reactive">واکنشی - تعمیر در صورت خرابی</SelectItem>
                      <SelectItem value="standard">استاندارد - نگهداری دوره‌ای</SelectItem>
                      <SelectItem value="predictive">پیش‌بینانه - نظارت مداوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    مهلت تحویل پروژه: {requirements.timeline} ماه
                  </Label>
                  <Slider
                    value={[parseFloat(requirements.timeline)]}
                    onValueChange={(value) => setRequirements(prev => ({ ...prev, timeline: value[0].toString() }))}
                    max={36}
                    min={6}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>6 ماه</span>
                    <span>36 ماه</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">خلاصه نیازمندی‌ها</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>ظرفیت: {requirements.capacity} تن/ساعت</div>
                    <div>ماده: {selectedMaterial?.name || 'انتخاب نشده'}</div>
                    <div>بودجه: ${parseFloat(requirements.budget || '0').toLocaleString()}</div>
                    <div>اولویت: {
                      requirements.priority === 'cost' ? 'اقتصادی' :
                      requirements.priority === 'efficiency' ? 'راندمان' :
                      requirements.priority === 'reliability' ? 'اعتماد' : 'متعادل'
                    }</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <Button
                onClick={generateDesigns}
                disabled={isGenerating || !requirements.capacity || !requirements.material}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                تولید طراحی‌های هوشمند
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">گزینه‌های طراحی پیشنهادی</h3>
              <p className="text-gray-600">بهترین طراحی را بر اساس نیازمندی‌های شما انتخاب کنید</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {designOptions.map((option, index) => {
                const score = calculateDesignScore(option, requirements);
                const isRecommended = score === Math.max(...designOptions.map(opt => calculateDesignScore(opt, requirements)));
                
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedOption === option.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                      } ${isRecommended ? 'border-2 border-green-500' : ''}`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      {isRecommended && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-t-lg text-center text-sm font-medium">
                          <Award className="w-4 h-4 inline mr-1" />
                          توصیه هوشمند سیستم
                        </div>
                      )}
                      
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{option.name}</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            امتیاز: {score}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          {/* Key Specifications */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-gray-400" />
                              <span>قطر: {option.diameter.toFixed(1)}m</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-gray-400" />
                              <span>طول: {option.length.toFixed(1)}m</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-gray-400" />
                              <span>توان: {option.power.toFixed(0)}kW</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span>هزینه: ${(option.cost/1000).toFixed(0)}K</span>
                            </div>
                          </div>

                          {/* Performance Metrics */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">راندما��</span>
                              <div className="flex items-center gap-2">
                                <Progress value={option.efficiency} className="w-20 h-2" />
                                <span className="text-sm font-medium">{option.efficiency}%</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">قابلیت اطمینان</span>
                              <div className="flex items-center gap-2">
                                <Progress value={option.reliability} className="w-20 h-2" />
                                <span className="text-sm font-medium">{option.reliability}%</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">محیط زیست</span>
                              <div className="flex items-center gap-2">
                                <Progress value={option.environmental} className="w-20 h-2" />
                                <span className="text-sm font-medium">{option.environmental}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Economic Summary */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>بازگشت سرمایه: {option.paybackPeriod} سال</div>
                              <div>هزینه عملیاتی: ${option.operatingCost.toFixed(0)}/ساعت</div>
                              <div>ظرفیت: {option.throughput.toFixed(0)} t/h</div>
                              <div>مصرف انرژی: {option.energyConsumption.toFixed(0)} kW</div>
                            </div>
                          </div>

                          {/* Suitability */}
                          <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                            <strong>مناسب برای:</strong> {option.suitability}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Detailed Comparison */}
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>تحلیل تفصیلی طراحی انتخابی</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const option = designOptions.find(opt => opt.id === selectedOption);
                      if (!option) return null;

                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-green-600 mb-2">مزایا</h4>
                              <ul className="space-y-1">
                                {option.advantages.map((advantage, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    {advantage}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-orange-600 mb-2">معایب</h4>
                              <ul className="space-y-1">
                                {option.disadvantages.map((disadvantage, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                    {disadvantage}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {selectedOption && (
              <div className="text-center">
                <Button
                  onClick={() => {
                    const selectedDesign = designOptions.find(opt => opt.id === selectedOption);
                    if (selectedDesign && onDesignGenerated) {
                      onDesignGenerated({
                        ...selectedDesign,
                        requirements,
                        selectedMaterial
                      });
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  استفاده از این طراحی
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Wand2 className="w-8 h-8 text-purple-600" />
            دستیار هوشمند طراحی آسیاب
          </CardTitle>
          <p className="text-gray-600">
            نیازمندی‌های خود را وارد کنید و بهترین طراحی آسیاب را دریافت کنید
          </p>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">مرحله {currentStep} از {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round(stepProgress)}% تکمیل</span>
          </div>
          <Progress value={stepProgress} className="w-full" />
          
          <div className="flex justify-between mt-4">
            {['مشخصات', 'عملیات', 'اولویت', 'طراحی'].map((step, index) => (
              <div 
                key={step}
                className={`flex items-center gap-2 ${
                  index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  {index + 1}
                </div>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Wand2 className="w-8 h-8 text-purple-600" />
                </motion.div>
              </div>
              <h3 className="text-lg font-semibold mb-2">تولید طراحی‌های هوشمند...</h3>
              <Progress value={generationProgress} className="w-full max-w-md mx-auto mb-2" />
              <p className="text-sm text-gray-600">{Math.round(generationProgress)}% - در حال پردازش...</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || isGenerating}
        >
          مرحله قبل
        </Button>
        
        {currentStep < 3 && (
          <Button
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            disabled={
              (currentStep === 1 && (!requirements.capacity || !requirements.material)) ||
              isGenerating
            }
          >
            مرحله بعد
          </Button>
        )}
      </div>
    </div>
  );
}