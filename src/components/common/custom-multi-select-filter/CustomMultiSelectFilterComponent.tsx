import { useMemo, useState, type MouseEvent } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FilterListIcon,
  FormControlLabel,
  InputAdornment,
  Popover,
  SearchIcon,
  TextField,
  Typography,
} from '@/components/common/mui';
import './CustomMultiSelectFilterComponent.scss';

interface CustomMultiSelectFilterComponentProps {
  options: string[];
  value: string[];
  onApply: (selectedValues: string[]) => void;
  onClear?: () => void;
}

export function CustomMultiSelectFilterComponent({
  options,
  value,
  onApply,
  onClear,
}: CustomMultiSelectFilterComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [search, setSearch] = useState('');
  const [draftValues, setDraftValues] = useState<string[]>(value);

  const open = Boolean(anchorEl);

  const allSelected = draftValues.length === options.length && options.length > 0;
  const someSelected = draftValues.length > 0 && draftValues.length < options.length;

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return options;
    }

    return options.filter((option) => option.toLocaleLowerCase().includes(normalizedSearch));
  }, [options, search]);

  const displayValue =
    draftValues.length === 0 || draftValues.length === options.length
      ? 'Todas as cidades'
      : `${draftValues.length} ${draftValues.length === 1 ? 'cidade selecionada' : 'cidades selecionadas'}`;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setDraftValues(value.length === 0 ? options : value);
    setSearch('');
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearch('');
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setDraftValues([...options]);
    } else {
      setDraftValues([]);
    }
  };

  const handleToggleOption = (option: string, checked: boolean) => {
    setDraftValues((current) => {
      if (checked) {
        if (current.includes(option)) return current;
        return [...current, option];
      }
      return current.filter((item) => item !== option);
    });
  };

  const handleClear = () => {
    setDraftValues([]);
    if (onClear) {
      onClear();
    } else {
      onApply([]);
    }
    handleClose();
  };

  const handleApply = () => {
    const finalValues = draftValues.length === options.length ? [] : draftValues;
    onApply(finalValues);
    handleClose();
  };

  return (
    <Box className="custom-multi-select-filter">
      <Box className="custom-multi-select-filter-label">
        <FilterListIcon />
        <Typography variant="body2">Filtrar por cidades</Typography>
      </Box>

      <Button
        className="custom-multi-select-filter-trigger"
        variant="outlined"
        onClick={handleOpen}
        disabled={options.length === 0}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="custom-multi-select-filter-value">{displayValue}</span>

        <span
          className={`custom-multi-select-filter-chevron ${open ? 'open' : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            className: 'custom-multi-select-filter-popover',
          },
        }}
      >
        <Box className="custom-multi-select-filter-content">
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar cidade..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="custom-multi-select-filter-search"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box className="custom-multi-select-filter-options">
            <FormControlLabel
              className="custom-multi-select-filter-option custom-multi-select-filter-select-all"
              control={
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(event) => handleToggleAll(event.target.checked)}
                />
              }
              label={<Typography variant="body2">Selecionar todas</Typography>}
            />

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const checked = draftValues.includes(option);

                return (
                  <FormControlLabel
                    key={option}
                    className="custom-multi-select-filter-option"
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => handleToggleOption(option, event.target.checked)}
                      />
                    }
                    label={<Typography variant="body2">{option}</Typography>}
                  />
                );
              })
            ) : (
              <Typography variant="body2" className="custom-multi-select-filter-empty">
                Nenhuma cidade encontrada.
              </Typography>
            )}
          </Box>

          <Box className="custom-multi-select-filter-actions">
            <Button variant="outlined" onClick={handleClear}>
              Limpar
            </Button>

            <Button variant="contained" onClick={handleApply}>
              Aplicar
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
