import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/components/ui/utils";

interface SensitivityTableProps {
  data: { shift: number; fxNPV: number; energyNPV: number }[];
}

export const SensitivityTable = ({ data }: SensitivityTableProps) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(val);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ماتریس تحلیل حساسیت NPV</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">درصد تغییر متغیر</TableHead>
              <TableHead className="text-right">تغییر نرخ ارز (FX)</TableHead>
              <TableHead className="text-right">تغییر هزینه انرژی و سوخت</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.shift}>
                <TableCell className="font-medium text-right">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    row.shift > 0 ? "bg-amber-100 text-amber-700" : row.shift < 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                  )}>
                    {row.shift > 0 ? '+' : ''}{row.shift}%
                  </span>
                </TableCell>
                <TableCell className={cn(
                  "text-right",
                  row.fxNPV < 0 ? "text-rose-600" : "text-emerald-600"
                )}>
                  {formatCurrency(row.fxNPV)}
                </TableCell>
                <TableCell className={cn(
                  "text-right",
                  row.energyNPV < 0 ? "text-rose-600" : "text-emerald-600"
                )}>
                  {formatCurrency(row.energyNPV)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          * ارقام بر اساس واحد پولی ریال محاسبه شده‌اند. مقادیر مثبت نشان‌دهنده سودآوری پروژه در شرایط تغییر متغیر است.
        </p>
      </CardContent>
    </Card>
  );
};
