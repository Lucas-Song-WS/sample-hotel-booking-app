"use client";

import { useQuery } from "@tanstack/react-query";
import { SelectionDTO } from "@/domain/dto/CommonDTO";

interface RadioGroupProps {
  endpoint: string;
  value?: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function RadioGroup({
  endpoint,
  value,
  onChange,
  className,
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

  if (isLoading) return <div className={className}>Loading...</div>;
  if (error) return <div className={className}>Error loading options</div>;

  return (
    <>
      {data?.map((opt) => (
        <label key={opt.seq} className={className}>
          <input
            type="radio"
            checked={value === opt.seq}
            onChange={() => onChange(opt.seq)}
          />
          {opt.name}
        </label>
      ))}
    </>
  );
}
