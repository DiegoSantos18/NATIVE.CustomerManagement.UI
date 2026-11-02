export type SortOrder = 'asc' | 'desc';

export interface SortParams<TField extends string = string> {
  sortBy?: TField;
  sortOrder?: SortOrder;
}
