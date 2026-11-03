import {
  Card,
  CardActionArea,
  CardContent,
  LocationCityIcon,
  Pagination,
  TablePagination,
  Typography,
} from '@/components/common/mui';
import { ProgressBarComponent } from '@/components/common';
import type { CityCustomerCount } from '@/api/customers';
import { getCityAndState } from '@/utils';
import './DashboardCityCardsComponent.scss';

interface DashboardCityCardsComponentProps {
  cities: CityCustomerCount[];
  maxCustomersByCity: number;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  onCitySelect: (city: string) => void;
}

export function DashboardCityCardsComponent({
  cities,
  maxCustomersByCity,
  paginationModel,
  onPaginationModelChange,
  onCitySelect,
}: DashboardCityCardsComponentProps) {
  const pageCount = Math.max(1, Math.ceil(cities.length / paginationModel.pageSize));
  const currentPage = Math.min(paginationModel.page, pageCount - 1);
  const visibleCities = cities.slice(
    currentPage * paginationModel.pageSize,
    (currentPage + 1) * paginationModel.pageSize
  );

  if (cities.length === 0) {
    return (
      <Typography className="dashboard-city-cards-empty" role="status">
        Nenhuma cidade encontrada para os filtros aplicados.
      </Typography>
    );
  }

  return (
    <section className="dashboard-city-cards" aria-label="Clientes por cidade em cards">
      <div className="dashboard-city-cards-grid">
        {visibleCities.map((item, index) => {
          const { city, state } = getCityAndState(item.city);

          return (
            <Card
              className="dashboard-city-card"
              key={item.city}
              style={{ '--card-index': index } as React.CSSProperties}
            >
              <CardActionArea
                className="dashboard-city-card-action"
                aria-label={`Visualizar clientes de ${item.city}`}
                onClick={() => onCitySelect(item.city)}
              >
                <CardContent className="dashboard-city-card-content">
                  <div className="dashboard-city-card-heading">
                    <span className="dashboard-city-card-icon" aria-hidden="true">
                      <LocationCityIcon />
                    </span>
                    <div className="dashboard-city-card-title">
                      <Typography variant="h6" component="h3" title={city}>
                        {city}
                      </Typography>
                      <Typography variant="body2">{state || 'UF não informada'}</Typography>
                    </div>
                  </div>

                  <div className="dashboard-city-card-total">
                    <Typography variant="body2">Total de clientes</Typography>
                  </div>

                  <ProgressBarComponent
                    value={item.customersTotal}
                    maxValue={maxCustomersByCity}
                    label={`Quantidade de clientes em ${item.city}`}
                  />

                  <span className="dashboard-city-card-link">
                    Visualizar clientes <span aria-hidden="true">→</span>
                  </span>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </div>

      <div className="dashboard-city-cards-pagination">
        <TablePagination
          component="div"
          count={cities.length}
          page={currentPage}
          rowsPerPage={paginationModel.pageSize}
          onPageChange={(_event, page) => onPaginationModelChange({ ...paginationModel, page })}
          onRowsPerPageChange={(event) =>
            onPaginationModelChange({ page: 0, pageSize: Number(event.target.value) })
          }
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Cards por página:"
          labelDisplayedRows={() => ''}
          sx={{
            '& .MuiTablePagination-displayedRows, & .MuiTablePagination-actions': {
              display: 'none',
            },
          }}
        />
        <Pagination
          color="primary"
          count={pageCount}
          page={currentPage + 1}
          siblingCount={1}
          onChange={(_event, page) =>
            onPaginationModelChange({ ...paginationModel, page: page - 1 })
          }
          showFirstButton
          showLastButton
        />
      </div>
    </section>
  );
}
