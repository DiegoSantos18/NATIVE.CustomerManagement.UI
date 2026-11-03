import {
  ptBR,
  DataGrid,
  type DataGridProps,
  useGridApiContext,
  useGridSelector,
  gridPaginationModelSelector,
  gridPageCountSelector,
  gridRowCountSelector,
  Pagination,
  PaginationItem,
  TablePagination,
  Tooltip,
  Typography,
} from '@/components/common/mui';
import type { ReactNode } from 'react';
import './CustomDataGridComponent.scss';

type CheckboxPosition = 'first' | 'last';

export type CustomDataGridComponentProps<T extends object> = DataGridProps<T> & {
  checkboxPosition?: CheckboxPosition;
  selectionActions?: ReactNode;
  selectionLabel?: { singular: string; plural: string };
};

function CustomPagination() {
  const apiRef = useGridApiContext();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);

  return (
    <div className="custom-data-grid-pagination">
      <TablePagination
        component="div"
        count={rowCount}
        page={paginationModel.page}
        rowsPerPage={paginationModel.pageSize}
        onPageChange={(_event, newPage) => {
          apiRef.current.setPage(newPage);
        }}
        onRowsPerPageChange={(event) => {
          apiRef.current.setPageSize(parseInt(event.target.value, 10));
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={() => ''}
        sx={{
          '& .MuiTablePagination-displayedRows': {
            display: 'none',
          },
          '& .MuiTablePagination-actions': {
            display: 'none',
          },
        }}
      />

      <Pagination
        color="primary"
        count={pageCount}
        page={paginationModel.page + 1}
        onChange={(_event, value) => {
          apiRef.current.setPage(value - 1);
        }}
        siblingCount={1}
        showFirstButton
        showLastButton
        renderItem={(item) => {
          let tooltipTitle = '';

          if (item.type === 'first') tooltipTitle = 'Ir para a primeira página';
          if (item.type === 'last') tooltipTitle = 'Ir para a última página';
          if (item.type === 'next') tooltipTitle = 'Ir para a próxima página';
          if (item.type === 'previous') tooltipTitle = 'Ir para a página anterior';
          if (item.type === 'page') tooltipTitle = `Página ${item.page}`;
          if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
            tooltipTitle = 'Mais páginas';
          }

          const paginationItemNode = <PaginationItem {...item} />;

          if (!tooltipTitle) {
            return paginationItemNode;
          }

          return (
            <Tooltip key={item.type + (item.page ?? '')} title={tooltipTitle} placement="top" arrow>
              <span>{paginationItemNode}</span>
            </Tooltip>
          );
        }}
      />
    </div>
  );
}

export function CustomDataGridComponent<T extends object>({
  rows,
  columns,
  initialState,
  getRowClassName,
  slotProps,
  checkboxPosition = 'first',
  selectionActions,
  selectionLabel = { singular: 'item selecionado', plural: 'itens selecionados' },
  ...props
}: CustomDataGridComponentProps<T>) {
  const checkboxSelection = props.checkboxSelection ?? false;
  const selectedRowCount =
    props.rowSelectionModel?.type === 'exclude'
      ? Math.max(0, (props.rowCount ?? rows?.length ?? 0) - props.rowSelectionModel.ids.size)
      : (props.rowSelectionModel?.ids.size ?? 0);
  const checkboxField = '__check__';
  const checkboxWidth = 48;

  const firstField = columns[0]?.field;
  const lastField = columns[columns.length - 1]?.field;

  const stickyFirstField =
    checkboxSelection && checkboxPosition === 'first' ? checkboxField : firstField;

  const stickyLastField =
    checkboxSelection && checkboxPosition === 'last' ? checkboxField : lastField;

  const stickyLastDataField =
    checkboxSelection && checkboxPosition === 'last' ? lastField : undefined;

  return (
    <>
      {selectionActions && selectedRowCount > 0 && (
        <div
          className="custom-data-grid-selection-toolbar"
          role="toolbar"
          aria-label="Ações em lote"
        >
          <Typography className="custom-data-grid-selection-count" variant="body2">
            {selectedRowCount}{' '}
            {selectedRowCount === 1 ? selectionLabel.singular : selectionLabel.plural}
          </Typography>
          <div className="custom-data-grid-selection-actions">{selectionActions}</div>
        </div>
      )}
      {stickyFirstField && (
        <style>{`
          @media (min-width: 769px) {
            .custom-data-grid .MuiDataGrid-cell[data-field='${stickyFirstField}'],
            .custom-data-grid .MuiDataGrid-columnHeader[data-field='${stickyFirstField}'] {
              position: sticky;
              left: 0;
              z-index: 5;
              border-right: 1px solid var(--border-color);
              box-shadow: 2px 0 4px rgb(0 0 0 / 8%);
              transform: translateZ(0);
            }

            .custom-data-grid .MuiDataGrid-row.data-grid-row-even .MuiDataGrid-cell[data-field='${stickyFirstField}'] {
              background-color: var(--bg-surface) !important;
            }

            .custom-data-grid .MuiDataGrid-row.data-grid-row-odd .MuiDataGrid-cell[data-field='${stickyFirstField}'] {
              background-color: var(--bg-surface-hover) !important;
            }

            .custom-data-grid .MuiDataGrid-row:hover .MuiDataGrid-cell[data-field='${stickyFirstField}'] {
              background-color: var(--bg-surface-hover) !important;
            }

            .custom-data-grid .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell[data-field='${stickyFirstField}'] {
              background-color: var(--bg-surface-raised) !important;
            }

            .custom-data-grid .MuiDataGrid-columnHeader[data-field='${stickyFirstField}'] {
              z-index: 6;
              background-color: var(--bg-surface-hover) !important;
            }
          }
        `}</style>
      )}

      {stickyLastField && (
        <style>{`
          @media (min-width: 769px) {
            .custom-data-grid .MuiDataGrid-cell[data-field='${stickyLastField}'],
            .custom-data-grid .MuiDataGrid-columnHeader[data-field='${stickyLastField}'] {
              position: sticky;
              right: 0;
              z-index: 5;
              border-left: 1px solid var(--border-color);
              box-shadow: -2px 0 4px rgb(0 0 0 / 8%);
              transform: translateZ(0);
            }

            .custom-data-grid .MuiDataGrid-row.data-grid-row-even .MuiDataGrid-cell[data-field='${stickyLastField}'] {
              background-color: var(--bg-surface) !important;
            }

            .custom-data-grid .MuiDataGrid-row.data-grid-row-odd .MuiDataGrid-cell[data-field='${stickyLastField}'] {
              background-color: var(--bg-surface-hover) !important;
            }

            .custom-data-grid .MuiDataGrid-row:hover .MuiDataGrid-cell[data-field='${stickyLastField}'] {
              background-color: var(--bg-surface-hover) !important;
            }

            .custom-data-grid .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell[data-field='${stickyLastField}'] {
              background-color: var(--bg-surface-raised) !important;
            }

            .custom-data-grid .MuiDataGrid-columnHeader[data-field='${stickyLastField}'] {
              z-index: 6;
              background-color: var(--bg-surface-hover) !important;
            }
          }
        `}</style>
      )}

      {stickyLastDataField && (
        <style>{`
          @media (min-width: 769px) {
            .custom-data-grid .MuiDataGrid-cell[data-field='${stickyLastDataField}'],
            .custom-data-grid .MuiDataGrid-columnHeader[data-field='${stickyLastDataField}'] {
              position: sticky;
              right: ${checkboxWidth}px;
              z-index: 5;
              border-left: 1px solid var(--border-color);
              box-shadow: -2px 0 4px rgb(0 0 0 / 8%);
              transform: translateZ(0);
            }

            .custom-data-grid .MuiDataGrid-row.data-grid-row-even .MuiDataGrid-cell[data-field='${stickyLastDataField}'] {
              background-color: var(--bg-surface) !important;
            }

            .custom-data-grid .MuiDataGrid-row.data-grid-row-odd .MuiDataGrid-cell[data-field='${stickyLastDataField}'] {
              background-color: var(--bg-surface-hover) !important;
            }

            .custom-data-grid .MuiDataGrid-row:hover .MuiDataGrid-cell[data-field='${stickyLastDataField}'] {
              background-color: var(--bg-surface-hover) !important;
            }

            .custom-data-grid .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell[data-field='${stickyLastDataField}'] {
              background-color: var(--bg-surface-raised) !important;
            }

            .custom-data-grid .MuiDataGrid-columnHeader[data-field='${stickyLastDataField}'] {
              z-index: 6;
              background-color: var(--bg-surface-hover) !important;
            }
          }
        `}</style>
      )}

      <DataGrid
        className="custom-data-grid"
        rows={rows}
        columns={columns}
        autoHeight
        disableVirtualization
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        getRowClassName={
          getRowClassName ||
          ((params) =>
            params.indexRelativeToCurrentPage % 2 === 0
              ? 'data-grid-row-even'
              : 'data-grid-row-odd')
        }
        initialState={{
          ...initialState,
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 5,
            },
            ...initialState?.pagination,
          },
        }}
        slots={{
          pagination: CustomPagination,
        }}
        localeText={{
          ...ptBR.components.MuiDataGrid.defaultProps.localeText,
          noRowsLabel: 'Nenhum registro encontrado',
          noResultsOverlayLabel: 'Nenhum resultado encontrado',
        }}
        slotProps={{
          ...slotProps,
        }}
        {...props}
      />
    </>
  );
}
