export interface SelectionDTO {
  seq: number;
  name: string;
}

export interface PaginationDTO {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

export interface PagesDTO {
  totalRecords: number;
  pageSize: number;
  totalPages: number;
};