export interface BookingResultDTO {
  bookingSeq: number;
  bookingId: string;
  start: string;
  end: string;
  remarks: string;
  status: string;
  rooms: {
    roomTypeSeq: number;
    numAdults: number;
    numChildren: number;
    roomViewSeq?: number;
    roomSmokingYn?: boolean;
    charges: {
      chargeDesc: string;
      chargeAmount: number;
    }[];
  }[];
}
