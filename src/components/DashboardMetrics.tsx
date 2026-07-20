import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { cn } from "@/components/ui/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  color?: string;
}

export const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  description,
  color = "indigo"
}: MetricCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            `bg-${color}-100 text-${color}-600 dark:bg-${color}-900/30 dark:text-${color}-400`
          )}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend === 'up' ? "text-emerald-600" : "text-rose-600"
            )}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-slate-500 text-sm font-medium mb-1 dark:text-slate-400">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
            {unit && <span className="text-slate-500 text-sm dark:text-slate-400">{unit}</span>}
          </div>
          {description && (
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {children}
  </div>
);
