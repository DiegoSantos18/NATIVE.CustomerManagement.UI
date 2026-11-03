import { useState, type ChangeEvent } from 'react';
import type { Customer } from '@/api/customers';
import {
  ArrowDownwardIcon,
  ArrowUpwardIcon,
  Button,
  Card,
  CardContent,
  Checkbox,
  CloseIcon,
  CircularProgress,
  Collapse,
  DeleteOutlineIcon,
  EditNoteIcon,
  FormControlLabel,
  IconButton,
  MenuItem,
  Pagination,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  type GridFilterModel,
  type GridRowSelectionModel,
  type GridSortModel,
} from '@/components/common/mui';
import { getCityAndState } from '@/utils';
import './CustomerCardListComponent.scss';

interface CustomerCardListComponentProps {
  customers: Customer[];
  loading: boolean;
  pagination: { page: number; pageSize: number };
  totalItems: number;
  filterModel: GridFilterModel;
  sortModel: GridSortModel;
  selectionModel: GridRowSelectionModel;
  advancedFiltersOpen: boolean;
  onPaginationChange: (pagination: { page: number; pageSize: number }) => void;
  onFilterModelChange: (filterModel: GridFilterModel) => void;
  onSortModelChange: (sortModel: GridSortModel) => void;
  onSelectionModelChange: (selectionModel: GridRowSelectionModel) => void;
  onCustomerSelect: (customer: Customer) => void;
  onNotImplemented: (actionName: string) => void;
}

const FILTER_FIELDS = [
  { field: 'firstName', label: 'Nome' },
  { field: 'lastName', label: 'Sobrenome' },
  { field: 'email', label: 'E-mail' },
  { field: 'city', label: 'Cidade' },
] as const;

const SORT_FIELDS = [
  { field: 'id', label: 'ID' },
  { field: 'firstName', label: 'Nome' },
  { field: 'lastName', label: 'Sobrenome' },
  { field: 'email', label: 'E-mail' },
  { field: 'city', label: 'Cidade' },
] as const;

export function CustomerCardListComponent({
  customers,
  loading,
  pagination,
  totalItems,
  filterModel,
  sortModel,
  selectionModel,
  advancedFiltersOpen,
  onPaginationChange,
  onFilterModelChange,
  onSortModelChange,
  onSelectionModelChange,
  onCustomerSelect,
  onNotImplemented,
}: CustomerCardListComponentProps) {
  const activeFilter = filterModel.items[0];
  const activeSort = sortModel[0];
  const [filterField, setFilterField] = useState<string>(
    FILTER_FIELDS.some(({ field }) => field === activeFilter?.field)
      ? (activeFilter?.field ?? FILTER_FIELDS[0].field)
      : FILTER_FIELDS[0].field
  );
  const [filterValue, setFilterValue] = useState(
    typeof activeFilter?.value === 'string' ? activeFilter.value : ''
  );
  const pageCount = Math.max(1, Math.ceil(totalItems / pagination.pageSize));
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const selectedCount =
    selectionModel.type === 'exclude'
      ? Math.max(0, totalItems - selectionModel.ids.size)
      : selectionModel.ids.size;
  const isCustomerSelected = (customerId: Customer['id']) =>
    selectionModel.type === 'include'
      ? selectionModel.ids.has(customerId)
      : !selectionModel.ids.has(customerId);
  const selectedOnPage = customers.filter(({ id }) => isCustomerSelected(id)).length;
  const allCustomersOnPageSelected = customers.length > 0 && selectedOnPage === customers.length;

  const handleSelectCustomer = (customerId: Customer['id'], checked: boolean) => {
    const ids = new Set(selectionModel.ids);
    const shouldContainId = selectionModel.type === 'include' ? checked : !checked;

    if (shouldContainId) {
      ids.add(customerId);
    } else {
      ids.delete(customerId);
    }

    onSelectionModelChange({ type: selectionModel.type, ids });
  };

  const handleSelectPage = (checked: boolean) => {
    const ids = new Set(selectionModel.ids);

    customers.forEach(({ id }) => {
      const shouldContainId = selectionModel.type === 'include' ? checked : !checked;

      if (shouldContainId) {
        ids.add(id);
      } else {
        ids.delete(id);
      }
    });

    onSelectionModelChange({ type: selectionModel.type, ids });
  };

  const applyFilter = () => {
    onFilterModelChange({
      items: filterValue ? [{ field: filterField, operator: 'contains', value: filterValue }] : [],
    });
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.value;
    onSortModelChange(field ? [{ field, sort: activeSort?.sort ?? 'asc' }] : []);
  };

  const toggleSortOrder = () => {
    if (!activeSort) return;
    onSortModelChange([{ ...activeSort, sort: activeSort.sort === 'asc' ? 'desc' : 'asc' }]);
  };

  return (
    <section className="customer-card-list" aria-label="Clientes em cards">
      <Collapse in={advancedFiltersOpen} timeout="auto" unmountOnExit>
        <div
          className="customer-card-advanced-filters"
          id="customer-card-advanced-filters"
          aria-label="Filtros avançados"
        >
          <div className="customer-card-list-controls">
            <div className="customer-card-filter">
              <TextField
                select
                size="small"
                label="Campo"
                value={filterField}
                onChange={(event) => setFilterField(event.target.value)}
              >
                {FILTER_FIELDS.map(({ field, label }) => (
                  <MenuItem key={field} value={field}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                size="small"
                label="Buscar"
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') applyFilter();
                }}
              />
            </div>

            <div className="customer-card-sort">
              <TextField
                select
                size="small"
                label="Ordenar por"
                value={activeSort?.field ?? ''}
                onChange={handleSortChange}
              >
                <MenuItem value="">Padrão</MenuItem>
                {SORT_FIELDS.map(({ field, label }) => (
                  <MenuItem key={field} value={field}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <Tooltip
                title={activeSort?.sort === 'desc' ? 'Ordem decrescente' : 'Ordem crescente'}
                placement="top"
                arrow
              >
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    aria-label="Alternar ordem de classificação"
                    disabled={!activeSort}
                    onClick={toggleSortOrder}
                  >
                    {activeSort?.sort === 'desc' ? (
                      <ArrowDownwardIcon fontSize="small" />
                    ) : (
                      <ArrowUpwardIcon fontSize="small" />
                    )}
                  </Button>
                </span>
              </Tooltip>
            </div>
          </div>
          <div className="customer-card-filter-actions">
            <Button
              size="small"
              variant="text"
              disabled={!activeFilter}
              onClick={() => {
                setFilterValue('');
                onFilterModelChange({ items: [] });
              }}
            >
              Limpar
            </Button>
            <Button size="small" variant="text" onClick={applyFilter}>
              Aplicar
            </Button>
          </div>
        </div>
      </Collapse>

      <div className="customer-card-list-selection-controls">
        {customers.length > 0 && (
          <FormControlLabel
            className="customer-card-list-select-page"
            control={
              <Checkbox
                size="small"
                checked={allCustomersOnPageSelected}
                indeterminate={selectedOnPage > 0 && !allCustomersOnPageSelected}
                disabled={loading}
                onChange={(_event, checked) => handleSelectPage(checked)}
              />
            }
            label="Selecionar página"
          />
        )}
      </div>

      {selectedCount > 0 && (
        <div
          className="custom-data-grid-selection-toolbar customer-card-selection-toolbar"
          role="toolbar"
          aria-label="Ações em lote"
        >
          <Typography className="custom-data-grid-selection-count" variant="body2">
            {selectedCount} {selectedCount === 1 ? 'cliente selecionado' : 'clientes selecionados'}
          </Typography>
          <div className="custom-data-grid-selection-actions">
            <Button
              className="custom-data-grid-selection-action"
              onClick={() => onNotImplemented('Remover selecionados')}
            >
              <DeleteOutlineIcon />
              <span>Remover selecionados</span>
            </Button>
            <Button
              className="custom-data-grid-selection-action"
              onClick={() => onNotImplemented('Remover todos os clientes')}
            >
              <DeleteOutlineIcon />
              <span>Remover todos os clientes</span>
            </Button>
            <Button
              className="custom-data-grid-selection-action custom-data-grid-selection-action--cancel"
              onClick={() => onSelectionModelChange({ type: 'include', ids: new Set() })}
            >
              <CloseIcon />
              <span>Cancelar seleção</span>
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="customer-card-list-state" role="status">
          <CircularProgress size={26} />
          <Typography variant="body2">Carregando clientes...</Typography>
        </div>
      ) : customers.length > 0 ? (
        <div className="customer-card-grid">
          {customers.map((customer, index) => {
            const { city, state } = getCityAndState(customer.city || '');
            const fullName = `${customer.firstName} ${customer.lastName}`.trim();
            const selected = isCustomerSelected(customer.id);

            return (
              <Card
                className={`customer-list-card${selected ? ' customer-list-card--selected' : ''}`}
                key={customer.id}
                variant="outlined"
                style={{ '--card-index': index } as React.CSSProperties}
              >
                <CardContent>
                  <div className="customer-list-card-heading">
                    <div className="customer-list-card-identity">
                      <Checkbox
                        size="small"
                        checked={selected}
                        aria-label={`Selecionar ${fullName || `cliente ${customer.id}`}`}
                        onChange={(_event, checked) => handleSelectCustomer(customer.id, checked)}
                      />
                      <div className="customer-list-card-title">
                        <Typography variant="overline">Cliente #{customer.id}</Typography>
                        <Typography variant="h6" component="h3">
                          {fullName || 'Nome não informado'}
                        </Typography>
                      </div>
                    </div>
                    <div className="customer-list-card-actions">
                      <Tooltip title={`Visualizar detalhes de ${fullName}`} placement="top" arrow>
                        <Button
                          variant="outlined"
                          size="small"
                          aria-label={`Visualizar detalhes de ${fullName}`}
                          startIcon={<EditNoteIcon />}
                          onClick={() => onCustomerSelect(customer)}
                        >
                          Detalhes
                        </Button>
                      </Tooltip>
                      <Tooltip title={`Remover ${fullName}`} placement="top" arrow>
                        <IconButton
                          size="small"
                          aria-label={`Remover ${fullName}`}
                          onClick={() => onNotImplemented('Remover cliente')}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                  <dl className="customer-list-card-details">
                    <div>
                      <dt>E-mail</dt>
                      <dd>{customer.email || 'Não informado'}</dd>
                    </div>
                    <div>
                      <dt>Cidade</dt>
                      <dd>{state ? `${city}, ${state}` : city || 'Não informada'}</dd>
                    </div>
                    <div>
                      <dt>Empresa</dt>
                      <dd>{customer.company || 'Não informada'}</dd>
                    </div>
                    <div>
                      <dt>Cargo</dt>
                      <dd>{customer.title || 'Não informado'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="customer-card-list-state" role="status">
          <Typography variant="body2">
            Nenhum cliente encontrado para os filtros aplicados.
          </Typography>
        </div>
      )}

      <div className="customer-card-list-pagination">
        <TablePagination
          component="div"
          count={totalItems}
          page={pagination.page}
          rowsPerPage={pagination.pageSize}
          onPageChange={(_event, page) => onPaginationChange({ ...pagination, page })}
          onRowsPerPageChange={(event) =>
            onPaginationChange({ page: 0, pageSize: Number(event.target.value) })
          }
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Cards por página:"
          labelDisplayedRows={() => ''}
          disabled={loading}
          sx={{
            '& .MuiTablePagination-displayedRows, & .MuiTablePagination-actions': {
              display: 'none',
            },
          }}
        />
        <Pagination
          color="primary"
          count={pageCount}
          page={Math.min(pagination.page + 1, pageCount)}
          siblingCount={isSmallScreen ? 0 : 1}
          boundaryCount={isSmallScreen ? 0 : 1}
          aria-label="Navegação da lista de clientes"
          disabled={loading || totalItems === 0}
          onChange={(_event, page) => onPaginationChange({ ...pagination, page: page - 1 })}
          showFirstButton
          showLastButton
        />
      </div>
    </section>
  );
}
