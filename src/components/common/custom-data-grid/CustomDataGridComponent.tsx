import { ptBR, DataGrid, type DataGridProps } from '@/components/common/mui';
import './CustomDataGridComponent.scss';

type CheckboxPosition = 'first' | 'last';

export type CustomDataGridComponentProps<T extends object> = DataGridProps<T> & {
  checkboxPosition?: CheckboxPosition;
};

export function CustomDataGridComponent<T extends object>({
  rows,
  columns,
  initialState,
  getRowClassName,
  slotProps,
  checkboxPosition = 'first',
  ...props
}: CustomDataGridComponentProps<T>) {
  const checkboxSelection = props.checkboxSelection ?? false;
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

            .custom-data-grid .MuiDataGrid-row.city-row-even .MuiDataGrid-cell[data-field='${stickyFirstField}'] {
              background-color: var(--bg-surface) !important;
            }

            .custom-data-grid .MuiDataGrid-row.city-row-odd .MuiDataGrid-cell[data-field='${stickyFirstField}'] {
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

            .custom-data-grid .MuiDataGrid-row.city-row-even .MuiDataGrid-cell[data-field='${stickyLastField}'] {
              background-color: var(--bg-surface) !important;
            }

            .custom-data-grid .MuiDataGrid-row.city-row-odd .MuiDataGrid-cell[data-field='${stickyLastField}'] {
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

            .custom-data-grid .MuiDataGrid-row.city-row-even .MuiDataGrid-cell[data-field='${stickyLastDataField}'] {
              background-color: var(--bg-surface) !important;
            }

            .custom-data-grid .MuiDataGrid-row.city-row-odd .MuiDataGrid-cell[data-field='${stickyLastDataField}'] {
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
