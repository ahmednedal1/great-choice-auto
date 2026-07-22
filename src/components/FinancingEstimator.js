"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

export default function FinancingEstimator({ price }) {
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.1));
  const [term, setTerm] = useState(60); // months
  const [rate, setRate] = useState(7.9); // annual %

  const principal = Math.max(price - downPayment, 0);
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / term
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

  return (
    <div className="p-5 rounded-2xl border-2 border-brand-blue/30 bg-[var(--surface)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center">
          <Calculator size={16} className="text-brand-blue" />
        </div>
        <p className="font-display font-semibold text-lg">
          Estimate Your Payment
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--text-secondary)]">Down payment</span>
            <span className="font-semibold">
              ${downPayment.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={price}
            step={500}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--text-secondary)]">Loan term</span>
            <span className="font-semibold">{term} months</span>
          </div>
          <input
            type="range"
            min={24}
            max={84}
            step={12}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--text-secondary)]">
              Est. interest rate
            </span>
            <span className="font-semibold">{rate}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--border)] text-center">
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
          Estimated Monthly Payment
        </p>
        <p className="font-display font-bold text-3xl text-brand-red mt-1">
          ${monthlyPayment.toFixed(0)}
          <span className="text-sm text-[var(--text-secondary)] font-body">
            /mo
          </span>
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-2">
          Estimate only, not a financing offer. Actual rate depends on credit
          approval.
        </p>
      </div>
    </div>
  );
}
