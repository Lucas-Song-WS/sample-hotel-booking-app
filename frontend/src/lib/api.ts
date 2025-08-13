export const getApiUrl = () => {
  if (typeof window === "undefined") {
    return process.env.API_URL_INTERNAL!;
  }
  return process.env.NEXT_PUBLIC_API_URL!;
};

export async function fetchTestList() {
  const res = await fetch(`${getApiUrl()}/test_db`);
  return res.json();
}

export async function fetchTestDetail(seq: number) {
  const res = await fetch(`${getApiUrl()}/test_db/${seq}`);
  return res.json();
}
