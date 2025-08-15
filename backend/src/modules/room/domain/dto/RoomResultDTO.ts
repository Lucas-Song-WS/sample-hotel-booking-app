export interface RoomResultDTO {
  roomTypeSeq: number;
  roomTypeName: string;
  roomTypeDesc: string;
  beds: {
    bed_name: string;
    bed_qty: number;
  }[];
  amenities: {
    amenity_name: string;
  }[];
  smokingAvailable: boolean;
  nonsmokingAvailable: boolean;
  views: string[];
  totalPrice: number;
}
