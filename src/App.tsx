import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Settings,
  Calculator,
  BarChart3,
  HelpCircle,
  Ruler,
  Gauge,
  Layers,
  Zap,
  Target,
  Globe,
  TrendingUp,
  Percent,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Database,
  FileText,
  Beaker,
  Cog,
  Building2,
  Wand2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import ComprehensiveMaterialDatabase from "@/components/ComprehensiveMaterialDatabase";
import AdvancedCalculations from "@/components/AdvancedCalculations";
import ProfessionalReport from "@/components/ProfessionalReport";
import EnhancedBallCharging from "@/components/EnhancedBallCharging";
import IntelligentDesignAssistant from "@/components/IntelligentDesignAssistant";

// Default values based on engineering standards
const defaultValues = {
  D: "3.0", // Typical mill diameter 3m
  L: "4.0", // Typical mill length 4m
  Wi: "15.0", // Work index for medium hardness ore
  F80: "2000", // Feed size 2000 microns
  darsad_bar: "40", // Ball charge 40%
  chegali_golole: "7.8", // Steel ball density
  takhalkhol: "40", // Porosity 40%
  Sg: "2.7", // Specific gravity of ore
  k: "400", // Size reduction constant
  Cs: "72", // Critical speed percentage
};

// Parameter information with Persian descriptions
const parameterInfo = {
  D: {
    name: "قطر آسیاب (Mill Diameter)",
    description:
      "قطر داخلی آسیاب گلوله‌ای به متر. معمولاً بین ۱ تا ۶ متر",
    unit: "متر",
    range: "1-6",
    icon: Ruler,
  },
  L: {
    name: "طول آسیاب (Mill Length)",
    description:
      "طول داخلی آسیاب به متر. معمولاً بین ۱ تا ۱۰ متر",
    unit: "متر",
    range: "1-10",
    icon: Ruler,
  },
  Wi: {
    name: "شاخص کار (Work Index)",
    description:
      "انرژی مورد نیاز برای کاهش اندازه ماده. برای سنگ‌های متوسط ۱۰-۲۵",
    unit: "kWh/t",
    range: "10-25",
    icon: Zap,
  },
  F80: {
    name: "اندازه خوراک F80",
    description: "اندازه‌ای که ۸۰٪ خوراک از آن کوچکتر است",
    unit: "میکرون",
    range: "100-10000",
    icon: Target,
  },
  darsad_bar: {
    name: "درصد بار گلوله‌ای",
    description:
      "درصد حجم آسیاب که با گلوله پر شده. معمولاً ۳۵-۴۵٪",
    unit: "درصد",
    range: "35-45",
    icon: Percent,
  },
  chegali_golole: {
    name: "چگالی گلوله‌های فولادی",
    description: "چگالی مواد گلوله‌ها. برای فولاد حدود ۷.۸",
    unit: "t/m³",
    range: "7.6-7.9",
    icon: Globe,
  },
  takhalkhol: {
    name: "تخلخل بین گلوله‌ها",
    description: "درصد فضای خالی بین گلوله‌ها. معمولاً ۳۵-۴۵٪",
    unit: "درصد",
    range: "35-45",
    icon: Layers,
  },
  Sg: {
    name: "وزن مخصوص ماده (Sg)",
    description:
      "وزن مخصوص ماده معدنی. برای اکثر سنگ‌ها ۲.۶-۴.۰",
    unit: "g/cm³",
    range: "2.6-4.0",
    icon: Globe,
  },
  k: {
    name: "ثابت کاهش اندازه (k)",
    description: "ثابت مربوط به خصوصیات ماده. معمولاً ۳۵۰-۵۰۰",
    unit: "-",
    range: "350-500",
    icon: Settings,
  },
  Cs: {
    name: "درصد سرعت بحرانی",
    description: "درصد سرعت بحرانی آسیاب. معمولاً ۶۵-۷۸٪",
    unit: "درصد",
    range: "65-78",
    icon: Gauge,
  },
};

export default function App() {
  const [inputs, setInputs] = useState(defaultValues);
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showMaterialDatabase, setShowMaterialDatabase] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState(null);

  // Enhanced ball size distributions based on Morrell & Morrison methodology
  const advancedBallSizes = [12.7, 19.1, 25.4, 31.8, 38.1, 44.5, 50.8, 63.5, 76.2, 88.9, 101.6, 114.3, 127.0];
  
  const enhancedBallDistributions = {
    // Ultra-fine applications (P80 < 25 μm)
    ultraFine: {
      sizes: [12.7, 19.1, 25.4, 31.8],
      percentages: [25, 35, 25, 15],
      name: "توزیع فوق‌ریز - سیمان نهایی",
      applications: ["سیمان نهایی", "کربنات کلسیم فوق‌ریز", "پودرهای صنعتی"]
    },
    
    // Fine grinding (P80 25-75 μm)
    fine: {
      sizes: [19.1, 25.4, 31.8, 38.1, 44.5],
      percentages: [15, 25, 30, 20, 10],
      name: "توزیع ریز - مدارهای باز آسیاب",
      applications: ["باز آسیاب طلا", "باز آسیاب مس", "فرآوری مجدد کنسانتره"]
    },
    
    // Medium grinding (P80 75-150 μm)
    medium: {
      sizes: [25.4, 31.8, 38.1, 44.5, 50.8, 63.5],
      percentages: [12, 18, 22, 20, 15, 13],
      name: "توزیع متوسط - آسیاب ثانویه",
      applications: ["آسیاب ثانویه مس", "آسیاب ثانویه آهن", "فسفات راک"]
    },
    
    // Coarse grinding (P80 150-300 μm)  
    coarse: {
      sizes: [38.1, 44.5, 50.8, 63.5, 76.2, 88.9, 101.6],
      percentages: [10, 15, 18, 20, 15, 12, 10],
      name: "توزیع درشت - آسیاب اولیه",
      applications: ["آسیاب اولیه مس", "آسیاب اولیه آهن", "مواد ساختمانی"]
    },
    
    // Very coarse (P80 > 300 μm)
    veryCoarse: {
      sizes: [63.5, 76.2, 88.9, 101.6, 114.3, 127.0],
      percentages: [15, 20, 22, 18, 15, 10],
      name: "توزیع فوق‌درشت - آسیاب‌های بزرگ",
      applications: ["آسیاب‌های بزرگ معدنی", "سنگ آهک", "کلینکر خام"]
    },

    // Specialized for hard ores
    hardOres: {
      sizes: [31.8, 38.1, 44.5, 50.8, 63.5, 76.2, 88.9, 101.6],
      percentages: [8, 12, 15, 18, 17, 15, 10, 5],
      name: "توزیع ویژه سنگ‌های سخت",
      applications: ["کوارتز", "طلای مقاوم", "سنگ‌های سیلیکاته"]
    },

    // Specialized for soft ores
    softOres: {
      sizes: [19.1, 25.4, 31.8, 38.1, 44.5, 50.8, 63.5],
      percentages: [18, 22, 20, 15, 12, 8, 5],
      name: "توزیع ویژه سنگ‌های نرم",
      applications: ["فسفات", "بوکسیت", "زغال سنگ", "مواد کربناته"]
    }
  };

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadDefaultValues = () => {
    setInputs(defaultValues);
  };

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setInputs(prev => ({
      ...prev,
      Wi: material.Wi.toString(),
      Sg: material.Sg.toString(),
      k: material.recommendedK.toString()
    }));
    setShowMaterialDatabase(false);
  };

  const handleDesignGenerated = (design) => {
    setGeneratedDesign(design);
    // Auto-populate calculator inputs based on generated design
    setInputs(prev => ({
      ...prev,
      D: design.diameter.toFixed(1),
      L: design.length.toFixed(1),
      Wi: design.selectedMaterial?.Wi?.toString() || prev.Wi,
      Sg: design.selectedMaterial?.Sg?.toString() || prev.Sg,
      k: design.selectedMaterial?.recommendedK?.toString() || prev.k,
      darsad_bar: design.ballCharge.toString(),
      Cs: design.criticalSpeed.toString()
    }));
    setSelectedMaterial(design.selectedMaterial);
    setActiveTab("calculator");
  };

  const calculateResults = async () => {
    setIsCalculating(true);

    // Simulate calculation time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Convert inputs to numbers
    const D = parseFloat(inputs.D);
    const L = parseFloat(inputs.L);
    const Wi = parseFloat(inputs.Wi);
    const F80 = parseFloat(inputs.F80);
    const darsad_bar = parseFloat(inputs.darsad_bar);
    const chegali_golole = parseFloat(inputs.chegali_golole);
    const takhalkhol = parseFloat(inputs.takhalkhol);
    const Sg = parseFloat(inputs.Sg);
    const k = parseFloat(inputs.k);
    const Cs = parseFloat(inputs.Cs);

    // Validate inputs
    if (
      [
        D,
        L,
        Wi,
        F80,
        darsad_bar,
        chegali_golole,
        takhalkhol,
        Sg,
        k,
        Cs,
      ].some((val) => isNaN(val))
    ) {
      alert("لطفاً همه مقادیر را به درستی وارد کنید");
      setIsCalculating(false);
      return;
    }

    // Enhanced calculations with multiple methodologies
    const hajm_asiab = (Math.PI * D * D * L) / 4;
    const hajm_bar = (darsad_bar / 100) * hajm_asiab;
    const hajm_golole = hajm_bar * (1 - takhalkhol / 100);
    const vazn_glole = hajm_golole * chegali_golole;
    
    // Enhanced ball size calculation using multiple methods
    const F80_mm = F80 / 1000;
    const P80 = F80 / 8; // Typical reduction ratio
    
    // Bond's original equation
    const bondBallSize = 25.4 * Math.pow((Sg * Wi * F80_mm)/(Cs * Math.sqrt(D * 3.281)), 1/3);
    
    // Morrell's improved equation (2004)
    const K1 = k || 350; // Material constant from input or default
    const morellBallSize = (K1/1000) * Math.pow((Wi * F80)/(Math.sqrt(D * 1000) * (Cs/100)), 0.5);
    
    // Austin's modification for specific energy
    const specificEnergy = Wi * (1/Math.sqrt(P80) - 1/Math.sqrt(F80));
    const austinBallSize = bondBallSize * Math.pow(specificEnergy/10, 0.15);
    
    // Weighted average of methods (Bond 50%, Morrell 30%, Austin 20%)
    const b = (bondBallSize * 0.5 + morellBallSize * 0.3 + austinBallSize * 0.2);
    
    // Critical speed and operational parameters
    const criticalSpeed = 42.3 / Math.sqrt(D);
    const operatingSpeed = (Cs / 100) * criticalSpeed;
    
    // Power calculations using Morrell's approach
    const Jb = darsad_bar / 100; // Ball filling fraction
    const powerNoLoad = 1.68 * Math.pow(D, 2.05) * L * (1 - 0.1 * Jb) * Math.sqrt(Cs/100);
    const powerBalls = 10.6 * Math.pow(D, 1.35) * L * Jb * Sg * Math.sqrt(Cs/100);
    const totalPower = powerNoLoad + powerBalls;
    const netPower = totalPower * 0.75; // Mechanical efficiency
    
    // Throughput using enhanced Bond equation
    const A = Math.pow(10, 0.4 * Math.log10(Wi) - 1.33);
    const throughput = netPower / (Wi * A * (1/Math.sqrt(P80) - 1/Math.sqrt(F80)));
    
    // Ball wear rate (Cleary & Morrison enhanced)
    const ballWearRate = 0.024 * specificEnergy * Math.pow(operatingSpeed/criticalSpeed, 1.2) * (Sg/2.7);

    // Enhanced ball size distribution selection
    let selectedDistribution = {};
    let distributionName = "";
    
    // Intelligent selection based on multiple factors
    const P80_target = P80; // Target product size
    
    // Selection logic based on target P80 and material properties
    if (P80_target < 25) {
      selectedDistribution = enhancedBallDistributions.ultraFine;
    } else if (P80_target < 75) {
      selectedDistribution = enhancedBallDistributions.fine;
    } else if (P80_target < 150) {
      selectedDistribution = enhancedBallDistributions.medium;
    } else if (P80_target < 300) {
      selectedDistribution = enhancedBallDistributions.coarse;
    } else {
      selectedDistribution = enhancedBallDistributions.veryCoarse;
    }
    
    // Material-specific adjustments
    if (selectedMaterial) {
      if (selectedMaterial.hardness === 'سخت' || selectedMaterial.hardness === 'خیلی سخت') {
        selectedDistribution = enhancedBallDistributions.hardOres;
      } else if (selectedMaterial.hardness === 'نرم' || selectedMaterial.hardness === 'خیلی نرم') {
        selectedDistribution = enhancedBallDistributions.softOres;
      }
    } else {
      // Fallback to Wi-based selection
      if (Wi > 16) {
        selectedDistribution = enhancedBallDistributions.hardOres;
      } else if (Wi < 10) {
        selectedDistribution = enhancedBallDistributions.softOres;
      }
    }
    
    distributionName = selectedDistribution.name;

    // Prepare enhanced chart data
    const distributionChartData = selectedDistribution.sizes.map(
      (size, index) => ({
        size: `${size}mm`,
        percentage: selectedDistribution.percentages[index],
        ballSize: size,
        index,
      }),
    );

    // Enhanced efficiency calculations
    const millingEfficiency = Math.min(95, 75 + (operatingSpeed / criticalSpeed - 0.65) * 100);
    const powerEfficiency = Math.min(90, (netPower / totalPower) * 100);
    const overallEfficiency = (millingEfficiency + powerEfficiency) / 2;

    setResults({
      hajm_asiab: hajm_asiab.toFixed(3),
      hajm_bar: hajm_bar.toFixed(3),
      hajm_golole: hajm_golole.toFixed(3),
      vazn_glole: vazn_glole.toFixed(3),
      b: b.toFixed(2),
      selectedDistribution: selectedDistribution.percentages,
      distributionName,
      distributionChartData,
      efficiency: overallEfficiency.toFixed(1),
      // Enhanced results
      bondBallSize: bondBallSize.toFixed(2),
      morellBallSize: morellBallSize.toFixed(2),
      austinBallSize: austinBallSize.toFixed(2),
      criticalSpeed: criticalSpeed.toFixed(1),
      operatingSpeed: operatingSpeed.toFixed(1),
      totalPower: totalPower.toFixed(0),
      netPower: netPower.toFixed(0),
      throughput: throughput.toFixed(1),
      ballWearRate: ballWearRate.toFixed(3),
      specificEnergy: specificEnergy.toFixed(2),
      millingEfficiency: millingEfficiency.toFixed(1),
      powerEfficiency: powerEfficiency.toFixed(1),
      P80: P80.toFixed(0),
      distributionObj: selectedDistribution
    });

    setIsCalculating(false);
    setActiveTab("results");
  };

  const resetForm = () => {
    setInputs({
      D: "",
      L: "",
      Wi: "",
      F80: "",
      darsad_bar: "",
      chegali_golole: "",
      takhalkhol: "",
      Sg: "",
      k: "",
      Cs: "",
    });
    setResults(null);
    setActiveTab("calculator");
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Settings className="w-16 h-16" />
                </motion.div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                محاسبه‌گر پیشرفته آسیاب گلوله‌ای
              </h1>
              <p className="text-xl text-blue-100">
                ابزار تخصصی مهندسی برای طراحی و بهینه‌سازی آسیاب‌های صنعتی
              </p>
              <div className="flex items-center justify-center gap-6 text-blue-200 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>استاندارد صنعتی</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span>محاسبات پیشرفته</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>گزارش‌دهی حرفه‌ای</span>
                </div>
              </div>
              <p className="text-blue-300 text-sm">
                طراحی و توسعه: مهندس میلاد جهانی | نسخه حرفه‌ای 2.0
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1585204630262-84278b4d8b00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwYmFsbCUyMG1pbGwlMjBtaW5pbmclMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU5NTI2NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Ball Mill Industrial Equipment"
                  className="w-full rounded-lg shadow-2xl opacity-90"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1752468348475-7101685ab2f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbmclMjBlbmdpbmVlcmluZyUyMGluZHVzdHJpYWwlMjBmYWNpbGl0eXxlbnwxfHx8fDE3NTk1Mjc2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Mining Engineering Industrial Facility"
                  className="w-full rounded-lg shadow-2xl opacity-90"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger
                value="designer"
                className="flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                طراح هوشمند
              </TabsTrigger>
              <TabsTrigger
                value="calculator"
                className="flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                محاسبه‌گر
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                نتایج
              </TabsTrigger>
              <TabsTrigger
                value="charging"
                className="flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                شارژ گلوله
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="flex items-center gap-2"
              >
                <Cog className="w-4 h-4" />
                تحلیل پیشرفته
              </TabsTrigger>
              <TabsTrigger
                value="report"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                گزارش
              </TabsTrigger>
              <TabsTrigger
                value="guide"
                className="flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                راهنما
              </TabsTrigger>
            </TabsList>

            <TabsContent value="designer">
              <IntelligentDesignAssistant onDesignGenerated={handleDesignGenerated} />
            </TabsContent>

            <TabsContent value="calculator">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Calculator className="w-6 h-6" />
                      پارامترهای ورودی
                    </CardTitle>
                    <p className="text-indigo-100">
                      مقادیر مورد نیاز برای طراحی آسیاب گلوله‌ای
                      را وارد کنید
                    </p>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="flex gap-4 mb-6 flex-wrap">
                      <Button
                        onClick={loadDefaultValues}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        بارگذاری مقادیر پیشفرض
                      </Button>
                      <Button
                        onClick={() => setShowMaterialDatabase(!showMaterialDatabase)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Database className="w-4 h-4" />
                        پایگاه داده مواد
                      </Button>
                      {selectedMaterial && (
                        <Badge variant="secondary" className="px-3 py-1">
                          <Beaker className="w-4 h-4 mr-2" />
                          {selectedMaterial.name}
                        </Badge>
                      )}
                      {generatedDesign && (
                        <Badge className="px-3 py-1 bg-green-100 text-green-800">
                          <Wand2 className="w-4 h-4 mr-2" />
                          طراحی هوشمند بارگذاری شد
                        </Badge>
                      )}
                    </div>

                    {generatedDesign && (
                      <Alert className="border-green-200 bg-green-50 mb-6">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">
                          طراحی هوشمند اعمال شد!
                        </AlertTitle>
                        <AlertDescription className="text-green-700">
                          پارامترهای آسیاب بر اساس نیازمندی‌های شما محاسبه و بارگذاری شدند.
                          <div className="mt-2 text-sm">
                            <strong>طراحی انتخابی:</strong> {generatedDesign.name}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {showMaterialDatabase && (
                      <ComprehensiveMaterialDatabase onMaterialSelect={handleMaterialSelect} />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(parameterInfo).map(
                        ([key, info]) => {
                          const IconComponent = info.icon;
                          return (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay:
                                  0.1 *
                                  Object.keys(
                                    parameterInfo,
                                  ).indexOf(key),
                              }}
                              className="space-y-3"
                            >
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-5 h-5 text-indigo-600" />
                                <Label
                                  htmlFor={key}
                                  className="font-medium"
                                >
                                  {info.name}
                                </Label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-indigo-600 transition-colors" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="font-medium">
                                      {info.description}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      واحد: {info.unit} |
                                      محدوده: {info.range}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="relative">
                                <Input
                                  id={key}
                                  type="number"
                                  step="0.1"
                                  value={inputs[key]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      key,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`مثال: ${defaultValues[key]}`}
                                  className="pl-12 bg-white border-2 border-gray-200 focus:border-indigo-500 transition-colors"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                  {info.unit}
                                </div>
                              </div>
                            </motion.div>
                          );
                        },
                      )}
                    </div>

                    <Separator />

                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={calculateResults}
                        disabled={isCalculating}
                        className="min-w-40 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-8 py-3"
                      >
                        {isCalculating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            در حال محاسبه...
                          </>
                        ) : (
                          <>
                            <Calculator className="w-4 h-4 mr-2" />
                            شروع محاسبه
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="min-w-32"
                      >
                        پاک کردن همه
                      </Button>
                    </div>

                    {isCalculating && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6"
                      >
                        <Progress
                          value={66}
                          className="w-full"
                        />
                        <p className="text-center text-sm text-gray-600 mt-2">
                          انجام محاسبات پیچیده آسیاب گلوله‌ای...
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="results">
              <AnimatePresence>
                {results ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Success Alert */}
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">
                        محاسبات با موفقیت انجام شد!
                      </AlertTitle>
                      <AlertDescription className="text-green-700">
                        نتایج طراحی آسیاب گلوله‌ای شما آماده
                        است.
                      </AlertDescription>
                    </Alert>

                    {/* Main Results Card */}
                    <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                          <BarChart3 className="w-6 h-6" />
                          نتایج محاسبات آسیاب
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {[
                            {
                              label: "حجم آسیاب",
                              value: results.hajm_asiab,
                              unit: "متر مکعب",
                              icon: Settings,
                              color: "blue",
                            },
                            {
                              label: "حجم بار خردکننده",
                              value: results.hajm_bar,
                              unit: "متر مکعب",
                              icon: Layers,
                              color: "green",
                            },
                            {
                              label: "حجم گلوله‌ها",
                              value: results.hajm_golole,
                              unit: "متر مکعب",
                              icon: Globe,
                              color: "purple",
                            },
                            {
                              label: "وزن گلوله‌ها",
                              value: results.vazn_glole,
                              unit: "تن",
                              icon: Gauge,
                              color: "orange",
                            },
                            {
                              label: "قطر بهترین گلوله",
                              value: results.b,
                              unit: "میلی‌متر",
                              icon: Target,
                              color: "red",
                            },
                            {
                              label: "راندمان کلی",
                              value: results.efficiency,
                              unit: "درصد",
                              icon: TrendingUp,
                              color: "indigo",
                            },
                            {
                              label: "ظرفیت محاسبه شده",
                              value: results.throughput,
                              unit: "تن/ساعت",
                              icon: BarChart3,
                              color: "emerald",
                            },
                            {
                              label: "توان کل مورد نیاز",
                              value: results.totalPower,
                              unit: "کیلووات",
                              icon: Zap,
                              color: "yellow",
                            },
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{
                                opacity: 0,
                                scale: 0.9,
                              }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: index * 0.1,
                              }}
                            >
                              <Card
                                className={`border-l-4 border-l-${item.color}-500 hover:shadow-lg transition-shadow`}
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-600">
                                        {item.label}
                                      </p>
                                      <p className="text-2xl font-bold text-gray-900">
                                        {item.value}
                                        <span className="text-sm font-normal text-gray-500 ml-1">
                                          {item.unit}
                                        </span>
                                      </p>
                                    </div>
                                    <item.icon
                                      className={`w-8 h-8 text-${item.color}-500`}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>

                        <Separator className="my-8" />

                        {/* Ball Size Distribution */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              توزیع اندازه گلوله‌های پیشنهادی
                            </h3>
                            <Badge
                              variant="secondary"
                              className="text-lg px-4 py-2"
                            >
                              {results.distributionName}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Bar Chart */}
                            <Card className="p-6">
                              <h4 className="text-lg font-semibold mb-4 text-center">
                                نمودار ستونی توزیع
                              </h4>
                              <ResponsiveContainer
                                width="100%"
                                height={300}
                              >
                                <BarChart
                                  data={
                                    results.distributionChartData
                                  }
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="size" />
                                  <YAxis />
                                  <RechartsTooltip
                                    formatter={(value) => [
                                      `${value}%`,
                                      "درصد",
                                    ]}
                                    labelFormatter={(label) =>
                                      `اندازه: ${label}`
                                    }
                                  />
                                  <Bar
                                    dataKey="percentage"
                                    fill="#3B82F6"
                                    radius={[4, 4, 0, 0]}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </Card>

                            {/* Pie Chart */}
                            <Card className="p-6">
                              <h4 className="text-lg font-semibold mb-4 text-center">
                                نمودار دایره‌ای توزیع
                              </h4>
                              <ResponsiveContainer
                                width="100%"
                                height={300}
                              >
                                <PieChart>
                                  <Pie
                                    data={
                                      results.distributionChartData
                                    }
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="percentage"
                                    label={({
                                      size,
                                      percentage,
                                    }) =>
                                      `${size}: ${percentage}%`
                                    }
                                  >
                                    {results.distributionChartData.map(
                                      (entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={
                                            COLORS[
                                              index %
                                                COLORS.length
                                            ]
                                          }
                                        />
                                      ),
                                    )}
                                  </Pie>
                                  <RechartsTooltip
                                    formatter={(value) => [
                                      `${value}%`,
                                      "درصد",
                                    ]}
                                    labelFormatter={(label) =>
                                      `اندازه: ${label}`
                                    }
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </Card>
                          </div>

                          {/* Enhanced Ball Size Grid */}
                          <Card className="p-6">
                            <h4 className="text-lg font-semibold mb-4">
                              جدول توزیع اندازه گلوله‌ها
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                              {results.distributionChartData.map(
                                (item, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{
                                      opacity: 0,
                                      scale: 0.8,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      scale: 1,
                                    }}
                                    transition={{
                                      delay: index * 0.05,
                                    }}
                                    className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow"
                                  >
                                    <div className="text-lg font-bold">
                                      {item.percentage}%
                                    </div>
                                    <div className="text-xs opacity-80">
                                      {item.ballSize}mm
                                    </div>
                                    <div className="text-xs opacity-60">
                                      گلوله {index + 1}
                                    </div>
                                  </motion.div>
                                ),
                              )}
                            </div>
                            
                            {/* Enhanced Ball Calculation Summary */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <h5 className="font-semibold text-blue-800 mb-2">روش Bond</h5>
                                <div className="text-2xl font-bold text-blue-600">{results.bondBallSize}mm</div>
                                <div className="text-xs text-blue-600">معادله کلاسیک</div>
                              </div>
                              
                              <div className="p-4 bg-green-50 rounded-lg">
                                <h5 className="font-semibold text-green-800 mb-2">روش Morrell</h5>
                                <div className="text-2xl font-bold text-green-600">{results.morellBallSize}mm</div>
                                <div className="text-xs text-green-600">مدل C</div>
                              </div>
                              
                              <div className="p-4 bg-purple-50 rounded-lg">
                                <h5 className="font-semibold text-purple-800 mb-2">روش Austin</h5>
                                <div className="text-2xl font-bold text-purple-600">{results.austinBallSize}mm</div>
                                <div className="text-xs text-purple-600">اصلاح انرژی ویژه</div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        هنوز محاسبه‌ای انجام نشده
                      </h3>
                      <p className="text-gray-500 mb-6">
                        برای مشاهده نتایج، ابتدا پارامترها را
                        وارد کرده و محاسبه را شروع کنید.
                      </p>
                      <Button
                        onClick={() =>
                          setActiveTab("calculator")
                        }
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        رفتن به محاسبه‌گر
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="charging">
              <EnhancedBallCharging 
                inputs={inputs} 
                results={results} 
                selectedMaterial={selectedMaterial}
              />
            </TabsContent>

            <TabsContent value="advanced">
              <AdvancedCalculations inputs={inputs} results={results} />
            </TabsContent>

            <TabsContent value="report">
              <ProfessionalReport 
                inputs={inputs} 
                results={results} 
                selectedMaterial={selectedMaterial}
              />
            </TabsContent>

            <TabsContent value="guide">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <HelpCircle className="w-6 h-6" />
                      راهنمای استفاده از محاسبه‌گر آسیاب
                      گلوله‌ای
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">
                          درباره آسیاب گلوله‌ای صنعتی
                        </h3>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                          <p>
                            آسیاب گلوله‌ای یکی از حیاتی‌ترین تجهیزات در صنایع معدن، سیمان، 
                            سرامیک و شیمیایی است که برای کاهش اندازه مواد جامد استفاده می‌شود.
                          </p>
                          <p>
                            این تجهیز بر اساس اصل ضربه و سایش کار می‌کند، جایی که گلوله‌های 
                            فولادی درون استوانه چرخان، مواد را خرد کرده و به اندازه مطلوب می‌رسانند.
                          </p>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">کاربردهای صنعتی:</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• صنایع معدن: آسیاب سنگ‌های معدنی</li>
                              <li>• صنعت سیمان: آسیاب کلینکر و مواد اولیه</li>
                              <li>• صنایع سرامیک: تهیه پودرهای ریز</li>
                              <li>• صنایع شیمیایی: تولید مواد پودری</li>
                            </ul>
                          </div>
                        </div>
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1583737097428-af53774819a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWFjaGluZXJ5JTIwYmx1ZXByaW50JTIwZW5naW5lZXJpbmd8ZW58MXx8fHwxNzU5NTI3NjkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Industrial Machinery Blueprint"
                          className="w-full rounded-lg shadow-md mt-4"
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">
                          نحوه استفاده
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              text: "پارامترهای مورد نیاز را در فرم وارد کنید",
                              detail: "یا از پایگاه داده مواد استفاده کنید"
                            },
                            {
                              text: "محاسبات پیشرفته را انجام دهید",
                              detail: "شامل تحلیل توان، اقتصادی و ایمنی"
                            },
                            {
                              text: "نتایج تفصیلی را بررسی کنید",
                              detail: "نمودارها، جداول و تحلیل‌های کامل"
                            },
                            {
                              text: "گزارش حرفه‌ای تهیه کنید",
                              detail: "خروجی PDF، Excel و قابلیت چاپ"
                            },
                            {
                              text: "توصیه‌های مهندسی را مطالعه کنید",
                              detail: "بهینه‌سازی و نکات عملیاتی"
                            },
                          ].map((step, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                                {index + 1}
                              </div>
                              <div>
                                <p className="text-gray-800 font-medium">
                                  {step.text}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                  {step.detail}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-gray-800">
                        توضیح پارامترها
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(parameterInfo).map(
                          ([key, info]) => {
                            const IconComponent = info.icon;
                            return (
                              <Card
                                key={key}
                                className="p-4 border-l-4 border-l-blue-500"
                              >
                                <div className="flex items-start gap-3">
                                  <IconComponent className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                      {info.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {info.description}
                                    </p>
                                    <div className="flex gap-4 text-xs text-gray-500">
                                      <span>
                                        واحد: {info.unit}
                                      </span>
                                      <span>
                                        محدوده: {info.range}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            );
                          },
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Alert className="border-blue-200 bg-blue-50">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">
                          ویژگی‌های حرفه‌ای
                        </AlertTitle>
                        <AlertDescription className="text-blue-700">
                          این نرم‌افزار شامل محاسبات پیشرفته Bond Work Index، تحلیل اقتصادی، 
                          ارزیابی ایمنی، پایگاه داده ۱۰ ماده معدنی متداول و قابلیت تولید 
                          گزارش‌های تخصصی مهندسی است.
                        </AlertDescription>
                      </Alert>

                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">
                          اعتبار علمی
                        </AlertTitle>
                        <AlertDescription className="text-green-700">
                          فرمول‌ها و روش‌های محاسباتی بر اساس استانداردهای بین‌المللی 
                          مهندسی معدن، کتاب‌های مرجع Bond و Rowland، و تجربیات صنعتی 
                          به‌روزرسانی شده‌اند.
                        </AlertDescription>
                      </Alert>

                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-800">
                          توصیه مهندسی
                        </AlertTitle>
                        <AlertDescription className="text-yellow-700">
                          نتایج این محاسبه‌گر برای طراحی اولیه و ارزیابی‌های مقدماتی مناسب است. 
                          برای طراحی نهایی و تصمیم‌گیری‌های سرمایه‌گذاری، حتماً با مهندسان 
                          متخصص مشورت کنید.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}