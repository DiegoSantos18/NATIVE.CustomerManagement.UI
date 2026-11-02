export interface CustomerFormProps {
  formData: CustomerFormData;
  formErrors: CustomerFormErrors;
  submitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  company: string;
  city: string;
  title: string;
}

export interface CustomerFormErrors {
  email: string;
}
