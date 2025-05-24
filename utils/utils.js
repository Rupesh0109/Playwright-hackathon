export function calculateEMI(P, annualRate, n) {
    const r = annualRate / 12 / 100;
    const numerator = P * r * Math.pow(1 + r, n);
    const denominator = Math.pow(1 + r, n) - 1;
    return numerator / denominator;
  }

export function calculateTotalInterest(emi, n, P) {
    return (emi * n) - P;
  }