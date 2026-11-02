import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  CircularProgress,
  PersonIcon,
  ArrowBackIcon,
} from '@/components/common/mui';
import { CustomCardComponent } from '@/components/common';
import { useNotification } from '@/hooks';
import { customerService } from '@/api/customers';
import { CustomerForm, type CustomerFormData } from './form';
import './CustomerDetailsPage.scss';

export function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    company: '',
    city: '',
    title: '',
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
  });

  const fetchCustomer = useCallback(
    async (customerId: string) => {
      try {
        setLoading(true);
        const data = await customerService.getById(customerId);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          gender: data.gender || '',
          company: data.company || '',
          city: data.city || '',
          title: data.title || '',
        });
      } catch (err: unknown) {
        const errorObj = err as { response?: { status?: number } };
        const message =
          errorObj?.response?.status === 404
            ? 'Cliente não encontrado.'
            : 'Falha ao carregar os dados do cliente. Tente novamente.';
        showNotification({ severity: 'error', message });
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await customerService.getById(id);
        if (!isMounted) return;

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          gender: data.gender || '',
          company: data.company || '',
          city: data.city || '',
          title: data.title || '',
        });
      } catch (err: unknown) {
        if (!isMounted) return;
        const errorObj = err as { response?: { status?: number } };
        const message =
          errorObj?.response?.status === 404
            ? 'Cliente não encontrado.'
            : 'Falha ao carregar os dados do cliente. Tente novamente.';
        showNotification({ severity: 'error', message });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [id, showNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setFormErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { email: '' };

    if (!formData.email.trim()) {
      errors.email = 'O e-mail é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Formato de e-mail inválido.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !validateForm()) return;

    try {
      setSubmitting(true);
      await customerService.update(id, formData);
      showNotification({
        severity: 'success',
        message: 'Alterações salvas com sucesso!',
      });
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string; error?: string } } };
      const serverMessage = errorObj?.response?.data?.message || errorObj?.response?.data?.error;
      showNotification({
        severity: 'error',
        message:
          serverMessage || 'Erro ao atualizar cliente. Verifique os dados e tente novamente.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="customer-details-container">
      {/* Header com o Botão Voltar alinhado à direita */}
      <div className="page-header">
        <div className="page-heading">
          <div className="title-wrapper">
            <PersonIcon className="header-icon" />
            <Typography variant="h4" component="h1" className="page-title">
              Detalhes do Cliente #{id}
            </Typography>
          </div>
          <Typography variant="body2" className="page-subtitle">
            Visualização e alteração de dados cadastrais do cliente no sistema.
          </Typography>
        </div>

        <Button
          className="refresh-button"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers')}
        >
          Voltar
        </Button>
      </div>

      {/* Conteúdo dentro do Card Padrão */}
      <CustomCardComponent
        title="Formulário de Cadastro"
        subtitle="Altere os campos abaixo para atualizar o registro do cliente."
        icon={<PersonIcon />}
        footerInfo="Clique em 'Salvar Alterações' para confirmar o envio dos dados atualizados."
      >
        <div className="content-inner">
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '250px',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <CustomerForm
              formData={formData}
              formErrors={formErrors}
              submitting={submitting}
              onChange={handleChange}
              onSubmit={(e) => void handleSubmit(e)}
              onReset={() => id && void fetchCustomer(id)}
            />
          )}
        </div>
      </CustomCardComponent>
    </div>
  );
}
