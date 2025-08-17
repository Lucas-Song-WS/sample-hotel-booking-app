"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { RoomResultDTO } from "@/domain/dto/RoomResultDTO";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import { PagesDTO, PaginationDTO } from "@/domain/dto/CommonDTO";
import { fetchRooms, fetchRoomsPages, fetchBookingPreview } from "../api";
import RoomCard from "./RoomCard";
import { selectedRoomsAtom, bookingPreviewAtom } from "../context";
import { BookingRoomDTO } from "../domain/dto/BookingRoom";

interface RoomResultsProps {
  search: RoomSearchDTO;
  pagination: PaginationDTO;
  setPagination: (pagination: PaginationDTO) => void;
}

export default function RoomResults({
  search,
  pagination,
  setPagination,
}: RoomResultsProps) {
  const [selectedRooms, setSelectedRooms] = useAtom(selectedRoomsAtom);
  const [, setBookingPreview] = useAtom(bookingPreviewAtom);

  const {
    data: rooms,
    isLoading,
    isError,
  } = useQuery<RoomResultDTO[]>({
    queryKey: ["rooms", search, pagination],
    queryFn: () => fetchRooms(search, pagination),
  });

  const { data: pages } = useQuery<PagesDTO>({
    queryKey: ["rooms-pages", search, pagination],
    queryFn: () => fetchRoomsPages(search, pagination),
  });

  const goToPage = (page: number) => {
    setPagination({ ...pagination, pageNumber: page });
  };

  const toggleSort = (field: keyof RoomResultDTO) => {
    const direction =
      pagination.sortField === field && pagination.sortDirection === "asc"
        ? "desc"
        : "asc";
    setPagination({
      ...pagination,
      pageNumber: 1,
      sortField: field,
      sortDirection: direction,
    });
  };

  const handleAddRoom = async (bookingRoom: BookingRoomDTO) => {
    setSelectedRooms((prev) => [...prev, bookingRoom]);
    const newRooms = [...selectedRooms, bookingRoom];
    const preview = await fetchBookingPreview(
      newRooms,
      search.start,
      search.end
    );
    setBookingPreview(preview);
  };

  if (isLoading) return <p>Loading rooms...</p>;
  if (isError) return <p className="text-red-500">Error loading rooms.</p>;
  if (!rooms || rooms.length === 0) return <p>No rooms found.</p>;

  return (
    <div className="">
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="px-2 py-1">Sort by:</span>{" "}
        <button
          onClick={() => toggleSort("roomTypeName")}
          className={`px-2 py-1 border border-gold font-medium text-gray-800 hover:bg-gold hover:text-black transition ${
            pagination.sortField === "roomTypeName" ? "bg-gold text-black" : ""
          }`}
        >
          Room Type Name
          {pagination.sortField === "roomTypeName"
            ? pagination.sortDirection === "asc"
              ? "↑"
              : "↓"
            : ""}
        </button>
        <button
          onClick={() => toggleSort("roomTypeMaxOccupancy")}
          className={`px-2 py-1 border border-gold font-medium text-gray-800 hover:bg-gold hover:text-black transition ${
            pagination.sortField === "roomTypeMaxOccupancy"
              ? "bg-gold text-black"
              : ""
          }`}
        >
          Max Occupancy
          {pagination.sortField === "roomTypeMaxOccupancy"
            ? pagination.sortDirection === "asc"
              ? "↑"
              : "↓"
            : ""}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.roomTypeSeq}
            room={room}
            onAddRoom={handleAddRoom}
          />
        ))}
      </div>

      {pages && pages.totalPages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            className="px-4 py-2 border border-gold text-gray-800 hover:bg-gold hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pagination.pageNumber === 1}
            onClick={() => goToPage(pagination.pageNumber - 1)}
          >
            Previous
          </button>

          {Array.from({ length: pages.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                className={`px-4 py-2 border border-gold font-medium transition ${
                  page === pagination.pageNumber
                    ? "bg-gold text-black"
                    : "text-gray-800 hover:bg-gold hover:text-black"
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="px-4 py-2 border border-gold text-gray-800 hover:bg-gold hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pagination.pageNumber === pages.totalPages}
            onClick={() => goToPage(pagination.pageNumber + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
