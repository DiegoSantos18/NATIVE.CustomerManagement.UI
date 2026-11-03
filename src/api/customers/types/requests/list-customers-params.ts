import type { QueryParams } from '@/api/common/types';
import type { CustomerFilters } from '../queries/customer-filters';
import type { CustomerSortField } from '../queries/customer-sort-field';

export type ListCustomersParams = QueryParams<CustomerFilters, CustomerSortField>;
