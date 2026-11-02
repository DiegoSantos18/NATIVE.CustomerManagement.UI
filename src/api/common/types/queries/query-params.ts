import type { PaginationParams } from './pagination-params';
import type { SortParams } from './sort-params';

export interface QueryParams<TFilter = unknown, TSortField extends string = string> {
  pagination: PaginationParams;
  filters?: TFilter;
  sort?: SortParams<TSortField>;
}
