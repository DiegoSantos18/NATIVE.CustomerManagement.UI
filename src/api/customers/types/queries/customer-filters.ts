import type { DataGridFilterParams } from '@/api/common/types';

export interface CustomerFilters extends DataGridFilterParams {
  cities?: string[];
}
