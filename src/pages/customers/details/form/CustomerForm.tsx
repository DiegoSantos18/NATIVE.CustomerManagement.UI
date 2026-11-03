import {
  TextField,
  Button,
  Divider,
  Autocomplete,
  SaveIcon,
  RefreshIcon,
  InfoIcon,
} from '@/components/common/mui';
import type { CustomerFormProps } from './customer-form.types';
import './CustomerForm.scss';

type GenderOption = { label: string; value: string };

const genderOptions: GenderOption[] = [
  { label: 'Masculino', value: 'Male' },
  { label: 'Feminino', value: 'Female' },
  { label: 'Outro (para especificar digite...)', value: 'Other' },
];

export function CustomerForm({
  formData,
  formErrors,
  submitting,
  onChange,
  onSubmit,
  onReset,
}: CustomerFormProps) {
  const currentGenderValue = formData.gender || '';
  const selectedOption =
    genderOptions.find((opt) => opt.value === currentGenderValue) ||
    (currentGenderValue ? { label: currentGenderValue, value: currentGenderValue } : null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Atalho Ctrl + S (ou Cmd + S no Mac) para disparar o submit
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (!submitting) {
        onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
      return;
    }

    // Bloqueia o submit padrão acionado pela tecla Enter
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={onSubmit} onKeyDown={handleKeyDown} className="customer-form">
      <div className="form-section-title">Informações Pessoais</div>
      <div className="form-grid">
        <TextField
          label="Nome"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          error={Boolean(formErrors.firstName)}
          helperText={formErrors.firstName}
          fullWidth
          required
          variant="outlined"
        />
        <TextField
          label="Sobrenome"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
      </div>

      <div className="form-row">
        <TextField
          label="E-mail"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          error={Boolean(formErrors.email)}
          helperText={formErrors.email}
          fullWidth
          required
          variant="outlined"
        />
      </div>

      <div className="form-grid">
        <Autocomplete<GenderOption, false, false, true>
          value={selectedOption}
          options={genderOptions}
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          getOptionLabel={(option: string | GenderOption) => {
            if (typeof option === 'string') return option;
            return option.label;
          }}
          onChange={(_event, newValue: string | GenderOption | null) => {
            let valueToSave = '';

            if (typeof newValue === 'string') {
              valueToSave = newValue;
            } else if (newValue && typeof newValue === 'object') {
              valueToSave = newValue.value;
            }

            onChange({
              target: {
                name: 'gender',
                value: valueToSave,
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          onInputChange={(_event, newInputValue, reason) => {
            if (reason === 'input') {
              onChange({
                target: {
                  name: 'gender',
                  value: newInputValue,
                },
              } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Gênero"
              name="gender"
              error={Boolean(formErrors.gender)}
              helperText={formErrors.gender}
              fullWidth
              variant="outlined"
            />
          )}
        />

        <TextField
          label="Cargo / Título"
          name="title"
          value={formData.title}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
      </div>

      <Divider sx={{ my: 3, borderColor: 'var(--border-color)' }} />

      <div className="form-section-title">Dados Profissionais e Localização</div>
      <div className="form-grid">
        <TextField
          label="Empresa"
          name="company"
          value={formData.company}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Cidade"
          name="city"
          value={formData.city}
          onChange={onChange}
          helperText={
            <span className="customer-form__field-hint">
              <InfoIcon fontSize="small" />
              UF opcional. Para separá-la, prefira vírgula: Cidade, UF.
            </span>
          }
          fullWidth
          variant="outlined"
        />
      </div>

      <div className="form-actions">
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RefreshIcon />}
          onClick={onReset}
          disabled={submitting}
          className="btn-reset"
        >
          Limpar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disabled={submitting}
          className="btn-submit"
        >
          {submitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
