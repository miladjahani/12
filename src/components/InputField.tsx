import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  step?: number;
  min?: number;
  children?: React.ReactNode; // For select options
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type = 'number', value, onChange, step, min, children }) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    className: "w-full bg-[#2c3a4a] text-white border border-gray-600 rounded p-2 text-sm focus:border-cyan-400 focus:ring focus:ring-cyan-400 focus:ring-opacity-50 transition"
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-gray-400">{label}</label>
      {type === 'select' ? (
        <select {...commonProps}>{children}</select>
      ) : (
        <input type={type} step={step} min={min} {...commonProps} />
      )}
    </div>
  );
};

export default InputField;
