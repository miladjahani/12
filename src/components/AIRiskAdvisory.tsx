import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { evaluateQualitativeRisk } from '@/utils/financialMath';

interface AIRiskAdvisoryProps {
  onRiskApplied?: (multiplier: number, justification: string) => void;
}

export const AIRiskAdvisory = ({ onRiskApplied }: AIRiskAdvisoryProps) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = evaluateQualitativeRisk(description);
    setResult(analysis);
    setIsLoading(false);

    if (onRiskApplied) {
      onRiskApplied(analysis.riskMultiplier, analysis.justification);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-indigo-100 bg-indigo-50/30 dark:border-indigo-900/30 dark:bg-indigo-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300">
            <Sparkles className="w-5 h-5" />
            مشاوره هوشمند ریسک (AI Advisor)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            شرح ریسک‌های کیفی پروژه (مانند چالش‌های گمرکی، تأمین قطعات خاص، یا تغییرات مدیریتی) را وارد کنید تا هوش مصنوعی اثر آن‌ها را بر مدل مالی تخمین بزند.
          </p>
          <Textarea
            placeholder="مثلاً: احتمال تأخیر در ترخیص پروفرمای قطعات از گمرک بندرعباس به دلیل تغییر بخشنامه‌ها..."
            className="min-h-[120px] bg-white dark:bg-slate-900"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleAnalyze}
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال تحلیل...
              </>
            ) : (
              'تحلیل هوشمند ریسک'
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${result.riskMultiplier > 1 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {result.riskMultiplier > 1 ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">نتیجه ارزیابی کیفی</h4>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
                    ضریب اطمینان: {Math.round(result.confidenceScore * 100)}%
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {result.justification}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="text-center p-3 bg-slate-50 rounded-lg flex-1 dark:bg-slate-800">
                    <div className="text-xs text-slate-500 mb-1">ضریب ریسک (Rm)</div>
                    <div className={`text-lg font-bold ${result.riskMultiplier > 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {result.riskMultiplier}x
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg flex-1 dark:bg-slate-800">
                    <div className="text-xs text-slate-500 mb-1">اثر بر هزینه‌ها</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {Math.abs(Math.round((result.riskMultiplier - 1) * 100))}% {result.riskMultiplier > 1 ? 'افزایش' : 'کاهش'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
