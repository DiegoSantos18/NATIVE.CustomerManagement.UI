import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService, type CityCustomerCount } from '@/api/customers';
import {
  DashboardIcon,
  PeopleIcon,
  PersonPinCircleIcon,
  ArrowForwardIcon,
  RefreshIcon,
  LocationCityIcon,
  FlagIcon,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  TuneIcon,
  type GridColDef,
} from '@/components/common/mui';
import {
  CountUpComponent,
  MetricCardComponent,
  ProgressBarComponent,
  CustomCardComponent,
  CustomDataGridComponent,
  CustomMultiSelectFilterComponent,
} from '@/components/common';
import { useNotification, useFilterStorage } from '@/hooks';
import { getCityAndState, calculateDashboardMetrics } from '@/utils';
import './DashboardPage.scss';

const FAIL_LOAD_DASHBOARD_MESSAGE =
  'Não foi possível carregar os dados do dashboard. Tente novamente dentro de alguns minutos!';
const DASHBOARD_CITY_FILTER_KEY = 'native_dashboard_city_filter';

export function DashboardPage() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [cities, setCities] = useState<CityCustomerCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressAnimationKey, setProgressAnimationKey] = useState(0);
  const [selectedCities, setSelectedCities] = useFilterStorage<string[]>(
    DASHBOARD_CITY_FILTER_KEY,
    []
  );

  const fetchDashboard = useCallback(() => {
    return customerService.getTotalByCity();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const result = await fetchDashboard();

      setCities(result);
      setProgressAnimationKey((previousKey) => previousKey + 1);
    } catch {
      showNotification({
        severity: 'error',
        message: FAIL_LOAD_DASHBOARD_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    async function initializeDashboard() {
      try {
        const result = await fetchDashboard();

        if (isActive) {
          setCities(result);
        }
      } catch {
        if (isActive) {
          showNotification({
            severity: 'error',
            message: FAIL_LOAD_DASHBOARD_MESSAGE,
          });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void initializeDashboard();

    return () => {
      isActive = false;
    };
  }, [fetchDashboard, showNotification]);

  const metrics = useMemo(() => calculateDashboardMetrics(cities), [cities]);

  const filteredCities = useMemo(() => {
    if (selectedCities.length === 0 || selectedCities.length === cities.length) {
      return cities;
    }

    return cities.filter((item) => selectedCities.includes(item.city));
  }, [cities, selectedCities]);

  const columns: GridColDef<CityCustomerCount>[] = [
    {
      field: 'city',
      headerName: 'Cidade',
      width: 180,
      minWidth: 80,
      renderCell: (params) => {
        const { city } = getCityAndState(params.row.city);

        return (
          <div className="city-cell">
            <span className="city-cell-icon">
              <PersonPinCircleIcon />
            </span>

            <span className="city-cell-name">{city}</span>
          </div>
        );
      },
    },
    {
      field: 'state',
      headerName: 'UF',
      width: 50,
      minWidth: 50,
      sortable: false,
      valueGetter: (_value, row) => getCityAndState(row.city).state || '—',
    },
    {
      field: 'customersTotal',
      headerName: 'Total de Clientes',
      flex: 1,
      width: 240,
      minWidth: 80,
      sortable: true,
      renderCell: ({ row }) => (
        <ProgressBarComponent
          key={`${progressAnimationKey}-${row.city}`}
          value={row.customersTotal}
          maxValue={metrics.maxCustomersByCity}
          label={`Quantidade de clientes em ${row.city}`}
        />
      ),
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
      renderCell: (params) => (
        <Tooltip title={`Visualizar ${params.row.city}`} placement="top" arrow>
          <IconButton
            className="view-city-button"
            aria-label={`Visualizar clientes de ${params.row.city}`}
            onClick={() => navigate(`/customers?city=${encodeURIComponent(params.row.city)}`)}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-heading">
          <div className="title-wrapper">
            <DashboardIcon className="header-icon" />

            <Typography variant="h4" component="h1" className="page-title">
              Dashboard
            </Typography>
          </div>

          <Typography variant="body2" className="page-subtitle">
            Bem-vindo(a) ao painel de gestão e controle de clientes.
          </Typography>
        </div>

        <Button
          className="refresh-button"
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          onClick={() => void loadDashboard()}
          disabled={loading}
        >
          Atualizar
        </Button>
      </div>

      <div className="dashboard-grid">
        <MetricCardComponent
          key={`metric-customer-${progressAnimationKey}`}
          label="Total de clientes"
          value={metrics.totalCustomers}
          loading={loading}
          footerContent={
            <>
              Média de <CountUpComponent value={Number(metrics.avgGeneralReach.toFixed(1))} />{' '}
              clientes por região
            </>
          }
          trend={metrics.customerTrend}
          illustrationIcon={<PeopleIcon className="metric-illustration metric-people-icon" />}
        />

        <MetricCardComponent
          key={`metric-city-${progressAnimationKey}`}
          label="Cidades atendidas"
          value={metrics.totalCities}
          loading={loading}
          footerContent={
            <>
              Média de <CountUpComponent value={Number(metrics.avgCustomersPerCity.toFixed(1))} />{' '}
              clientes por cidade
            </>
          }
          trend={metrics.citiesTrend}
          illustrationIcon={
            <LocationCityIcon className="metric-illustration metric-location-icon" />
          }
        />

        <MetricCardComponent
          key={`metric-state-${progressAnimationKey}`}
          label="UF's atendidas"
          value={metrics.totalStates}
          loading={loading}
          footerContent={
            <>
              Média de <CountUpComponent value={Number(metrics.avgCustomersPerState.toFixed(1))} />{' '}
              clientes por UF
            </>
          }
          trend={metrics.stateTrend}
          illustrationIcon={<FlagIcon className="metric-illustration metric-location-icon" />}
        />
      </div>

      <CustomCardComponent
        title="Clientes por cidade"
        subtitle="Distribuição de clientes nas cidades."
        icon={<PeopleIcon />}
        headerAction={
          <CustomMultiSelectFilterComponent
            options={cities.map((item) => item.city)}
            value={selectedCities}
            onApply={setSelectedCities}
            onClear={() => setSelectedCities([])}
          />
        }
        footerInfo="Utilize os filtros acima ou acesse diretamente os detalhes de cada localidade."
      >
        <CustomDataGridComponent
          rows={filteredCities}
          columns={columns}
          getRowId={(row) => row.city}
          loading={loading}
          initialState={{
            sorting: {
              sortModel: [{ field: 'customersTotal', sort: 'desc' }],
            },
          }}
        />
      </CustomCardComponent>
    </Box>
  );
}
