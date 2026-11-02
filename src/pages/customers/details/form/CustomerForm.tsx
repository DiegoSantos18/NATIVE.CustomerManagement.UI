import { TextField, Button, Divider, SaveIcon, RefreshIcon } from '@/components/common/mui';
import type { CustomerFormProps } from './customer-form.types';
import './CustomerForm.scss';

export function CustomerForm({
  formData,
  formErrors,
  submitting,
  onChange,
  onSubmit,
  onReset,
}: CustomerFormProps) {
  return (
    <form onSubmit={onSubmit} className="customer-form">
      <div className="form-section-title">Informações Pessoais</div>
      <div className="form-grid">
        <TextField
          label="Nome"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          fullWidth
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
        <TextField
          label="Gênero"
          name="gender"
          value={formData.gender}
          onChange={onChange}
          fullWidth
          variant="outlined"
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
