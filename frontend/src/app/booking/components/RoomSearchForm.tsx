"use client";

import { FormEvent } from "react";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import Select from "@/components/Select";
import CheckboxGroup from "@/components/CheckboxGroup";

interface Props {
  preSearch: RoomSearchDTO;
  setPreSearch: (dto: RoomSearchDTO) => void;
  onSearch: () => void;
  onReset?: () => void;
}

export default function RoomSearchForm({
  preSearch,
  setPreSearch,
  onSearch,
  onReset,
}: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6 mb-8 bg-white p-6 shadow border border-gold/30"
    >
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Start Date
        </label>
        <input
          type="date"
          value={preSearch.start}
          onChange={(e) =>
            setPreSearch({ ...preSearch, start: e.target.value })
          }
          className="border border-gold/50 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold transition"
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Room Type
        </label>
        <Select
          className="border border-gold/50 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold transition"
          endpoint="/common/room-types"
          value={preSearch.roomTypeSeq}
          onChange={(val) => setPreSearch({ ...preSearch, roomTypeSeq: val })}
          placeholder="Any"
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Tag
        </label>
        <Select
          className="border border-gold/50 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold transition"
          endpoint="/common/tags"
          value={preSearch.tagSeq}
          onChange={(val) => setPreSearch({ ...preSearch, tagSeq: val })}
          placeholder="Any"
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-800 mb-1">
          End Date
        </label>
        <input
          type="date"
          value={preSearch.end}
          onChange={(e) => setPreSearch({ ...preSearch, end: e.target.value })}
          className="border border-gold/50 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold transition"
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Beds
        </label>
        <div className="flex flex-row gap-4 h-full items-center">
          <CheckboxGroup
            checkboxClassName="border border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold transition"
            labelClassName="ml-2"
            endpoint="/common/room-beds"
            value={preSearch.roomBedSeqList}
            onChange={(val) =>
              setPreSearch({ ...preSearch, roomBedSeqList: val })
            }
          />
        </div>
      </div>

      <div className="flex justify-end items-end gap-3">
        <button
          type="submit"
          className="px-6 py-2 bg-gold text-black font-medium hover:bg-black hover:text-gold transition border border-gold"
        >
          Search
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-2 bg-gray-200 text-gray-900 hover:bg-gray-300 transition border border-gray-300"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}
