import type { z } from 'zod';
import { customerFormSchema } from './customer-form.schema';

export interface CustomerFormProps {
  formData: CustomerFormData;
  formErrors: CustomerFormErrors;
  submitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

export type CustomerFormData = z.input<typeof customerFormSchema>;

export interface CustomerFormErrors {
  firstName: string;
  email: string;
  gender?: string;
}
