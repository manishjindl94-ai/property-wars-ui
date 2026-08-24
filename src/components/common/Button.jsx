import React from 'react';

export function Button({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'gold' | 'secondary' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  disabled = false,
  icon: Icon = null,
  iconRight: IconRight = null,
  className = '',
  type = 'button',
  id = undefined,
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const sizeStyle = size === 'sm' ? { padding: '0.4rem 0.8rem', fontSize: '0.78rem' } : size === 'lg' ? { padding: '0.85rem 1.6rem', fontSize: '1rem' } : {};

  return (
    <button
      id={id}
      type={type}
      className={`btn ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={sizeStyle}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      <span>{children}</span>
      {IconRight && <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
    </button>
  );
}
