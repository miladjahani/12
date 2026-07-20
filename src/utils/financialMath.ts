/**
 * Financial Calculation Utilities for Mining Economics
 */

export interface CashFlow {
  year: number;
  amount: number;
  discountRate: number;
}

/**
 * Calculate Net Present Value (NPV) with variable yearly discount rates
 * NPV = Sum [ CF_t / Product_{i=1}^t (1 + r_i) ]
 */
export const calculateNPV = (cashFlows: number[], discountRates: number[]): number => {
  let npv = 0;
  let cumulativeDiscountFactor = 1;

  for (let t = 0; t < cashFlows.length; t++) {
    // For year 0, we don't apply discount rate if it's the initial investment
    if (t > 0) {
      cumulativeDiscountFactor *= (1 + discountRates[t] || discountRates[discountRates.length - 1]);
    }
    npv += cashFlows[t] / cumulativeDiscountFactor;
  }

  return npv;
};

/**
 * Calculate Internal Rate of Return (IRR) using Newton-Raphson method
 */
export const calculateIRR = (cashFlows: number[], initialGuess: number = 0.1): number | null => {
  const maxIterations = 1000;
  const precision = 0.000001;
  let irr = initialGuess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dNPV = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + irr, t);
      if (t > 0) {
        dNPV -= t * cashFlows[t] / Math.pow(1 + irr, t + 1);
      }
    }

    const nextIrr = irr - npv / dNPV;

    if (Math.abs(nextIrr - irr) < precision) {
      return nextIrr;
    }

    irr = nextIrr;
  }

  return null; // Did not converge
};

/**
 * Calculate Payback Period
 */
export const calculatePaybackPeriod = (cashFlows: number[]): number | null => {
  let cumulativeCashFlow = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    const prevCumulative = cumulativeCashFlow;
    cumulativeCashFlow += cashFlows[t];

    if (cumulativeCashFlow >= 0 && t > 0) {
      // Linear interpolation for more precision
      return t - 1 + (Math.abs(prevCumulative) / cashFlows[t]);
    }
  }
  return null;
};

/**
 * Sensitivity Analysis Matrix
 * Computes the impact of +/- 10%, 20%, and 30% shifts in:
 * (a) Foreign Exchange Rate
 * (b) Fuel and Energy Costs
 */
export const calculateSensitivityMatrix = (
  baseNPV: number,
  baseFX: number,
  baseEnergy: number,
  calculateNPVWithParams: (fx: number, energy: number) => number
) => {
  const shifts = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3];
  const matrix: { shift: number; fxNPV: number; energyNPV: number }[] = [];

  shifts.forEach(shift => {
    const fxNPV = calculateNPVWithParams(baseFX * (1 + shift), baseEnergy);
    const energyNPV = calculateNPVWithParams(baseFX, baseEnergy * (1 + shift));
    matrix.push({
      shift: shift * 100,
      fxNPV,
      energyNPV
    });
  });

  return matrix;
};

/**
 * Mock AI Risk Advisory
 */
export const evaluateQualitativeRisk = (description: string) => {
  // Simulate AI processing time or logic
  const seed = description.length;
  const riskMultiplier = 0.8 + (seed % 41) / 100; // 0.80 to 1.20
  const confidenceScore = 0.7 + (seed % 21) / 100; // 0.70 to 0.90

  const justifications = [
    "با توجه به نوسانات اخیر نرخ ارز و محدودیت‌های ثبت سفارش، ریسک تأخیر در تأمین قطعات بحرانی بالاست.",
    "تحلیل زنجیره تأمین نشان‌دهنده پتانسیل گلوگاه در گمرک ورودی است که می‌تواند هزینه‌های انبارداری را افزایش دهد.",
    "پیش‌بینی تورم در بخش انرژی حاکی از افزایش هزینه‌های عملیاتی در نیمه دوم سال پروژه است.",
    "وضعیت فعلی تأمین‌کنندگان داخلی نشان‌دهنده پایداری نسبی در قیمت قطعات مصرفی غیرارزی است."
  ];

  const justification = justifications[seed % justifications.length];

  return {
    riskMultiplier: parseFloat(riskMultiplier.toFixed(2)),
    confidenceScore: parseFloat(confidenceScore.toFixed(2)),
    justification
  };
};
