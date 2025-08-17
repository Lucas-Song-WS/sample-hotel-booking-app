/*export interface RoomTypeDTO {
  roomTypeSeq: number;
  roomTypeName: string;
}

export interface RoomBedDTO {
  roomBedSeq: number;
  roomBedName: string;
}

export interface TagDTO {
  tagSeq: number;
  tagName: string;
}*/

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