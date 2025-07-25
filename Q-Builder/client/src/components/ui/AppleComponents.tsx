import React from 'react';

// Apple-style Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    destructive: 'btn-destructive',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="loading-spinner w-5 h-5 ml-2" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// Apple-style Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  return (
    <div className={`card ${hover ? 'hover:shadow-md hover:-translate-y-0.5' : ''} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`card-header ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <h3 className={`card-title ${className}`}>{children}</h3>;
};

export const CardSubtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <p className={`card-subtitle ${className}`}>{children}</p>;
};

// Apple-style Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <input
        className={`form-input ${error ? 'border-error-500 focus:border-error-500' : ''} ${className}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {helperText && !error && (
        <div className="text-caption mt-1">{helperText}</div>
      )}
    </div>
  );
};

// Apple-style Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
          </div>
        )}
        <div className="modal-content">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
};

// Apple-style Status Badge Component
interface StatusBadgeProps {
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'active' | 'completed' | 'cancelled';
  children: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  return <span className={`status-indicator ${status}`}>{children}</span>;
};

// Apple-style Switch Component
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-3">
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="switch-slider"></span>
      </label>
      {label && (
        <span className={`text-body ${disabled ? 'text-text-tertiary' : 'text-text-primary'}`}>
          {label}
        </span>
      )}
    </div>
  );
};

// Apple-style Segmented Control Component
interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className="segmented-control">
      {options.map((option) => (
        <button
          key={option.value}
          className={`segmented-control-item ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Apple-style Loading Skeleton Component
interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
}) => {
  return (
    <div
      className={`loading-skeleton ${className}`}
      style={{ width, height }}
    />
  );
};

// Apple-style Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

// Apple-style List Item Component
interface ListItemProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  action,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`list-item ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="list-item-content">
        <div className="list-item-title">{title}</div>
        {subtitle && <div className="list-item-subtitle">{subtitle}</div>}
      </div>
      {action && <div className="list-item-action">{action}</div>}
    </div>
  );
};

// Apple-style Avatar Component
interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`avatar ${size} ${className}`}>
      {src ? (
        <img src={src} alt={alt || name} />
      ) : (
        <span>{name ? getInitials(name) : '?'}</span>
      )}
    </div>
  );
};

// Apple-style Notification Component
interface NotificationProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  type = 'info',
  title,
  message,
  onClose,
}) => {
  return (
    <div className={`notification ${type}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-text-primary mb-1">{title}</h4>
          {message && <p className="text-sm text-text-secondary">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Apple-style Progress Bar Component
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`progress-bar ${className}`}>
      <div
        className="progress-bar-fill"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Apple-style Badge Component
interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
}) => {
  return <span className={`badge ${variant} ${className}`}>{children}</span>;
};

// Apple-style Divider Component
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  return (
    <div className={`divider ${orientation === 'vertical' ? 'vertical' : ''} ${className}`} />
  );
};

// Apple-style Tabs Component
interface TabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content p-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// Export all components
export default {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  Input,
  Modal,
  StatusBadge,
  Switch,
  SegmentedControl,
  Skeleton,
  EmptyState,
  ListItem,
  Avatar,
  Notification,
  ProgressBar,
  Badge,
  Divider,
  Tabs,
};