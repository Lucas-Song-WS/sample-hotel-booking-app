export interface BookingSaveDTO {
  guestSeq: number;
  start: string;
  end: string;
  remarks?: string;
  rooms: {
    roomTypeSeq: number;
    numAdults: number;
    numChildren?: number;
    roomViewSeq?: number;
    roomSmokingYn?: boolean;
    additionalCharges?: {
      chargeSeq: number;
    }[];
  }[];
}
