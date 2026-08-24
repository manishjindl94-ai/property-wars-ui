import React from 'react';
import { CurrencyText } from './CurrencyText';

export function MetricCard({
  label,
  value,
  isCurrency = true,
  subtext = null,
  badge = null,
  badgeType = 'green',
  icon: Icon = null,
  variant = 'default', // 'liquid' | 'equity' | 'networth' | 'default'
  className = ''
}) {
  const variantClass = 
    variant === 'liquid' ? 'highlight-liquid' :
    variant === 'equity' ? 'highlight-equity' :
    variant === 'networth' ? 'highlight-networth' : '';

  return (
    <div className={`metric-card ${variantClass} ${className}`}>
      <div className="metric-header">
        <div className="metric-label">
          {Icon && <Icon size={14} className="opacity-70" />}
          <span>{label}</span>
        </div>
        {badge && (
          <span className={`pill-badge ${badgeType}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="metric-value">
        {isCurrency ? (
          <CurrencyText amount={value} size="large" />
        ) : (
          <span>{value}</span>
        )}
      </div>

      {subtext && (
        <div className="metric-subtext">
          {subtext}
        </div>
      )}
    </div>
  );
}
