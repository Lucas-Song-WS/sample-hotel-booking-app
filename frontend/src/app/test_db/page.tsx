"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTestList } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["testDbList"],
    queryFn: fetchTestList,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test DB List</h1>
      <ul className="list-disc pl-6">
        {data.map((row: { seq: number; val: string }) => (
          <li
            key={row.seq}
            className="cursor-pointer hover:text-blue-600"
            onClick={() => router.push(`/test_db/${row.seq}`)}
          >
            {row.seq} — {row.val}
          </li>
        ))}
      </ul>
    </div>
  );
}
