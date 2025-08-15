"use client";

import { SelectionDTO } from "@/domain/dto/CommonDTO";
import { useQuery } from "@tanstack/react-query";

interface SelectProps {
  endpoint: string;
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

export default function Select({
  endpoint,
  value,
  onChange,
  placeholder,
  className = "",
}: SelectProps) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  const { data, isLoading, error } = useQuery<SelectionDTO[], Error>({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch options");
      return res.json();
    },
  });

  return (
    <>
      {isLoading ? (
        <div className={`text-gray-500 ${className}`}>Loading...</div>
      ) : error ? (
        <div className={`text-red-500 ${className}`}>
          Error loading options
        </div>
      ) : (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`${className}`}
          disabled={isLoading || !!error}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {data?.map((opt) => (
            <option key={opt.seq} value={opt.seq}>
              {opt.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
