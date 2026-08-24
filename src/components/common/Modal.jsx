import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  icon: Icon = null,
  children,
  footer = null,
  maxWidth = '580px',
  id = 'modal'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      id={`${id}-backdrop`}
    >
      <div 
        className="modal-card"
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
        id={id}
      >
        <div className="modal-header">
          <div className="modal-title">
            {Icon && <Icon size={20} className="text-emerald-400" />}
            <span>{title}</span>
          </div>
          {onClose && (
            <button 
              className="btn-ghost"
              style={{ padding: '0.35rem', borderRadius: '50%' }}
              onClick={onClose}
              aria-label="Close modal"
              id={`${id}-close-btn`}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
