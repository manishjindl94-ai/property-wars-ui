import React from 'react';

/**
 * CurrencyText - Standardized Indian Rupee (₹) formatted display.
 */
export function CurrencyText({ 
  amount = 0, 
  prefix = '₹', 
  suffix = '', 
  color = 'inherit',
  size = 'normal',
  showSign = false,
  className = '' 
}) {
  const isPositive = amount > 0;
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const formatted = absAmount.toLocaleString('en-IN');

  const sign = showSign ? (isPositive ? '+' : isNegative ? '-' : '') : (isNegative ? '-' : '');

  const sizeClass = size === 'large' ? 'text-2xl font-bold' : size === 'small' ? 'text-xs' : 'text-sm font-semibold';

  return (
    <span 
      className={`font-mono inline-flex items-baseline gap-0.5 ${sizeClass} ${className}`}
      style={{ color: color !== 'inherit' ? color : undefined }}
    >
      <span className="opacity-80 select-none font-sans font-normal">{sign}{prefix}</span>
      <span>{formatted}</span>
      {suffix && <span className="text-xs opacity-75 font-normal ml-0.5">{suffix}</span>}
    </span>
  );
}
