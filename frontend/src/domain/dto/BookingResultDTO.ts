export interface BookingResultDTO {
  bookingSeq: number;
  bookingId: string;
  start: string;
  end: string;
  remarks: string;
  status: string;
  rooms: {
    roomTypeSeq: number;
    roomTypeName: string;
    numAdults: number;
    numChildren: number;
    roomViewSeq?: number;
    roomViewName?: string;
    roomSmokingYn?: boolean;
    charges: {
      chargeDesc: string;
      chargeAmount: number;
    }[];
  }[];
}
