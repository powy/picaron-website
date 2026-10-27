'use client';

import {
  ADDRESS_FIELDS,
  AddressErrorKey,
  AddressFieldKey,
  AddressFormData,
} from '@/lib/checkout/address';

// Re-exported so existing imports from this component keep working; the
// source of truth is lib/checkout/address.ts (shared with the server).
export { DEFAULT_ADDRESS, validateAddress } from '@/lib/checkout/address';
export type { AddressErrorKey, AddressFieldKey, AddressFormData } from '@/lib/checkout/address';

interface AddressFieldsProps {
  idPrefix: string;
  values: AddressFormData;
  errors: Partial<Record<AddressFieldKey, AddressErrorKey>>;
  touched: Partial<Record<AddressFieldKey, boolean>>;
  onChange: (key: AddressFieldKey, value: string) => void;
  onBlur: (key: AddressFieldKey) => void;
  t: (key: string) => string;
}

export default function AddressFields({ idPrefix, values, errors, touched, onChange, onBlur, t }: AddressFieldsProps) {
  const renderField = (key: AddressFieldKey, className = '') => {
    const field = ADDRESS_FIELDS.find((f) => f.key === key)!;
    const placeholder = `${t(`fields.${key}`)}${field.required ? ' *' : ''}`;
    const id = `${idPrefix}-${key}`;
    return (
      <div className={className}>
        <label htmlFor={id} className="sr-only">{placeholder}</label>
        <input
          id={id}
          type={field.type}
          value={values[key]}
          placeholder={placeholder}
          onChange={(e) => onChange(key, e.target.value)}
          onBlur={() => onBlur(key)}
          className={`input-field ${touched[key] && errors[key] ? 'input-field-error' : ''}`}
        />
        {touched[key] && errors[key] && (
          <p className="error-text">{t(`errors.${errors[key]}`)}</p>
        )}
      </div>
    );
  };

  return (
    <div className="stack-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField('lastName')}
        {renderField('firstName')}
      </div>

      {renderField('address')}
      {renderField('addressComplement')}

      {/* Country is hidden and forced to France for now — Mondial Relay and
          Colissimo delivery are France-only, see shop.shipping.france copy. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {renderField('postalCode', 'sm:col-span-1')}
        {renderField('city', 'sm:col-span-2')}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField('email')}
        {renderField('phone')}
      </div>
    </div>
  );
}
