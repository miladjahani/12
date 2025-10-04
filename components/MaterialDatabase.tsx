import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Database, Search, Star } from 'lucide-react';
import { Input } from './ui/input';

// Comprehensive material database based on industry standards
export const materialDatabase = {
  'iron-ore': {
    name: 'سنگ آهن (Iron Ore)',
    category: 'فلزات',
    Wi: 13.0,
    Sg: 3.2,
    hardness: 'متوسط',
    description: 'سنگ آهن معمولی با درجه متوسط',
    recommendedK: 380,
    grindability: 'متوسط',
    abrasiveness: 'بالا'
  },
  'copper-ore': {
    name: 'سنگ مس (Copper Ore)',
    category: 'فلزات',
    Wi: 12.7,
    Sg: 2.8,
    hardness: 'متوسط',
    description: 'سنگ مس سولفیدی',
    recommendedK: 400,
    grindability: 'خوب',
    abrasiveness: 'متوسط'
  },
  'gold-ore': {
    name: 'سنگ طلا (Gold Ore)',
    category: 'فلزات گرانبها',
    Wi: 14.8,
    Sg: 2.7,
    hardness: 'سخت',
    description: 'سنگ طلا کوارتزی',
    recommendedK: 420,
    grindability: 'متوسط',
    abrasiveness: 'بالا'
  },
  'limestone': {
    name: 'سنگ آهک (Limestone)',
    category: 'غیرفلزی',
    Wi: 11.6,
    Sg: 2.7,
    hardness: 'نرم',
    description: 'سنگ آهک برای صنعت سیمان',
    recommendedK: 350,
    grindability: 'عالی',
    abrasiveness: 'کم'
  },
  'cement-clinker': {
    name: 'کلینکر سیمان (Cement Clinker)',
    category: 'ساختمانی',
    Wi: 13.5,
    Sg: 3.1,
    hardness: 'سخت',
    description: 'کلینکر سیمان پرتلند',
    recommendedK: 440,
    grindability: 'متوسط',
    abrasiveness: 'بالا'
  },
  'quartz': {
    name: 'کوارتز (Quartz)',
    category: 'صنعتی',
    Wi: 13.6,
    Sg: 2.65,
    hardness: 'سخت',
    description: 'کوارتز خالص',
    recommendedK: 450,
    grindability: 'سخت',
    abrasiveness: 'خیلی بالا'
  },
  'barite': {
    name: 'باریت (Barite)',
    category: 'صنعتی',
    Wi: 4.7,
    Sg: 4.3,
    hardness: 'نرم',
    description: 'باریت برای حفاری',
    recommendedK: 280,
    grindability: 'عالی',
    abrasiveness: 'کم'
  },
  'phosphate': {
    name: 'فسفات (Phosphate Rock)',
    category: 'کود',
    Wi: 9.8,
    Sg: 2.9,
    hardness: 'نرم',
    description: 'سنگ فسفات برای کود',
    recommendedK: 320,
    grindability: 'خوب',
    abrasiveness: 'متوسط'
  },
  'coal': {
    name: 'زغال سنگ (Coal)',
    category: 'سوخت',
    Wi: 11.4,
    Sg: 1.3,
    hardness: 'نرم',
    description: 'زغال سنگ بیتومینوس',
    recommendedK: 300,
    grindability: 'عالی',
    abrasiveness: 'کم'
  },
  'gypsum': {
    name: 'گچ (Gypsum)',
    category: 'ساختمانی',
    Wi: 6.7,
    Sg: 2.3,
    hardness: 'خیلی نرم',
    description: 'گچ طبیعی',
    recommendedK: 250,
    grindability: 'عالی',
    abrasiveness: 'خیلی کم'
  }
};

interface MaterialDatabaseProps {
  onMaterialSelect: (material: any) => void;
}

export default function MaterialDatabase({ onMaterialSelect }: MaterialDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'فلزات', 'غیرفلزی', 'ساختمانی', 'صنعتی', 'کود', 'سوخت', 'فلزات گرانبها'];

  const filteredMaterials = Object.entries(materialDatabase).filter(([key, material]) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getHardnessColor = (hardness: string) => {
    switch (hardness) {
      case 'خیلی نرم': return 'bg-green-100 text-green-800';
      case 'نرم': return 'bg-blue-100 text-blue-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'سخت': return 'bg-orange-100 text-orange-800';
      case 'خیلی سخت': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrindabilityIcon = (grindability: string) => {
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
          پایگاه داده مواد معدنی
        </CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجوی ماده..."
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map(([key, material]) => (
            <Card 
              key={key} 
              className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
              onClick={() => onMaterialSelect({ key, ...material })}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{material.name}</h4>
                    <p className="text-sm text-gray-600">{material.description}</p>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{material.category}</Badge>
                    <Badge className={getHardnessColor(material.hardness)}>
                      {material.hardness}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Wi:</span>
                      <span className="font-medium ml-1">{material.Wi}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Sg:</span>
                      <span className="font-medium ml-1">{material.Sg}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <span>قابلیت آسیاب:</span>
                      <div className="flex gap-1">
                        {getGrindabilityIcon(material.grindability)}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <div>ساینده بودن: {material.abrasiveness}</div>
                    <div>K پیشنهادی: {material.recommendedK}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredMaterials.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            هیچ ماده‌ای با این معیارها یافت نشد.
          </div>
        )}
      </CardContent>
    </Card>
  );
}