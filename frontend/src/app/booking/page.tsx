"use client";

import Select from "@/components/Select";
import CheckboxGroup from "@/components/CheckboxGroup";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import { useAtom } from "jotai";
import { roomSearchAtom } from "./context";

interface RoomSearchFormProps {
  onSearch: (dto: RoomSearchDTO) => void;
}

export default function RoomSearchForm({ onSearch }: RoomSearchFormProps) {
  const [form, setForm] = useAtom(roomSearchAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-md p-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {/* Start Date */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Start Date</label>
        <input
          type="date"
          value={form.start.toISOString().substring(0, 10)}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, start: new Date(e.target.value) }))
          }
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* End Date */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">End Date</label>
        <input
          type="date"
          value={form.end.toISOString().substring(0, 10)}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, end: new Date(e.target.value) }))
          }
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Room Type */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Room Type</label>
        <Select
          className="border px-3 py-2 rounded"
          endpoint="/common/room-types"
          value={form.roomTypeSeq}
          onChange={(val) => setForm((prev) => ({ ...prev, roomTypeSeq: val }))}
          placeholder="Any"
        />
      </div>

      {/* Beds (dynamic checkboxes) */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Beds</label>
        <CheckboxGroup
          endpoint="/common/room-beds"
          value={form.roomBedSeqList}
          onChange={(val) => setForm((prev) => ({ ...prev, roomBedSeqList: val }))}
        />
      </div>

      {/* Tag */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Tag</label>
        <Select
          className="border px-3 py-2 rounded"
          endpoint="/common/tags"
          value={form.tagSeq}
          onChange={(val) => setForm((prev) => ({ ...prev, tagSeq: val }))}
          placeholder="Any"
        />
      </div>

      {/* Limit */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Limit</label>
        <input
          type="number"
          min={1}
          value={form.limit}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, limit: Number(e.target.value) }))
          }
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Offset */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Offset</label>
        <input
          type="number"
          min={0}
          value={form.offset}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, offset: Number(e.target.value) }))
          }
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Submit */}
      <div className="flex items-end">
        <button
          type="submit"
          className="px-4 py-2 bg-gold text-black font-medium hover:bg-black hover:text-gold transition rounded"
        >
          Search
        </button>
      </div>
    </form>
  );
}
