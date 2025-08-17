export interface RoomSearchDTO {
    start: string;
    end: string;
    roomTypeSeq?: number;
    roomBedSeqList: number[];
    tagSeq?: number;
    //priceRange?
}