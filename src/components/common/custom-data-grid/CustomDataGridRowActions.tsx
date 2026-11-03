import { Fragment, useState, type ReactNode } from 'react';
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MoreVertIcon,
  Tooltip,
} from '@/components/common/mui';

export interface CustomDataGridRowAction {
  label: string;
  icon: ReactNode;
  onSelect: () => void;
  dividerBefore?: boolean;
}

interface CustomDataGridRowActionsProps {
  actions: CustomDataGridRowAction[];
  ariaLabel: string;
}

export function CustomDataGridRowActions({ actions, ariaLabel }: CustomDataGridRowActionsProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title={ariaLabel} placement="top" arrow>
        <IconButton
          className="custom-data-grid-row-actions-trigger"
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actions.map((action) => (
          <Fragment key={action.label}>
            {action.dividerBefore && <Divider />}
            <MenuItem
              onClick={() => {
                handleClose();
                action.onSelect();
              }}
            >
              <ListItemIcon>{action.icon}</ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          </Fragment>
        ))}
      </Menu>
    </>
  );
}
