export interface Paginate<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
