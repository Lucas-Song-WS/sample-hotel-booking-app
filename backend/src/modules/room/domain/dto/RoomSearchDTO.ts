export interface RoomSearchDTO {
    start: Date;
    end: Date;
    roomTypeSeq?: number;
    roomBedSeqList?: number[];
    tagSeq?: number;
    //priceRange?
}