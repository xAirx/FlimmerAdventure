import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface VersionSelectorProps {
  versions: string[]; // e.g. ['1.0.3', '1.1.0-beta']
  defaultVersion?: string;
  onChange?: (version: string) => void;
}

export const VersionSelector = ({ versions, defaultVersion, onChange }: VersionSelectorProps) => {
  const [selected, setSelected] = useState<string>(defaultVersion ?? versions[0]);

  useEffect(() => {
    if (defaultVersion && defaultVersion !== selected) {
      setSelected(defaultVersion);
    }
  }, [defaultVersion, selected]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVersion = e.target.value;
    setSelected(newVersion);
    onChange?.(newVersion);
  };

  return (
    <div className="flex items-center gap-3 py-3">
      <label className="font-medium text-gray-900" htmlFor="version-select">
        Active App Version
      </label>
      <select
        id="version-select"
        value={selected}
        onChange={handleChange}
        className="border border-gray-300 rounded-md shadow-sm focus:border-orange-600 focus:ring-orange-600 focus:ring-1 text-sm px-3 py-2 bg-white"
      >
        {versions.map(v => (
          <option key={v} value={v} className={clsx({ 'font-semibold': v.includes('beta') || v.includes('alpha') })}>
            v{v} {v.includes('beta') && '(Beta)'} {v.includes('alpha') && '(Alpha)'}
          </option>
        ))}
      </select>
    </div>
  );
}; 