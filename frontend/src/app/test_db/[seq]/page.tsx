"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTestDetail } from "@/lib/api";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const seq = Number(params.seq);

  const { data, isLoading } = useQuery({
    queryKey: ["testDbDetail", seq],
    queryFn: () => fetchTestDetail(seq),
    enabled: !!seq,
  });

  if (!seq) return <p>Loading ID...</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Detail for #{seq}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
