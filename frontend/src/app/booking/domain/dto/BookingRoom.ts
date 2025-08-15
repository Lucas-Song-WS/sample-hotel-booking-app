export interface BookingRoomDTO {
  roomTypeSeq: number;
  numAdults: number;
  numChildren?: number;
  roomViewSeq?: number;
  roomSmokingYn?: boolean;
  additionalCharges?: {
    chargeSeq: number;
  }[];
}
