"use client";

import { useQuery } from "@tanstack/react-query";
import { SelectionDTO } from "@/domain/dto/CommonDTO";

interface CheckboxGroupProps {
  endpoint: string;
  value: number[];
  onChange: (value: number[]) => void;
  optionClassName?: string;
  checkboxClassName?: string;
  labelClassName?: string;
}

export default function CheckboxGroup({
  endpoint,
  value,
  onChange,
  optionClassName,
  checkboxClassName,
  labelClassName,
}: CheckboxGroupProps) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  const { data, isLoading, error } = useQuery<SelectionDTO[], Error>({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch options");
      return res.json();
    },
  });

  const toggle = (seq: number) => {
    if (value.includes(seq)) onChange(value.filter((v) => v !== seq));
    else onChange([...value, seq]);
  };

  if (isLoading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">Error loading options</div>;

  return (
    <>
      {data?.map((opt) => (
        <label key={opt.seq} className={optionClassName}>
          <input
            className={checkboxClassName}
            type="checkbox"
            checked={value.includes(opt.seq)}
            onChange={() => toggle(opt.seq)}
          />
          <span className={labelClassName}>{opt.name}</span>
        </label>
      ))}
    </>
  );
}
