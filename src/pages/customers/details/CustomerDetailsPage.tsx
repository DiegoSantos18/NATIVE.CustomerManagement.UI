import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  CircularProgress,
  PersonIcon,
  ArrowBackIcon,
} from '@/components/common/mui';
import { CustomCardComponent, PageHeaderComponent } from '@/components/common';
import { useNotification } from '@/hooks';
import { customerService, type Customer } from '@/api/customers';
import {
  CustomerForm,
  customerFormSchema,
  type CustomerFormData,
  type CustomerFormErrors,
} from './form';
import './CustomerDetailsPage.scss';

function toCustomerFormData(customer: Customer): CustomerFormData {
  return {
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    email: customer.email || '',
    gender: customer.gender || '',
    company: customer.company || '',
    city: customer.city || '',
    title: customer.title || '',
  };
}

export function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const customerRequestId = useRef(0);

  const [loadedCustomerId, setLoadedCustomerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const loading = Boolean(id) && loadedCustomerId !== id;

  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    company: '',
    city: '',
    title: '',
  });

  const [formErrors, setFormErrors] = useState<CustomerFormErrors>({
    firstName: '',
    email: '',
  });

  const applyCustomer = useCallback((customer: Customer) => {
    setFormData(toCustomerFormData(customer));
    setFormErrors({ firstName: '', email: '' });
  }, []);

  const notifyCustomerLoadError = useCallback(
    (err: unknown) => {
      const errorObj = err as { response?: { status?: number } };
      const message =
        errorObj?.response?.status === 404
          ? 'Cliente não encontrado.'
          : 'Falha ao carregar os dados do cliente. Tente novamente.';
      showNotification({ severity: 'error', message });
    },
    [showNotification]
  );

  useEffect(() => {
    if (!id) return;

    const requestId = ++customerRequestId.current;
    customerService
      .getById(id)
      .then((customer) => {
        if (customerRequestId.current === requestId) applyCustomer(customer);
      })
      .catch((err: unknown) => {
        if (customerRequestId.current === requestId) notifyCustomerLoadError(err);
      })
      .finally(() => {
        if (customerRequestId.current === requestId) setLoadedCustomerId(id);
      });

    return () => {
      customerRequestId.current += 1;
    };
  }, [id, applyCustomer, notifyCustomerLoadError]);

  const handleReset = () => {
    if (!id) return;

    const requestId = ++customerRequestId.current;
    setLoadedCustomerId(null);
    customerService
      .getById(id)
      .then((customer) => {
        if (customerRequestId.current === requestId) applyCustomer(customer);
      })
      .catch((err: unknown) => {
        if (customerRequestId.current === requestId) notifyCustomerLoadError(err);
      })
      .finally(() => {
        if (customerRequestId.current === requestId) setLoadedCustomerId(id);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'firstName' || name === 'email') {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const result = customerFormSchema.safeParse(formData);
    if (!result.success) {
      const errors: CustomerFormErrors = { firstName: '', email: '' };
      for (const issue of result.error.issues) {
        if (issue.path[0] === 'firstName' || issue.path[0] === 'email') {
          errors[issue.path[0]] = issue.message;
        }
      }
      setFormErrors(errors);
      return;
    }

    setFormErrors({ firstName: '', email: '' });

    try {
      setSubmitting(true);
      await customerService.update(id, result.data);
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
      <PageHeaderComponent
        title={`Detalhes do Cliente #${id}`}
        subtitle="Visualização e alteração de dados cadastrais do cliente no sistema."
        icon={<PersonIcon />}
        action={
          <Button
            className="page-header-action page-header-action--outlined"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/customers')}
          >
            Voltar
          </Button>
        }
      />

      {/* Conteúdo dentro do Card Padrão */}
      <CustomCardComponent
        title="Formulário de Cadastro"
        footerInfo="Clique em 'Salvar Alterações' para confirmar o envio dos dados atualizados."
      >
        <div className="content-inner">
          {!id ? (
            <Typography>Identificador do cliente não informado.</Typography>
          ) : loading ? (
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
              onReset={handleReset}
            />
          )}
        </div>
      </CustomCardComponent>
    </div>
  );
}
