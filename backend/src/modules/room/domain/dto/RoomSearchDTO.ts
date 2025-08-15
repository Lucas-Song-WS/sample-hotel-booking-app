export interface RoomSearchDTO {
    start: Date;
    end: Date;
    roomTypeSeq?: number;
    roomBedSeqList?: number[];
    limit?: number;
    offset?: number;
    tagSeq?: number;
    //priceRange?
}