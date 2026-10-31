import { useCallback, useEffect, useMemo, useState } from 'react';
import { customerService, type CityCustomerCount } from '@/api/customers';
import {
  DashboardIcon,
  PeopleIcon,
  ArrowForwardIcon,
  RefreshIcon,
  LocationCityIcon,
  FlagIcon,
  Box,
  Typography,
  Button,
  IconButton,
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
} from '@/components/common';
import { useNotification } from '@/hooks';
import { getCityAndState, calculateDashboardMetrics } from '@/utils';
import './DashboardPage.scss';

export function DashboardPage() {
  const { showNotification } = useNotification();

  const [cities, setCities] = useState<CityCustomerCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressAnimationKey, setProgressAnimationKey] = useState(0);
  const [search, setSearch] = useState('');
  const failLoadDashboardMsg =
    'Não foi possível carregar os dados do dashboard. Tente novamente dentro de alguns minutos!';

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const result = await customerService.getTotalByCity();

      setCities(result);
      setProgressAnimationKey((previousKey) => previousKey + 1);
    } catch {
      showNotification({
        severity: 'error',
        message: failLoadDashboardMsg,
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    let isActive = true;

    async function initializeDashboard() {
      try {
        const result = await customerService.getTotalByCity();

        if (isActive) {
          setCities(result);
        }
      } catch {
        if (isActive) {
          showNotification({
            severity: 'error',
            message: failLoadDashboardMsg,
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
  }, [showNotification]);

  const metrics = useMemo(() => calculateDashboardMetrics(cities), [cities]);

  const filteredCities = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');

    if (!normalizedSearch) {
      return cities;
    }

    return cities.filter((item) => {
      const { city, state } = getCityAndState(item.city);

      return (
        city.toLocaleLowerCase('pt-BR').includes(normalizedSearch) ||
        state.toLocaleLowerCase('pt-BR').includes(normalizedSearch) ||
        item.city.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
      );
    });
  }, [cities, search]);

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
              <PeopleIcon />
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
        <IconButton
          className="view-city-button"
          aria-label={`Visualizar clientes de ${params.row.city}`}
          onClick={() =>
            showNotification({
              severity: 'info',
              message: `Funcionalidade 'listagem de clientes de ${params.row.city}' não implementada.`,
            })
          }
        >
          <ArrowForwardIcon />
        </IconButton>
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
        searchPlaceholder="Buscar cidade ou UF..."
        searchValue={search}
        onSearchChange={(event) => setSearch(event.target.value)}
        footerInfo="Clique na seta de uma cidade para 'Visualizar' a lista de clientes."
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
