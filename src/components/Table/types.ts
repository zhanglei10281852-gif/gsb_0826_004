export interface NTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  width?: string;
}

export interface NTableProps<T> {
  data: T[];
  columns: NTableColumn<T>[];
  striped?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  virtualScroll?: boolean;
  rowHeight?: number;
  visibleRows?: number;
  pageSize?: number;
  currentPage?: number;
}
