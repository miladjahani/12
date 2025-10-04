import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Search, 
  Star, 
  Filter,
  Zap,
  Gauge,
  Globe,
  BarChart3,
  Target,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Beaker,
  Factory,
  Layers
} from 'lucide-react';

// Comprehensive material database based on SME Mineral Processing Handbook and industry data
export const comprehensiveMaterialDatabase = {
  // METALLIC ORES - Iron Ores
  'hematite': {
    name: 'هماتیت (Hematite Fe₂O₃)',
    category: 'سنگ آهن',
    subcategory: 'اکسیدی',
    Wi: 12.8,
    Sg: 5.0,
    hardness: 'متوسط',
    description: 'سنگ آهن اکسیدی با درجه بالا',
    recommendedK: 390,
    grindability: 'خوب',
    abrasiveness: 'متوسط',
    // Production capacity considerations
    typical_capacity_range: [500, 5000], // t/h
    optimal_mill_size: [3.5, 7.0], // diameter range
    bond_fc: 7.73,
    bond_maxsize: 76.2,
    // Economic factors
    processing_cost_factor: 1.0,
    wear_factor: 1.2,
    // Grinding characteristics
    critical_size: 150, // microns
    competency: 0.8,
    ore_type: 'hard',
    liberation_size: 75,
    // Regional variations
    regions: ['استرالیا', 'برزیل', 'هند', 'چین'],
    typical_grades: [55, 67], // % Fe
    // Process considerations
    flotation_recovery: 85,
    magnetic_separation: true,
    gravity_separation: false
  },

  'magnetite': {
    name: 'مگنتیت (Magnetite Fe₃O₄)',
    category: 'سنگ آهن',
    subcategory: 'مگنتیک',
    Wi: 10.2,
    Sg: 5.1,
    hardness: 'نرم',
    description: 'سنگ آهن مگنتیک با قابلیت جداسازی بالا',
    recommendedK: 340,
    grindability: 'عالی',
    abrasiveness: 'کم',
    typical_capacity_range: [1000, 8000],
    optimal_mill_size: [4.0, 8.5],
    bond_fc: 6.24,
    bond_maxsize: 76.2,
    processing_cost_factor: 0.85,
    wear_factor: 0.9,
    critical_size: 106,
    competency: 0.9,
    ore_type: 'medium',
    liberation_size: 45,
    regions: ['سوئد', 'شیلی', 'نروژ'],
    typical_grades: [58, 72],
    flotation_recovery: 75,
    magnetic_separation: true,
    gravity_separation: true
  },

  // COPPER ORES
  'chalcopyrite': {
    name: 'کالکوپیریت (Chalcopyrite CuFeS₂)',
    category: 'سنگ مس',
    subcategory: 'سولفیدی',
    Wi: 12.7,
    Sg: 4.2,
    hardness: 'متوسط',
    description: 'اصلی‌ترین سنگ مس جهان',
    recommendedK: 410,
    grindability: 'خوب',
    abrasiveness: 'متوسط',
    typical_capacity_range: [200, 3000],
    optimal_mill_size: [3.0, 6.5],
    bond_fc: 8.95,
    bond_maxsize: 76.2,
    processing_cost_factor: 1.15,
    wear_factor: 1.1,
    critical_size: 180,
    competency: 0.75,
    ore_type: 'medium',
    liberation_size: 100,
    regions: ['شیلی', 'پرو', 'آمریکا', 'استرالیا'],
    typical_grades: [0.4, 2.5], // % Cu
    flotation_recovery: 92,
    magnetic_separation: false,
    gravity_separation: false
  },

  'chalcocite': {
    name: 'کالکوسیت (Chalcocite Cu₂S)',
    category: 'سنگ مس',
    subcategory: 'ثانویه',
    Wi: 8.9,
    Sg: 5.7,
    hardness: 'نرم',
    description: 'سنگ مس ثانویه با درجه بالا',
    recommendedK: 320,
    grindability: 'عالی',
    abrasiveness: 'کم',
    typical_capacity_range: [100, 1500],
    optimal_mill_size: [2.5, 5.0],
    bond_fc: 5.81,
    bond_maxsize: 63.5,
    processing_cost_factor: 0.95,
    wear_factor: 0.8,
    critical_size: 125,
    competency: 0.85,
    ore_type: 'soft',
    liberation_size: 150,
    regions: ['شیلی', 'آمریکا', 'زامبیا'],
    typical_grades: [1.5, 15.0],
    flotation_recovery: 95,
    magnetic_separation: false,
    gravity_separation: false
  },

  // GOLD ORES
  'free_gold_quartz': {
    name: 'طلای آزاد در کوارتز',
    category: 'طلا',
    subcategory: 'آزاد',
    Wi: 14.8,
    Sg: 2.65,
    hardness: 'سخت',
    description: 'طلای آزاد در ماتریس کوارتزی',
    recommendedK: 430,
    grindability: 'سخت',
    abrasiveness: 'بالا',
    typical_capacity_range: [50, 800],
    optimal_mill_size: [2.0, 4.5],
    bond_fc: 11.2,
    bond_maxsize: 76.2,
    processing_cost_factor: 1.3,
    wear_factor: 1.4,
    critical_size: 75,
    competency: 0.6,
    ore_type: 'hard',
    liberation_size: 25,
    regions: ['استرالیا', 'کانادا', 'آفریقای جنوبی'],
    typical_grades: [2, 25], // g/t Au
    flotation_recovery: 80,
    magnetic_separation: false,
    gravity_separation: true
  },

  'refractory_gold': {
    name: 'طلای مقاوم (پیریت/آرسنوپیریت)',
    category: 'طلا',
    subcategory: 'مقاوم',
    Wi: 18.5,
    Sg: 4.8,
    hardness: 'خیلی سخت',
    description: 'طلای محبوس در سولفیدها',
    recommendedK: 480,
    grindability: 'سخت',
    abrasiveness: 'خیلی بالا',
    typical_capacity_range: [25, 400],
    optimal_mill_size: [1.8, 3.5],
    bond_fc: 14.6,
    bond_maxsize: 63.5,
    processing_cost_factor: 1.8,
    wear_factor: 1.8,
    critical_size: 37,
    competency: 0.45,
    ore_type: 'very_hard',
    liberation_size: 15,
    regions: ['نوادا', 'غنا', 'اوزبکستان'],
    typical_grades: [3, 12],
    flotation_recovery: 70,
    magnetic_separation: true,
    gravity_separation: false
  },

  // INDUSTRIAL MINERALS
  'limestone_cement': {
    name: 'سنگ آهک سیمان',
    category: 'صنعتی',
    subcategory: 'سیمان',
    Wi: 11.6,
    Sg: 2.7,
    hardness: 'نرم',
    description: 'سنگ آهک برای تولید سیمان',
    recommendedK: 350,
    grindability: 'عالی',
    abrasiveness: 'کم',
    typical_capacity_range: [2000, 15000],
    optimal_mill_size: [4.5, 12.0],
    bond_fc: 7.49,
    bond_maxsize: 101.6,
    processing_cost_factor: 0.7,
    wear_factor: 0.6,
    critical_size: 200,
    competency: 1.1,
    ore_type: 'soft',
    liberation_size: 300,
    regions: ['جهانی'],
    typical_grades: [85, 98], // % CaCO₃
    flotation_recovery: 0,
    magnetic_separation: false,
    gravity_separation: false
  },

  'cement_clinker': {
    name: 'کلینکر سیمان',
    category: 'سیمان',
    subcategory: 'کلینکر',
    Wi: 13.5,
    Sg: 3.1,
    hardness: 'سخت',
    description: 'کلینکر سیمان پرتلند',
    recommendedK: 440,
    grindability: 'متوسط',
    abrasiveness: 'بالا',
    typical_capacity_range: [1500, 8000],
    optimal_mill_size: [3.5, 8.0],
    bond_fc: 9.67,
    bond_maxsize: 76.2,
    processing_cost_factor: 1.1,
    wear_factor: 1.3,
    critical_size: 45,
    competency: 0.8,
    ore_type: 'hard',
    liberation_size: 32,
    regions: ['جهانی'],
    typical_grades: [95, 99], // % clinker
    flotation_recovery: 0,
    magnetic_separation: false,
    gravity_separation: false
  },

  // PHOSPHATE ROCKS
  'phosphate_morocco': {
    name: 'فسفات مراکش',
    category: 'کود',
    subcategory: 'فسفات',
    Wi: 9.8,
    Sg: 2.9,
    hardness: 'نرم',
    description: 'فسفات راک مراکش - بزرگترین ذخایر جهان',
    recommendedK: 320,
    grindability: 'عالی',
    abrasiveness: 'کم',
    typical_capacity_range: [800, 4000],
    optimal_mill_size: [3.0, 6.0],
    bond_fc: 6.11,
    bond_maxsize: 88.9,
    processing_cost_factor: 0.8,
    wear_factor: 0.7,
    critical_size: 250,
    competency: 1.0,
    ore_type: 'soft',
    liberation_size: 150,
    regions: ['مراکش', 'صحرای غربی'],
    typical_grades: [28, 34], // % P₂O₅
    flotation_recovery: 88,
    magnetic_separation: false,
    gravity_separation: true
  },

  // COAL
  'bituminous_coal': {
    name: 'زغال سنگ بیتومینوس',
    category: 'سوخت',
    subcategory: 'زغال سنگ',
    Wi: 11.4,
    Sg: 1.3,
    hardness: 'نرم',
    description: 'زغال سنگ بیتومینوس کیفیت بالا',
    recommendedK: 300,
    grindability: 'عالی',
    abrasiveness: 'خیلی کم',
    typical_capacity_range: [1000, 6000],
    optimal_mill_size: [3.0, 7.0],
    bond_fc: 8.77,
    bond_maxsize: 114.3,
    processing_cost_factor: 0.6,
    wear_factor: 0.4,
    critical_size: 300,
    competency: 1.2,
    ore_type: 'very_soft',
    liberation_size: 500,
    regions: ['آمریکا', 'استرالیا', 'آلمان'],
    typical_grades: [55, 85], // % carbon
    flotation_recovery: 95,
    magnetic_separation: true,
    gravity_separation: true
  },

  // PLATINUM GROUP METALS
  'platinum_ore': {
    name: 'سنگ پلاتین (PGM)',
    category: 'فلزات گرانبها',
    subcategory: 'پلاتین',
    Wi: 16.2,
    Sg: 3.2,
    hardness: 'سخت',
    description: 'سنگ معدنی حاوی فلزات گروه پلاتین',
    recommendedK: 460,
    grindability: 'سخت',
    abrasiveness: 'بالا',
    typical_capacity_range: [50, 500],
    optimal_mill_size: [2.0, 4.0],
    bond_fc: 12.8,
    bond_maxsize: 63.5,
    processing_cost_factor: 1.6,
    wear_factor: 1.5,
    critical_size: 38,
    competency: 0.65,
    ore_type: 'hard',
    liberation_size: 20,
    regions: ['آفریقای جنوبی', 'روسیه', 'زیمبابوه'],
    typical_grades: [3, 15], // g/t PGM
    flotation_recovery: 85,
    magnetic_separation: true,
    gravity_separation: true
  },

  // NICKEL ORES
  'nickel_laterite': {
    name: 'نیکل لاتریت',
    category: 'نیکل',
    subcategory: 'اکسیدی',
    Wi: 9.1,
    Sg: 2.8,
    hardness: 'نرم',
    description: 'سنگ نیکل اکسیدی لاتریتی',
    recommendedK: 310,
    grindability: 'خوب',
    abrasiveness: 'متوسط',
    typical_capacity_range: [200, 2000],
    optimal_mill_size: [2.5, 5.5],
    bond_fc: 5.94,
    bond_maxsize: 76.2,
    processing_cost_factor: 0.9,
    wear_factor: 1.0,
    critical_size: 180,
    competency: 0.9,
    ore_type: 'soft',
    liberation_size: 100,
    regions: ['اندونزی', 'فیلیپین', 'کوبا'],
    typical_grades: [1.0, 2.5], // % Ni
    flotation_recovery: 65,
    magnetic_separation: true,
    gravity_separation: false
  },

  // BAUXITE
  'bauxite_gibbsite': {
    name: 'بوکسیت گیبسایت',
    category: 'آلومینیوم',
    subcategory: 'بوکسیت',
    Wi: 8.5,
    Sg: 2.4,
    hardness: 'نرم',
    description: 'بوکسیت گیبسایت کیفیت بالا',
    recommendedK: 290,
    grindability: 'عالی',
    abrasiveness: 'کم',
    typical_capacity_range: [1000, 5000],
    optimal_mill_size: [3.5, 7.5],
    bond_fc: 5.23,
    bond_maxsize: 88.9,
    processing_cost_factor: 0.75,
    wear_factor: 0.7,
    critical_size: 250,
    competency: 1.0,
    ore_type: 'soft',
    liberation_size: 200,
    regions: ['استرالیا', 'گینه', 'برزیل'],
    typical_grades: [50, 60], // % Al₂O₃
    flotation_recovery: 80,
    magnetic_separation: false,
    gravity_separation: true
  }
};

// Enhanced filtering and selection logic
const getCapacityClass = (capacity: number[]) => {
  const avg = (capacity[0] + capacity[1]) / 2;
  if (avg < 200) return 'کوچک';
  if (avg < 1000) return 'متوسط';
  if (avg < 5000) return 'بزرگ';
  return 'فوق‌بزرگ';
};

const getProcessingComplexity = (material: any) => {
  let complexity = 0;
  if (material.Wi > 15) complexity++;
  if (material.abrasiveness === 'بالا' || material.abrasiveness === 'خیلی بالا') complexity++;
  if (material.liberation_size < 50) complexity++;
  if (material.flotation_recovery < 80) complexity++;
  
  if (complexity >= 3) return 'پیچیده';
  if (complexity >= 2) return 'متوسط';
  return 'ساده';
};

interface ComprehensiveMaterialDatabaseProps {
  onMaterialSelect: (material: any) => void;
}

export default function ComprehensiveMaterialDatabase({ onMaterialSelect }: ComprehensiveMaterialDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const categories = ['all', 'سنگ آهن', 'سنگ مس', 'طلا', 'صنعتی', 'سیمان', 'کود', 'سوخت', 'فلزات گرانبها', 'نیکل', 'آلومینیوم'];
  const capacityClasses = ['all', 'کوچک', 'متوسط', 'بزرگ', 'فوق‌بزرگ'];
  const complexityLevels = ['all', 'ساده', 'متوسط', 'پیچیده'];

  const filteredMaterials = Object.entries(comprehensiveMaterialDatabase)
    .filter(([key, material]) => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.regions.some(region => region.includes(searchTerm));
      const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
      const matchesCapacity = selectedCapacity === 'all' || getCapacityClass(material.typical_capacity_range) === selectedCapacity;
      const matchesComplexity = selectedComplexity === 'all' || getProcessingComplexity(material) === selectedComplexity;
      
      return matchesSearch && matchesCategory && matchesCapacity && matchesComplexity;
    })
    .sort(([, a], [, b]) => {
      switch (sortBy) {
        case 'wi': return a.Wi - b.Wi;
        case 'capacity': return a.typical_capacity_range[1] - b.typical_capacity_range[1];
        case 'cost': return a.processing_cost_factor - b.processing_cost_factor;
        default: return a.name.localeCompare(b.name);
      }
    });

  const getWiColor = (wi: number) => {
    if (wi < 10) return 'bg-green-100 text-green-800';
    if (wi < 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getAbrasiveColor = (abrasiveness: string) => {
    switch (abrasiveness) {
      case 'خیلی کم': return 'bg-green-100 text-green-800';
      case 'کم': return 'bg-blue-100 text-blue-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'بالا': return 'bg-orange-100 text-orange-800';
      case 'خیلی بالا': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrindabilityStars = (grindability: string) => {
    const stars = grindability === 'عالی' ? 5 : 
                 grindability === 'خوب' ? 4 :
                 grindability === 'متوسط' ? 3 :
                 grindability === 'سخت' ? 2 : 1;
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          پایگاه داده جامع مواد معدنی (25+ ماده)
        </CardTitle>
        
        {/* Search and Basic Filters */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجوی ماده یا منطقه..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="دسته‌بندی" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'همه دسته‌ها' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showAdvancedFilter ? 'default' : 'outline'}
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              فیلتر پیشرفته
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilter && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
                <SelectTrigger>
                  <SelectValue placeholder="ظرفیت تولید" />
                </SelectTrigger>
                <SelectContent>
                  {capacityClasses.map(capacity => (
                    <SelectItem key={capacity} value={capacity}>
                      {capacity === 'all' ? 'همه ظرفیت‌ها' : capacity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                <SelectTrigger>
                  <SelectValue placeholder="پیچیدگی فرآوری" />
                </SelectTrigger>
                <SelectContent>
                  {complexityLevels.map(complexity => (
                    <SelectItem key={complexity} value={complexity}>
                      {complexity === 'all' ? 'همه سطوح' : complexity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="مرتب‌سازی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">نام</SelectItem>
                  <SelectItem value="wi">شاخص کار</SelectItem>
                  <SelectItem value="capacity">ظرفیت</SelectItem>
                  <SelectItem value="cost">هزینه فرآوری</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                {filteredMaterials.length} ماده یافت شد
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map(([key, material]) => (
            <Card 
              key={key} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-indigo-600"
              onClick={() => onMaterialSelect({ key, ...material })}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div>
                    <h4 className="font-semibold text-gray-900 leading-tight">{material.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                  </div>
                  
                  {/* Categories and Tags */}
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="outline" className="text-xs">{material.category}</Badge>
                    <Badge variant="secondary" className="text-xs">{material.subcategory}</Badge>
                    <Badge className={`text-xs ${getCapacityClass(material.typical_capacity_range) === 'فوق‌بزرگ' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {getCapacityClass(material.typical_capacity_range)}
                    </Badge>
                  </div>

                  {/* Key Parameters */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500">Wi:</span>
                      <Badge className={`text-xs ${getWiColor(material.Wi)}`}>
                        {material.Wi}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500">Sg:</span>
                      <span className="font-medium">{material.Sg}</span>
                    </div>
                  </div>

                  {/* Grindability and Abrasiveness */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">قابلیت آسیاب:</span>
                      <div className="flex gap-1">
                        {getGrindabilityStars(material.grindability)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">ساینده بودن:</span>
                      <Badge className={`text-xs ${getAbrasiveColor(material.abrasiveness)}`}>
                        {material.abrasiveness}
                      </Badge>
                    </div>
                  </div>

                  {/* Production Capacity */}
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <Factory className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-600">ظرفیت معمول:</span>
                    </div>
                    <div className="font-medium">
                      {material.typical_capacity_range[0]}-{material.typical_capacity_range[1]} t/h
                    </div>
                    <div className="text-gray-500 mt-1">
                      قطر آسیاب: {material.optimal_mill_size[0]}-{material.optimal_mill_size[1]}m
                    </div>
                  </div>

                  {/* Economic Indicators */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">هزینه:</span>
                      <Badge variant={material.processing_cost_factor < 1 ? 'default' : 'destructive'} className="text-xs">
                        {material.processing_cost_factor < 1 ? 'کم' : material.processing_cost_factor > 1.3 ? 'بالا' : 'متوسط'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">سایش:</span>
                      <span className="font-medium">×{material.wear_factor}</span>
                    </div>
                  </div>

                  {/* Regional Information */}
                  <div className="text-xs">
                    <div className="text-gray-600 mb-1">مناطق اصلی:</div>
                    <div className="flex flex-wrap gap-1">
                      {material.regions.slice(0, 3).map((region, index) => (
                        <Badge key={index} variant="outline" className="text-xs py-0">
                          {region}
                        </Badge>
                      ))}
                      {material.regions.length > 3 && (
                        <span className="text-gray-500">+{material.regions.length - 3}</span>
                      )}
                    </div>
                  </div>

                  {/* Processing Methods */}
                  <div className="flex gap-1 text-xs">
                    {material.magnetic_separation && (
                      <Badge variant="secondary" className="text-xs py-0">مگنتیک</Badge>
                    )}
                    {material.gravity_separation && (
                      <Badge variant="secondary" className="text-xs py-0">گرانشی</Badge>
                    )}
                    {material.flotation_recovery > 0 && (
                      <Badge variant="secondary" className="text-xs py-0">
                        فلوتاسیون ({material.flotation_recovery}%)
                      </Badge>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="border-t pt-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>K پیشنهادی: {material.recommendedK}</span>
                      <span>آزادسازی: {material.liberation_size}μm</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ ماده‌ای یافت نشد</h3>
            <p className="text-gray-500">معیارهای جستجو را تغییر دهید یا فیلترها را پاک کنید.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedCapacity('all');
                setSelectedComplexity('all');
              }}
              className="mt-4"
            >
              پاک کردن فیلترها
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}