export interface PageDto<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isFirst: boolean;
  isLast: boolean;
}
