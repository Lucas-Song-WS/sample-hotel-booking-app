export interface RoomResultDTO {
  roomTypeSeq: number;
  roomTypeName: string;
  roomTypeDesc: string;
  roomTypeMaxOccupancy: number;
  beds: {
    bedName: string;
    bedQty: number;
  }[];
  amenities: {
    amenityName: string;
  }[];
  smokingAvailable: boolean;
  nonsmokingAvailable: boolean;
  views: {
    viewSeq: number;
    viewName: string;
  }[];
  totalPrice: number;
}
