import { DataGrid, type DataGridProps } from '@/components/common/mui';
import { ptBR } from '@mui/x-data-grid/locales';
import './CustomDataGridComponent.scss';

export type CustomDataGridComponentProps<T extends object> = DataGridProps<T>;

export function CustomDataGridComponent<T extends object>({
  rows,
  columns,
  initialState,
  getRowClassName,
  slotProps,
  ...props
}: CustomDataGridComponentProps<T>) {
  const firstField = columns[0]?.field;
  const lastField = columns[columns.length - 1]?.field;

  return (
    <>
      {/* Injeta os seletores dinâmicos baseados no primeiro e último field das colunas (limitação do MUI Community) */}
      {firstField && lastField && (
        <style>{`
          .custom-data-grid .MuiDataGrid-cell[data-field='${firstField}'],
          .custom-data-grid .MuiDataGrid-columnHeader[data-field='${firstField}'] {
            position: sticky;
            left: 0;
            z-index: 5;
            background-color: var(--bg-surface) !important;
            border-right: 1px solid var(--border-color);
            box-shadow: 2px 0 4px rgb(0 0 0 / 8%);
            transform: translateZ(0);
            will-change: transform;
          }
          .custom-data-grid .MuiDataGrid-columnHeader[data-field='${firstField}'] {
            z-index: 6;
            background-color: var(--bg-surface-hover) !important;
          }

          .custom-data-grid .MuiDataGrid-cell[data-field='${lastField}'],
          .custom-data-grid .MuiDataGrid-columnHeader[data-field='${lastField}'] {
            position: sticky;
            right: 0;
            z-index: 5;
            background-color: var(--bg-surface) !important;
            border-left: 1px solid var(--border-color);
            box-shadow: -2px 0 4px rgb(0 0 0 / 8%);
            transform: translateZ(0);
            will-change: transform;
          }
          .custom-data-grid .MuiDataGrid-columnHeader[data-field='${lastField}'] {
            z-index: 6;
            background-color: var(--bg-surface-hover) !important;
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
            params.indexRelativeToCurrentPage % 2 === 0 ? 'city-row-even' : 'city-row-odd')
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
        localeText={{
          ...ptBR.components.MuiDataGrid.defaultProps.localeText,
          noRowsLabel: 'Nenhum registro encontrado',
          noResultsOverlayLabel: 'Nenhum resultado encontrado',
        }}
        slotProps={{
          pagination: {
            labelDisplayedRows: ({
              from,
              to,
              count,
            }: {
              from: number;
              to: number;
              count: number;
            }) => {
              const currentCount = to - from + 1;

              return `${currentCount} de ${count !== -1 ? count : to}`;
            },
          },
          ...slotProps,
        }}
        {...props}
      />
    </>
  );
}
