import type { PaginationParams } from '@/api/common';

export interface ListCustomersParams {
  pagination?: PaginationParams;
  filters?: {
    cities?: string[];
  };
}
