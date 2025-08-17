"use client";

import { useQuery } from "@tanstack/react-query";
import { SelectionDTO } from "@/domain/dto/CommonDTO";

interface RadioGroupProps {
  endpoint: string;
  value?: number;
  onChange: (value: number) => void;
  optionClassName?: string;
  radioClassName?: string;
  labelClassName?: string;
}

export default function RadioGroup({
  endpoint,
  value,
  onChange,
  optionClassName,
  radioClassName,
  labelClassName,
}: RadioGroupProps) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  const { data, isLoading, error } = useQuery<SelectionDTO[], Error>({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch options");
      return res.json();
    },
  });

  if (isLoading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">Error loading options</div>;

  return (
    <>
      {data?.map((opt) => (
        <label key={opt.seq} className={optionClassName}>
          <input
            className={radioClassName}
            type="radio"
            checked={value === opt.seq}
            onChange={() => onChange(opt.seq)}
          />
          <span className={labelClassName}>{opt.name}</span>
        </label>
      ))}
    </>
  );
}
