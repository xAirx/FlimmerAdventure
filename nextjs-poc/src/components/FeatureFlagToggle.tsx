import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface FeatureFlagToggleProps {
  flagKey: string;
  label: string;
  description?: string;
  defaultEnabled?: boolean;
  onChange?: (enabled: boolean) => void;
}

export const FeatureFlagToggle = ({
  flagKey,
  label,
  description,
  defaultEnabled = false,
  onChange,
}: FeatureFlagToggleProps) => {
  const [enabled, setEnabled] = useState<boolean>(defaultEnabled);

  // sync with localStorage to simulate remote config
  useEffect(() => {
    const stored = localStorage.getItem(`feature-flag:${flagKey}`);
    if (stored !== null) {
      setEnabled(stored === 'true');
    } else {
      setEnabled(defaultEnabled);
    }
  }, [flagKey, defaultEnabled]);

  const toggle = () => {
    const newVal = !enabled;
    setEnabled(newVal);
    localStorage.setItem(`feature-flag:${flagKey}`, newVal.toString());
    onChange?.(newVal);
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="pr-4">
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        onClick={toggle}
        className={clsx(
          'relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none',
          enabled ? 'bg-orange-600' : 'bg-gray-300'
        )}
      >
        <span
          className={clsx(
            'inline-block w-4 h-4 transform bg-white rounded-full translate-x-1 transition-transform duration-200',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}; 