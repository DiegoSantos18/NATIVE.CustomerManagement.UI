import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { customerService, type Customer } from '@/api/customers';
import {
  PeopleIcon,
  EditNoteIcon,
  TuneIcon,
  IconButton,
  Tooltip,
  Box,
  Typography,
  type GridColDef,
} from '@/components/common/mui';
import {
  CustomCardComponent,
  CustomDataGridComponent,
  CustomMultiSelectFilterComponent,
} from '@/components/common';
import { useNotification, useFilterStorage } from '@/hooks';
import { getCityAndState } from '@/utils';
import './CustomersPage.scss';

const DEFAULT_PAGE_SIZE = 10;
const CUSTOMERS_CITY_FILTER_KEY = 'native_customers_city_filter';

export function CustomersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showNotification } = useNotification();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [totalItems, setTotalItems] = useState(0);

  const [savedCities, setSavedCities] = useFilterStorage<string[]>(CUSTOMERS_CITY_FILTER_KEY, []);

  const [selectedCities, setSelectedCities] = useState<string[]>(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) {
      return [cityParam];
    }
    return savedCities;
  });

  useEffect(() => {
    let isActive = true;

    async function initializeCities() {
      try {
        const result = await customerService.getCities();

        if (isActive) {
          setCities(result);
        }
      } catch {
        if (isActive) {
          showNotification({
            severity: 'error',
            message: 'Não foi possível carregar as cidades. Tente novamente.',
          });
        }
      }
    }

    void initializeCities();

    return () => {
      isActive = false;
    };
  }, [showNotification]);

  useEffect(() => {
    let isActive = true;

    async function initializeCustomers() {
      try {
        const result = await customerService.getPaginated({
          pagination: {
            page: pagination.page + 1,
            pageSize: pagination.pageSize,
          },
          filters: {
            ...(selectedCities.length > 0 ? { cities: selectedCities } : {}),
          },
        });

        if (isActive) {
          setCustomers(result.items);
          setTotalItems(result.totalItems);
        }
      } catch {
        if (isActive) {
          showNotification({
            severity: 'error',
            message: 'Não foi possível carregar os clientes. Tente novamente.',
          });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void initializeCustomers();

    return () => {
      isActive = false;
    };
  }, [pagination.page, pagination.pageSize, selectedCities, showNotification]);

  const handleApplyCityFilter = (nextCities: string[]) => {
    setLoading(true);

    setPagination((current) => ({
      ...current,
      page: 0,
    }));

    setSelectedCities(nextCities);
    setSavedCities(nextCities);

    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.delete('city');

        return nextParams;
      },
      { replace: true }
    );
  };

  const handleClearCityFilter = () => {
    handleApplyCityFilter([]);
  };

  const handlePaginationChange = (nextPagination: typeof pagination) => {
    setLoading(true);
    setPagination(nextPagination);
  };

  const columns: GridColDef<Customer>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'firstName',
      headerName: 'Nome',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'lastName',
      headerName: 'Sobrenome',
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'email',
      headerName: 'E-mail',
      flex: 1.5,
      minWidth: 220,
    },
    {
      field: 'city',
      headerName: 'Cidade',
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => {
        const { city } = getCityAndState(row.city);

        return (
          <div className="customer-city-cell">
            <span className="customer-city-name">{city}</span>
          </div>
        );
      },
    },
    {
      field: 'state',
      headerName: 'UF',
      width: 60,
      minWidth: 60,
      sortable: false,
      valueGetter: (_value, row) => getCityAndState(row.city).state || '—',
    },
    {
      field: 'actions',
      headerName: 'Ações',
      renderHeader: () => <TuneIcon style={{ fontSize: '1.1rem' }} />,
      sortable: false,
      filterable: false,
      width: 80,
      minWidth: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Tooltip
          title={`Editar / Detalhes de ${row.firstName} ${row.lastName}`}
          placement="top"
          arrow
        >
          <IconButton
            className="view-customer-button"
            aria-label={`Visualizar detalhes de ${row.firstName} ${row.lastName}`}
            onClick={() => navigate(`/customers/${row.id}`)}
          >
            <EditNoteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box className="customers-container">
      <div className="page-header">
        <div className="title-wrapper">
          <PeopleIcon className="header-icon" />

          <Typography variant="h4" component="h1" className="page-title">
            Listagem de Clientes
          </Typography>
        </div>

        <Typography variant="body2" className="page-subtitle">
          Listagem centralizada e controle operacional de clientes cadastrados.
        </Typography>
      </div>

      <main className="content">
        <CustomCardComponent
          title="Clientes"
          subtitle="Consulta e gerenciamento da base de clientes."
          icon={<PeopleIcon />}
          headerAction={
            <CustomMultiSelectFilterComponent
              options={cities}
              value={selectedCities}
              onApply={handleApplyCityFilter}
              onClear={handleClearCityFilter}
            />
          }
          footerInfo={`${totalItems} cliente(s) encontrado(s) para os filtros aplicados.`}
        >
          <CustomDataGridComponent
            checkboxSelection
            checkboxPosition="first"
            rows={customers}
            columns={columns}
            loading={loading}
            paginationMode="server"
            paginationModel={pagination}
            onPaginationModelChange={handlePaginationChange}
            rowCount={totalItems}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
          />
        </CustomCardComponent>
      </main>
    </Box>
  );
}
