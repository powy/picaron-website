// Shared by the checkout forms (components/checkout/AddressFields.tsx) and
// the server-side order validation (lib/server/orders), so both sides apply
// exactly the same rules.

export interface AddressFormData {
  lastName: string;
  firstName: string;
  address: string;
  addressComplement: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  phone: string;
}

export type AddressFieldKey = keyof AddressFormData;

export const DEFAULT_ADDRESS: AddressFormData = {
  lastName: '',
  firstName: '',
  address: '',
  addressComplement: '',
  postalCode: '',
  city: '',
  country: 'France',
  email: '',
  phone: '',
};

export const ADDRESS_FIELDS: { key: AddressFieldKey; type: string; required: boolean }[] = [
  { key: 'lastName', type: 'text', required: true },
  { key: 'firstName', type: 'text', required: true },
  { key: 'address', type: 'text', required: true },
  { key: 'addressComplement', type: 'text', required: false },
  { key: 'postalCode', type: 'text', required: true },
  { key: 'city', type: 'text', required: true },
  { key: 'country', type: 'text', required: true },
  { key: 'email', type: 'email', required: true },
  { key: 'phone', type: 'tel', required: true },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_CODE_REGEX = /^\d{5}$/;
// Mainland France only (departments 01 to 95, Corsica is 20xxx). Overseas
// territories (97xxx, 98xxx), Monaco (98000) and 00xxx are refused: customers
// elsewhere must contact us (see the FranceOnlyNotice component).
export const MAINLAND_POSTAL_CODE_REGEX = /^(0[1-9]|[1-8]\d|9[0-5])\d{3}$/;

export type AddressErrorKey = 'required' | 'invalidEmail' | 'invalidPostalCode' | 'notMainlandFrance';

export function validateAddress(formData: AddressFormData): Partial<Record<AddressFieldKey, AddressErrorKey>> {
  const errors: Partial<Record<AddressFieldKey, AddressErrorKey>> = {};

  for (const { key, required } of ADDRESS_FIELDS) {
    if (required && !formData[key].trim()) {
      errors[key] = 'required';
    }
  }

  if (formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = 'invalidEmail';
  }

  if (formData.postalCode.trim() && !POSTAL_CODE_REGEX.test(formData.postalCode.trim())) {
    errors.postalCode = 'invalidPostalCode';
  } else if (formData.postalCode.trim() && !MAINLAND_POSTAL_CODE_REGEX.test(formData.postalCode.trim())) {
    errors.postalCode = 'notMainlandFrance';
  }

  return errors;
}
