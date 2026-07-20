import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ProjectFormProps {
  onSubmit: (data: any) => void;
}

export const ProjectForm = ({ onSubmit }: ProjectFormProps) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      projectName: 'تعویض پمپ‌های انتقال فرآیند لیچینگ و ارتقای خط',
      lifespan: '5',
      domesticCapex: '1200000000', // 1.2 Billion Toman / Rial
      foreignCapex: '65000', // 65k USD
      installationCost: '200000000',
      infrastructure: '150000000',
      laborCost: '180000000',
      energyCost: '120000000',
      domesticParts: '90000000',
      foreignParts: '12000',
      baseExchangeRate: '600000',
      discountRate: '30',
      inflationRate: '40',
      delayRisk: '15',
      // Operational and Metallurgical Params
      dailyTonnage: '5000',
      oreGrade: '0.45',
      targetRecovery: '65',
      kineticA: '70',
      kineticB: '0.1'
    }
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">ثبت اطلاعات پروژه و پارامترهای فنی/اقتصادی</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="general">مشخصات کلی</TabsTrigger>
            <TabsTrigger value="technical">پارامترهای متالورژیکی</TabsTrigger>
            <TabsTrigger value="capex">سرمایه‌گذاری (CAPEX)</TabsTrigger>
            <TabsTrigger value="opex">هزینه‌های جاری (OPEX)</TabsTrigger>
            <TabsTrigger value="economic">متغیرهای کلان</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات پایه پروژه</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">نام پروژه عملیاتی / بهینه‌سازی</Label>
                    <Input id="projectName" {...register("projectName")} placeholder="مثلاً: تعویض پمپ‌های لیچینگ" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lifespan">عمر مفید پروژه (سال)</Label>
                    <Input id="lifespan" {...register("lifespan")} type="number" required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle>پارامترهای عملیاتی و متالورژیکی هیپ لیچینگ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyTonnage">ظرفیت سنگ‌شکنی و باردهی روزانه (تن/روز)</Label>
                    <Input id="dailyTonnage" {...register("dailyTonnage")} type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oreGrade">عیار مس سنگ معدن (%)</Label>
                    <Input id="oreGrade" {...register("oreGrade")} type="number" step="0.01" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetRecovery">درصد بازیابی هدف (%)</Label>
                    <Input id="targetRecovery" {...register("targetRecovery")} type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kineticA">ضریب کینتیک a (%)</Label>
                    <Input id="kineticA" {...register("kineticA")} type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kineticB">ضریب کینتیک b (1/روز)</Label>
                    <Input id="kineticB" {...register("kineticB")} type="number" step="0.01" required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capex">
            <Card>
              <CardHeader>
                <CardTitle>هزینه‌های سرمایه‌ای (CAPEX)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="domesticCapex">سرمایه داخلی (ریال)</Label>
                    <Input id="domesticCapex" {...register("domesticCapex")} type="number" placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foreignCapex">سرمایه ارزی (USD)</Label>
                    <Input id="foreignCapex" {...register("foreignCapex")} type="number" placeholder="0" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="installationCost">هزینه نصب و راه‌اندازی (ریال)</Label>
                    <Input id="installationCost" {...register("installationCost")} type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="infrastructure">زیرساخت و آماده‌سازی (ریال)</Label>
                    <Input id="infrastructure" {...register("infrastructure")} type="number" placeholder="0" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opex">
            <Card>
              <CardHeader>
                <CardTitle>هزینه‌های عملیاتی سالانه (OPEX)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="laborCost">نیروی انسانی (ریال/سال)</Label>
                    <Input id="laborCost" {...register("laborCost")} type="number" placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="energyCost">انرژی و سوخت (ریال/سال)</Label>
                    <Input id="energyCost" {...register("energyCost")} type="number" placeholder="0" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="domesticParts">قطعات یدکی داخلی (ریال/سال)</Label>
                    <Input id="domesticParts" {...register("domesticParts")} type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foreignParts">قطعات یدکی ارزی (USD/سال)</Label>
                    <Input id="foreignParts" {...register("foreignParts")} type="number" placeholder="0" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="economic">
            <Card>
              <CardHeader>
                <CardTitle>متغیرهای اقتصادی و ریسک</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseExchangeRate">نرخ پایه ارز (ریال/دلار)</Label>
                    <Input id="baseExchangeRate" {...register("baseExchangeRate")} type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountRate">نرخ تنزیل (%)</Label>
                    <Input id="discountRate" {...register("discountRate")} type="number" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inflationRate">نرخ تورم سالانه (%)</Label>
                    <Input id="inflationRate" {...register("inflationRate")} type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delayRisk">احتمال تأخیر در تأمین (%)</Label>
                    <Input id="delayRisk" {...register("delayRisk")} type="number" />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                    محاسبه و تحلیل پروژه
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};
