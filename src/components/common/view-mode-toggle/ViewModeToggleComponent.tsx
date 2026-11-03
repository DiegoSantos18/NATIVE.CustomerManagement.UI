import { GridViewIcon, IconButton, Tooltip, ViewListIcon } from '@/components/common/mui';
import './ViewModeToggleComponent.scss';

export type DataViewMode = 'grid' | 'cards';

interface ViewModeToggleComponentProps {
  value: DataViewMode;
  onChange: (mode: DataViewMode) => void;
  label?: string;
}

export function ViewModeToggleComponent({
  value,
  onChange,
  label = 'Modo de visualização',
}: ViewModeToggleComponentProps) {
  return (
    <div className="view-mode-toggle" role="group" aria-label={label}>
      <Tooltip title="Visualizar em tabela" placement="top" arrow>
        <IconButton
          size="small"
          aria-label="Visualizar em tabela"
          aria-pressed={value === 'grid'}
          onClick={() => onChange('grid')}
        >
          <ViewListIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Visualizar em cards" placement="top" arrow>
        <IconButton
          size="small"
          aria-label="Visualizar em cards"
          aria-pressed={value === 'cards'}
          onClick={() => onChange('cards')}
        >
          <GridViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
